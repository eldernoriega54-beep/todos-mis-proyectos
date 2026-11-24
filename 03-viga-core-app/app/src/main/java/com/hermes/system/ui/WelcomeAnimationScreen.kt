package com.hermes.system.ui

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun WelcomeAnimationScreen(language: String, onFinished: () -> Unit) {
    val welcomeText = when (language) {
        "es" -> "Bienvenido a"
        "fr" -> "Bienvenue à"
        "pt" -> "Bem-vindo ao"
        "de" -> "Willkommen bei"
        "it" -> "Benvenuto in"
        else -> "Welcome to"
    }

    val alpha = remember { Animatable(0f) }
    val scale = remember { Animatable(0.6f) }
    val subtitleAlpha = remember { Animatable(0f) }
    val lineWidth = remember { Animatable(0f) }

    LaunchedEffect(Unit) {
        // Logo appears - run scale and alpha concurrently
        coroutineScope {
            launch { scale.animateTo(1f, animationSpec = spring(dampingRatio = 0.5f, stiffness = 200f)) }
            launch { alpha.animateTo(1f, animationSpec = tween(800)) }
        }
        delay(300)
        // Line sweeps across
        lineWidth.animateTo(1f, animationSpec = tween(600, easing = FastOutSlowInEasing))
        delay(200)
        // Subtitle fades in
        subtitleAlpha.animateTo(1f, animationSpec = tween(800))
        delay(1800)
        onFinished()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0A0A0F)),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = welcomeText,
                color = Color.Gray,
                fontSize = 16.sp,
                fontWeight = FontWeight.Light,
                letterSpacing = 2.sp,
                modifier = Modifier.alpha(subtitleAlpha.value)
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "HERMES-V1",
                color = Color(0xFF00E5FF),
                fontSize = 52.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = 6.sp,
                modifier = Modifier
                    .alpha(alpha.value)
                    .scale(scale.value)
            )

            Spacer(modifier = Modifier.height(8.dp))

            Box(
                modifier = Modifier
                    .height(2.dp)
                    .fillMaxWidth(lineWidth.value * 0.6f)
                    .background(Color(0xFF00E5FF))
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Smart Helmet Telemetry",
                color = Color(0xFF00E5FF).copy(alpha = 0.6f),
                fontSize = 13.sp,
                letterSpacing = 2.sp,
                modifier = Modifier.alpha(subtitleAlpha.value)
            )
        }
    }
}

