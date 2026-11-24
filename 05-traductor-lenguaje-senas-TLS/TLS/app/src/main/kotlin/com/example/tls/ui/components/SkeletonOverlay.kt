package com.example.tls.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import com.example.tls.ml.HandGestureRecognizer
import com.example.tls.ml.NormalizedPoint
import com.example.tls.ui.theme.TlsDarkBeigeText
import com.example.tls.ui.theme.TlsDarkOrange

@Composable
fun SkeletonOverlay(
    landmarks: List<NormalizedPoint>,
    modifier: Modifier = Modifier,
    lineColor: Color = TlsDarkOrange,
    pointColor: Color = TlsDarkBeigeText
) {
    Canvas(modifier = modifier.fillMaxSize()) {
        if (landmarks.size < 21) return@Canvas

        val w = size.width
        val h = size.height

        // 1. Dibujar líneas de conexión del esqueleto
        for (connection in HandGestureRecognizer.HAND_CONNECTIONS) {
            val p1 = landmarks.getOrNull(connection.first) ?: continue
            val p2 = landmarks.getOrNull(connection.second) ?: continue

            val start = Offset(p1.x * w, p1.y * h)
            val end = Offset(p2.x * w, p2.y * h)

            drawLine(
                color = lineColor,
                start = start,
                end = end,
                strokeWidth = 5f,
                cap = StrokeCap.Round
            )
        }

        // 2. Dibujar puntos de landmarks (21 puntos clave)
        landmarks.forEachIndexed { index, point ->
            val center = Offset(point.x * w, point.y * h)
            val radius = if (index in listOf(4, 8, 12, 16, 20)) 9f else 6f // Puntas de dedos más grandes

            // Círculo exterior anaranjado
            drawCircle(
                color = lineColor,
                radius = radius + 2f,
                center = center
            )
            // Círculo interior beige/blanco
            drawCircle(
                color = pointColor,
                radius = radius,
                center = center
            )
        }
    }
}
