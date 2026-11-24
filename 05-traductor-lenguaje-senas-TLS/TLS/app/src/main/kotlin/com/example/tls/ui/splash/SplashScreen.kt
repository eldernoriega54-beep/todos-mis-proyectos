package com.example.tls.ui.splash

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.tls.ui.theme.TlsDarkBorder
import com.example.tls.ui.theme.TlsDarkOrange
import kotlinx.coroutines.delay

@Composable
fun SplashScreen(
    onSplashFinished: () -> Unit
) {
    // Animación de posición vertical: Inicia abajo (+280dp) y sube al centro (0dp)
    val offsetY = remember { Animatable(280f) }
    // Animación de escala: Inicia pequeño (0.5f) y crece hacia arriba (2.2f)
    val scale = remember { Animatable(0.5f) }
    // Animación de opacidad
    val alpha = remember { Animatable(0f) }
    // Opacidad para el texto secundario
    val subtitleAlpha = remember { Animatable(0f) }

    LaunchedEffect(Unit) {
        // Lanzamiento de la animación de TLS desde abajo hacia arriba y engrandeciéndose
        alpha.animateTo(1f, animationSpec = tween(400))
        offsetY.animateTo(
            targetValue = 0f,
            animationSpec = tween(durationMillis = 1100, easing = FastOutSlowInEasing)
        )
        scale.animateTo(
            targetValue = 1.6f,
            animationSpec = tween(durationMillis = 800, easing = FastOutSlowInEasing)
        )
        subtitleAlpha.animateTo(
            targetValue = 1f,
            animationSpec = tween(durationMillis = 600)
        )
        delay(1200)
        onSplashFinished()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier
                .offset(y = offsetY.value.dp)
                .scale(scale.value)
                .alpha(alpha.value)
        ) {
            // Insignia con el nombre "TLS" y contorno anaranjado
            Box(
                modifier = Modifier
                    .border(2.5.dp, TlsDarkOrange, RoundedCornerShape(20.dp))
                    .padding(horizontal = 28.dp, vertical = 12.dp)
                    .background(MaterialTheme.colorScheme.surfaceVariant, RoundedCornerShape(20.dp)),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "TLS",
                    fontSize = 48.sp,
                    fontWeight = FontWeight.Black,
                    color = TlsDarkOrange,
                    letterSpacing = 6.sp,
                    textAlign = TextAlign.Center
                )
            }

            Spacer(modifier = Modifier.height(18.dp))

            Text(
                text = "TRADUCTOR DE LENGUAJE DE SEÑAS",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground,
                letterSpacing = 2.sp,
                textAlign = TextAlign.Center,
                modifier = Modifier.alpha(subtitleAlpha.value)
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = "Beta v1.0 · Sistema Bidireccional",
                fontSize = 9.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center,
                modifier = Modifier.alpha(subtitleAlpha.value)
            )
        }
    }
}
