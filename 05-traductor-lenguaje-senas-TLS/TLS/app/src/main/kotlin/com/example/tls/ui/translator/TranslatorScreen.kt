package com.example.tls.ui.translator

import android.Manifest
import android.content.pm.PackageManager
import android.view.ViewGroup
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.VolumeUp
import androidx.compose.material.icons.filled.Hearing
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.SpaceBar
import androidx.compose.material.icons.filled.Stop
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import androidx.lifecycle.compose.LocalLifecycleOwner
import coil.compose.AsyncImage
import com.example.tls.dictionary.DictionaryRepository
import com.example.tls.dictionary.SignItem
import com.example.tls.ml.HandGestureRecognizer
import com.example.tls.ml.NormalizedPoint
import com.example.tls.tts.SpeechTtsManager
import com.example.tls.ui.components.SkeletonOverlay
import com.example.tls.ui.theme.TlsBlueListen
import com.example.tls.ui.theme.TlsDarkBeigeText
import com.example.tls.ui.theme.TlsDarkBorder
import com.example.tls.ui.theme.TlsDarkOrange
import com.example.tls.ui.theme.TlsRedStop
import kotlinx.coroutines.delay
import java.util.concurrent.Executors
import java.util.concurrent.atomic.AtomicBoolean

@Composable
fun TranslatorScreen(
    dictionaryRepo: DictionaryRepository,
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current

    var hasCameraPermission by remember {
        mutableStateOf(ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED)
    }
    var hasAudioPermission by remember {
        mutableStateOf(ContextCompat.checkSelfPermission(context, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED)
    }

    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { perms ->
        hasCameraPermission = perms[Manifest.permission.CAMERA] ?: hasCameraPermission
        hasAudioPermission = perms[Manifest.permission.RECORD_AUDIO] ?: hasAudioPermission
    }

    LaunchedEffect(Unit) {
        if (!hasCameraPermission || !hasAudioPermission) {
            permissionLauncher.launch(arrayOf(Manifest.permission.CAMERA, Manifest.permission.RECORD_AUDIO))
        }
    }

    var isRecordingSigns by remember { mutableStateOf(false) }
    var currentSentence by remember { mutableStateOf("") }
    var lastDetectedSign by remember { mutableStateOf("") }
    var signStabilityCounter by remember { mutableIntStateOf(0) }
    var lastStableView by remember { mutableStateOf("") }
    var landmarksState by remember { mutableStateOf<List<NormalizedPoint>>(emptyList()) }

    var isListeningOtherPerson by remember { mutableStateOf(false) }
    var listeningStatusText by remember { mutableStateOf("Toca para escuchar a la otra persona") }
    var incomingPhrase by remember { mutableStateOf("") }
    var svgSequenceToPlay by remember { mutableStateOf<List<SignItem>>(emptyList()) }
    var currentSvgFrameIndex by remember { mutableIntStateOf(0) }

    // Reproducción secuencial y fluida de los SVGs de la mano
    LaunchedEffect(svgSequenceToPlay) {
        if (svgSequenceToPlay.isNotEmpty()) {
            currentSvgFrameIndex = 0
            while (currentSvgFrameIndex < svgSequenceToPlay.size) {
                delay(1200)
                currentSvgFrameIndex++
            }
        }
    }

    val speechTtsManager = remember {
        SpeechTtsManager(
            context = context,
            onSpeechRecognized = { text ->
                incomingPhrase = text
                val seq = dictionaryRepo.phraseToSignsSequence(text)
                svgSequenceToPlay = seq
            },
            onSpeechStatusChange = { listening, status ->
                isListeningOtherPerson = listening
                listeningStatusText = status
            }
        )
    }

    val recognizer = remember { HandGestureRecognizer(context) }

    DisposableEffect(Unit) {
        onDispose {
            recognizer.close()
            speechTtsManager.release()
        }
    }

    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val recordPulseScale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = if (isRecordingSigns) 1.14f else 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(600, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulseScale"
    )

    // Entorno completamente oscuro y negro alrededor
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0A0706))
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // 1. BARRA SUPERIOR
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 10.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(
                    onClick = onBack,
                    modifier = Modifier
                        .size(42.dp)
                        .clip(CircleShape)
                        .background(Color(0xFF1E1714))
                ) {
                    Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Volver", tint = TlsDarkOrange)
                }

                Spacer(modifier = Modifier.width(12.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "TRADUCTOR BIDIRECCIONAL",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = TlsDarkOrange,
                        letterSpacing = 1.sp
                    )
                    Text(
                        text = if (isRecordingSigns) "Grabando tus señas..." else if (isListeningOtherPerson) "Escuchando voz..." else "Listo para traducir",
                        fontSize = 13.sp,
                        color = TlsDarkBeigeText
                    )
                }
            }

            // 2. CAJA DE RESULTADO O VISOR DE SVGS ANIMADOS (SIN EMOJIS)
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(115.dp)
                    .clip(RoundedCornerShape(18.dp))
                    .background(Color(0xFF140F0D))
                    .border(1.5.dp, if (isRecordingSigns) TlsDarkOrange else Color(0xFF3D2A1E), RoundedCornerShape(18.dp))
                    .padding(12.dp)
            ) {
                if (svgSequenceToPlay.isNotEmpty() && currentSvgFrameIndex < svgSequenceToPlay.size) {
                    val currentSign = svgSequenceToPlay[currentSvgFrameIndex]
                    Row(
                        modifier = Modifier.fillMaxSize(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Voz recibida: \"$incomingPhrase\"",
                                fontSize = 11.sp,
                                color = TlsBlueListen,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "Seña: ${currentSign.label}",
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Black,
                                color = TlsDarkOrange
                            )
                            Text(
                                text = currentSign.description,
                                fontSize = 11.sp,
                                color = Color.Gray,
                                maxLines = 2
                            )
                            Text(
                                text = "Paso ${currentSvgFrameIndex + 1} de ${svgSequenceToPlay.size}",
                                fontSize = 10.sp,
                                color = TlsDarkOrange
                            )
                        }

                        // SVG de la palma
                        Box(
                            modifier = Modifier
                                .size(90.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .border(1.5.dp, TlsDarkOrange, RoundedCornerShape(12.dp))
                                .background(Color(0xFF1F1815)),
                            contentAlignment = Alignment.Center
                        ) {
                            AsyncImage(
                                model = "file:///android_asset/${currentSign.svgPath}",
                                contentDescription = currentSign.label,
                                modifier = Modifier.size(80.dp)
                            )
                        }
                    }
                } else {
                    Column(
                        modifier = Modifier.fillMaxSize(),
                        verticalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = if (currentSentence.isEmpty()) "Haz señas frente a la cámara o pulsa 'Grabar'..." else currentSentence,
                            fontSize = if (currentSentence.length > 20) 18.sp else 22.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (currentSentence.isEmpty()) Color(0xFF6B5546) else TlsDarkBeigeText
                        )

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = if (lastStableView.isNotEmpty()) "Última seña: $lastStableView" else "Mano: Cámara trasera activa",
                                fontSize = 12.sp,
                                color = TlsDarkOrange
                            )

                            if (currentSentence.isNotEmpty()) {
                                Text(
                                    text = "Limpiar",
                                    fontSize = 11.sp,
                                    color = Color(0xFFD4A87A),
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(6.dp))
                                        .clickable {
                                            currentSentence = ""
                                            lastDetectedSign = ""
                                            lastStableView = ""
                                        }
                                        .padding(4.dp)
                                )
                            }
                        }
                    }
                }
            }

            // 3. VENTANILLA CENTRAL DE CÁMARA (ALINEADA Y SIN LAG)
            Box(
                modifier = Modifier
                    .size(280.dp)
                    .clip(RoundedCornerShape(26.dp))
                    .background(Color.Black)
                    .border(2.5.dp, if (isRecordingSigns) TlsDarkOrange else Color(0xFF4A3428), RoundedCornerShape(26.dp))
                    .shadow(16.dp, RoundedCornerShape(26.dp), spotColor = TlsDarkOrange),
                contentAlignment = Alignment.Center
            ) {
                if (hasCameraPermission) {
                    val executor = remember { Executors.newSingleThreadExecutor() }
                    val isProcessing = remember { AtomicBoolean(false) }

                    AndroidView(
                        factory = { ctx ->
                            val previewView = PreviewView(ctx).apply {
                                layoutParams = ViewGroup.LayoutParams(
                                    ViewGroup.LayoutParams.MATCH_PARENT,
                                    ViewGroup.LayoutParams.MATCH_PARENT
                                )
                                scaleType = PreviewView.ScaleType.FILL_CENTER
                            }
                            val cameraProviderFuture = ProcessCameraProvider.getInstance(ctx)
                            cameraProviderFuture.addListener({
                                val cameraProvider = cameraProviderFuture.get()
                                val preview = Preview.Builder().build().also {
                                    it.setSurfaceProvider(previewView.surfaceProvider)
                                }
                                val imageAnalysis = ImageAnalysis.Builder()
                                    .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                                    .setOutputImageFormat(ImageAnalysis.OUTPUT_IMAGE_FORMAT_RGBA_8888)
                                    .build()

                                imageAnalysis.setAnalyzer(executor) { imageProxy ->
                                    if (isProcessing.compareAndSet(false, true)) {
                                        try {
                                            val rotationDegrees = imageProxy.imageInfo.rotationDegrees
                                            val bitmap = imageProxy.toBitmap()
                                            val result = recognizer.processFrame(bitmap, rotationDegrees)

                                            if (result.detected) {
                                                landmarksState = result.landmarks

                                                if (result.letterOrWord.isNotEmpty()) {
                                                    if (result.letterOrWord == lastDetectedSign) {
                                                        signStabilityCounter++
                                                        // Detectar letra estable y agregarla LETRA POR LETRA formando palabras
                                                        if (signStabilityCounter == 7) {
                                                            lastStableView = result.letterOrWord
                                                            if (isRecordingSigns) {
                                                                currentSentence += result.letterOrWord
                                                            }
                                                        }
                                                    } else {
                                                        lastDetectedSign = result.letterOrWord
                                                        signStabilityCounter = 0
                                                    }
                                                } else {
                                                    lastDetectedSign = ""
                                                    signStabilityCounter = 0
                                                }
                                            } else {
                                                landmarksState = emptyList()
                                            }
                                        } finally {
                                            isProcessing.set(false)
                                            imageProxy.close()
                                        }
                                    } else {
                                        imageProxy.close()
                                    }
                                }

                                try {
                                    cameraProvider.unbindAll()
                                    cameraProvider.bindToLifecycle(
                                        lifecycleOwner,
                                        CameraSelector.DEFAULT_BACK_CAMERA,
                                        preview,
                                        imageAnalysis
                                    )
                                } catch (e: Exception) {
                                    e.printStackTrace()
                                }
                            }, ContextCompat.getMainExecutor(ctx))
                            previewView
                        },
                        modifier = Modifier.fillMaxSize()
                    )

                    // SUPERPOSICIÓN DE ESQUELETO ANATÓMICO
                    SkeletonOverlay(landmarks = landmarksState)
                } else {
                    Text("Cámara trasera no autorizada", color = Color.White, fontSize = 12.sp)
                }
            }

            // 4. PARTE INFERIOR: TRES BOTONES PARA USO A UNA MANO
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 18.dp),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // BOTÓN IZQUIERDO: Escuchar a la otra persona
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Box(
                        modifier = Modifier
                            .size(64.dp)
                            .clip(CircleShape)
                            .background(if (isListeningOtherPerson) TlsBlueListen else Color(0xFF1E1714))
                            .border(2.dp, TlsBlueListen, CircleShape)
                            .clickable {
                                if (isListeningOtherPerson) {
                                    speechTtsManager.stopListening()
                                } else {
                                    speechTtsManager.startListening()
                                }
                            },
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = if (isListeningOtherPerson) Icons.Default.Hearing else Icons.Default.Mic,
                            contentDescription = "Escuchar",
                            tint = if (isListeningOtherPerson) Color.White else TlsBlueListen,
                            modifier = Modifier.size(30.dp)
                        )
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = if (isListeningOtherPerson) "Escuchando" else "Escuchar",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = TlsBlueListen
                    )
                }

                // BOTÓN CENTRAL (EL MÁS GRANDE): GRABAR SEÑAS / TTS
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Box(
                        modifier = Modifier
                            .size(88.dp)
                            .scale(recordPulseScale)
                            .clip(CircleShape)
                            .background(if (isRecordingSigns) TlsRedStop else TlsDarkOrange)
                            .shadow(18.dp, CircleShape, spotColor = if (isRecordingSigns) TlsRedStop else TlsDarkOrange)
                            .clickable {
                                if (!isRecordingSigns) {
                                    isRecordingSigns = true
                                } else {
                                    isRecordingSigns = false
                                    if (currentSentence.isNotBlank()) {
                                        speechTtsManager.speakText(currentSentence)
                                    }
                                }
                            },
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = if (isRecordingSigns) Icons.Default.Stop else Icons.AutoMirrored.Filled.VolumeUp,
                            contentDescription = "Grabar / Reproducir",
                            tint = Color.White,
                            modifier = Modifier.size(44.dp)
                        )
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = if (isRecordingSigns) "Detener & Hablar" else "Grabar Señas",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (isRecordingSigns) TlsRedStop else TlsDarkOrange
                    )
                }

                // BOTÓN DERECHO: ESPACIAR
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Box(
                        modifier = Modifier
                            .size(64.dp)
                            .clip(CircleShape)
                            .background(Color(0xFF1E1714))
                            .border(2.dp, TlsDarkOrange, CircleShape)
                            .clickable {
                                if (currentSentence.isNotEmpty() && !currentSentence.endsWith(" ")) {
                                    currentSentence += " "
                                }
                            },
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.SpaceBar,
                            contentDescription = "Espacio",
                            tint = TlsDarkOrange,
                            modifier = Modifier.size(30.dp)
                        )
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Espacio",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = TlsDarkOrange
                    )
                }
            }
        }
    }
}
