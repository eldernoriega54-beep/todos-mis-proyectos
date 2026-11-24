package com.example.tls.ml

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Matrix
import android.util.Log
import com.google.mediapipe.framework.image.BitmapImageBuilder
import com.google.mediapipe.framework.image.MPImage
import com.google.mediapipe.tasks.core.BaseOptions
import com.google.mediapipe.tasks.vision.core.RunningMode
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarker
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarkerResult
import kotlin.math.abs
import kotlin.math.hypot

data class NormalizedPoint(val x: Float, val y: Float, val z: Float = 0f)

data class HandRecognitionResult(
    val detected: Boolean,
    val landmarks: List<NormalizedPoint> = emptyList(),
    val fingerState: String = "0,0,0,0,0", // [Pulgar, Índice, Medio, Anular, Meñique]
    val letterOrWord: String = "",
    val confidence: Float = 0f,
    val description: String = ""
)

class HandGestureRecognizer(private val context: Context) {

    private var handLandmarker: HandLandmarker? = null
    private var isInitialized = false

    companion object {
        private const val TAG = "HandGestureRecognizer"
        private const val MODEL_NAME = "hand_landmarker.task"

        // Conexiones anatómicas de los 21 puntos
        val HAND_CONNECTIONS = listOf(
            Pair(0, 1), Pair(1, 2), Pair(2, 3), Pair(3, 4),
            Pair(0, 5), Pair(5, 6), Pair(6, 7), Pair(7, 8),
            Pair(5, 9), Pair(9, 10), Pair(10, 11), Pair(11, 12),
            Pair(9, 13), Pair(13, 14), Pair(14, 15), Pair(15, 16),
            Pair(13, 17), Pair(17, 18), Pair(18, 19), Pair(19, 20),
            Pair(0, 17)
        )
    }

    init {
        setupLandmarker()
    }

    private fun setupLandmarker() {
        try {
            val baseOptions = BaseOptions.builder()
                .setModelAssetPath(MODEL_NAME)
                .build()

            val options = HandLandmarker.HandLandmarkerOptions.builder()
                .setBaseOptions(baseOptions)
                .setNumHands(1)
                .setMinHandDetectionConfidence(0.5f)
                .setMinTrackingConfidence(0.5f)
                .setMinHandPresenceConfidence(0.5f)
                .setRunningMode(RunningMode.IMAGE)
                .build()

            handLandmarker = HandLandmarker.createFromOptions(context, options)
            isInitialized = true
            Log.d(TAG, "MediaPipe HandLandmarker inicializado con éxito")
        } catch (e: Exception) {
            Log.e(TAG, "Error inicializando MediaPipe HandLandmarker", e)
            isInitialized = false
        }
    }

    fun processFrame(bitmap: Bitmap, rotationDegrees: Int): HandRecognitionResult {
        if (!isInitialized || handLandmarker == null) {
            return HandRecognitionResult(detected = false)
        }

        var rotatedBitmap: Bitmap? = null
        return try {
            val matrix = Matrix()
            if (rotationDegrees != 0) {
                matrix.postRotate(rotationDegrees.toFloat())
            }

            // Escala a resolución optimizada (360px de ancho) para latencia menor a 20ms
            val targetWidth = 360
            val scale = targetWidth.toFloat() / bitmap.width.toFloat()
            matrix.postScale(scale, scale)

            rotatedBitmap = Bitmap.createBitmap(
                bitmap, 0, 0, bitmap.width, bitmap.height, matrix, true
            )

            val mpImage: MPImage = BitmapImageBuilder(rotatedBitmap).build()
            val result: HandLandmarkerResult = handLandmarker!!.detect(mpImage)

            val landmarksList = result.landmarks()
            if (landmarksList.isEmpty() || landmarksList[0].isEmpty()) {
                return HandRecognitionResult(detected = false)
            }

            val rawLandmarks = landmarksList[0]
            val points = rawLandmarks.map { NormalizedPoint(it.x(), it.y(), it.z()) }

            classifyGesture(points)
        } catch (e: Exception) {
            Log.e(TAG, "Error procesando frame", e)
            HandRecognitionResult(detected = false)
        } finally {
            rotatedBitmap?.recycle()
        }
    }

    /**
     * Clasificación estricta de 14 LETRAS del alfabeto dactilológico LSM.
     * CERO PALABRAS: Android y la app las forman letra por letra.
     */
    private fun classifyGesture(points: List<NormalizedPoint>): HandRecognitionResult {
        if (points.size < 21) {
            return HandRecognitionResult(detected = false)
        }

        val wrist = points[0]

        // 1. Pulgar (Thumb: 4 tip, 3 ip, 2 mcp)
        val thumbTip = points[4]
        val thumbIp = points[3]
        val thumbMcp = points[2]
        val isThumbUp = abs(thumbTip.x - wrist.x) > abs(thumbMcp.x - wrist.x) * 1.15f ||
                (thumbTip.y < thumbIp.y && abs(thumbTip.x - thumbMcp.x) > 0.04f)

        // 2. Índice (Index: 8 tip, 6 pip, 5 mcp)
        val indexTip = points[8]
        val indexPip = points[6]
        val isIndexUp = indexTip.y < indexPip.y

        // 3. Medio (Middle: 12 tip, 10 pip)
        val middleTip = points[12]
        val middlePip = points[10]
        val isMiddleUp = middleTip.y < middlePip.y

        // 4. Anular (Ring: 16 tip, 14 pip)
        val ringTip = points[16]
        val ringPip = points[14]
        val isRingUp = ringTip.y < ringPip.y

        // 5. Meñique (Pinky: 20 tip, 18 pip)
        val pinkyTip = points[20]
        val pinkyPip = points[18]
        val isPinkyUp = pinkyTip.y < pinkyPip.y

        val f0 = if (isThumbUp) 1 else 0
        val f1 = if (isIndexUp) 1 else 0
        val f2 = if (isMiddleUp) 1 else 0
        val f3 = if (isRingUp) 1 else 0
        val f4 = if (isPinkyUp) 1 else 0

        val fingerVector = "$f0,$f1,$f2,$f3,$f4"
        val totalUp = f0 + f1 + f2 + f3 + f4

        val thumbIndexDist = hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y)
        val indexMiddleDist = hypot(indexTip.x - middleTip.x, indexTip.y - middleTip.y)

        var letter = ""
        var desc = ""

        when {
            // 1. Letra A: Puño cerrado con pulgar al costado [1,0,0,0,0]
            f0 == 1 && f1 == 0 && f2 == 0 && f3 == 0 && f4 == 0 -> {
                letter = "A"
                desc = "Letra A: Puño cerrado, pulgar al lado"
            }

            // 2. Letra B: 4 dedos extendidos juntos [0,1,1,1,1]
            f0 == 0 && f1 == 1 && f2 == 1 && f3 == 1 && f4 == 1 -> {
                letter = "B"
                desc = "Letra B: 4 dedos extendidos arriba"
            }

            // 3. Letra C: Mano curvada de perfil en C
            f0 == 1 && f1 == 1 && thumbIndexDist in 0.10f..0.22f -> {
                letter = "C"
                desc = "Letra C: Mano en arco C"
            }

            // 4. Letra D: Índice hacia arriba, demás dedos tocan pulgar [0,1,0,0,0]
            f0 == 0 && f1 == 1 && f2 == 0 && f3 == 0 && f4 == 0 -> {
                letter = "D"
                desc = "Letra D: Dedo índice hacia arriba"
            }

            // 5. Letra E: Todos los dedos doblados hacia la palma [0,0,0,0,0]
            totalUp == 0 -> {
                letter = "E"
                desc = "Letra E: Dedos doblados en palma"
            }

            // 6. Letra F: Pulgar e índice en círculo, 3 dedos arriba [0,0,1,1,1]
            f2 == 1 && f3 == 1 && f4 == 1 && thumbIndexDist < 0.08f -> {
                letter = "F"
                desc = "Letra F: Índice y pulgar juntos, 3 dedos arriba"
            }

            // 7. Letra G: Índice y pulgar en horizontal hacia un lado
            f0 == 1 && f1 == 1 && f2 == 0 && f3 == 0 && f4 == 0 && abs(indexTip.y - thumbTip.y) < 0.08f -> {
                letter = "G"
                desc = "Letra G: Índice y pulgar en horizontal"
            }

            // 8. Letra I: Solo dedo meñique levantado [0,0,0,0,1]
            f0 == 0 && f1 == 0 && f2 == 0 && f3 == 0 && f4 == 1 -> {
                letter = "I"
                desc = "Letra I: Meñique levantado"
            }

            // 9. Letra L: Pulgar e índice en ángulo recto [1,1,0,0,0]
            f0 == 1 && f1 == 1 && f2 == 0 && f3 == 0 && f4 == 0 -> {
                letter = "L"
                desc = "Letra L: Pulgar e índice en L"
            }

            // 10. Letra M: Tres dedos sobre el pulgar
            f0 == 0 && f1 == 0 && f2 == 0 && f3 == 0 && f4 == 0 && thumbTip.y > indexPip.y -> {
                letter = "M"
                desc = "Letra M: Tres dedos sobre pulgar"
            }

            // 11. Letra O: Todos los dedos forman un círculo cerrado
            thumbIndexDist < 0.09f && (f1 == 0 || f2 == 0) -> {
                letter = "O"
                desc = "Letra O: Círculo cerrado"
            }

            // 12. Letra P: Índice al frente y medio abajo con pulgar
            f0 == 1 && f1 == 1 && f2 == 1 && indexTip.y > wrist.y -> {
                letter = "P"
                desc = "Letra P: Índice y medio hacia abajo"
            }

            // 13. Letra U: Índice y medio extendidos y juntos [0,1,1,0,0]
            f0 == 0 && f1 == 1 && f2 == 1 && f3 == 0 && f4 == 0 && indexMiddleDist < 0.07f -> {
                letter = "U"
                desc = "Letra U: Índice y medio juntos"
            }

            // 14. Letra V: Índice y medio extendidos y separados en V [0,1,1,0,0]
            f0 == 0 && f1 == 1 && f2 == 1 && f3 == 0 && f4 == 0 && indexMiddleDist >= 0.07f -> {
                letter = "V"
                desc = "Letra V: Índice y medio en V"
            }

            else -> {
                letter = ""
                desc = "Alineando: $fingerVector"
            }
        }

        return HandRecognitionResult(
            detected = true,
            landmarks = points,
            fingerState = fingerVector,
            letterOrWord = letter,
            confidence = 0.95f,
            description = desc
        )
    }

    fun close() {
        try {
            handLandmarker?.close()
            handLandmarker = null
            isInitialized = false
        } catch (e: Exception) {
            Log.e(TAG, "Error cerrando HandLandmarker", e)
        }
    }
}
