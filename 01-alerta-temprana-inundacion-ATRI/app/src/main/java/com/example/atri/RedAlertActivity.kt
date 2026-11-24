package com.example.atri

import android.app.KeyguardManager
import android.content.Context
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.os.Build
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.view.WindowManager
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.graphics.vector.path
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import kotlinx.coroutines.flow.first

class RedAlertActivity : ComponentActivity() {

    private var mediaPlayerAlarm: MediaPlayer? = null
    private var mediaPlayerVoice: MediaPlayer? = null

    @Suppress("DEPRECATION")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Encender pantalla aunque el celular esté bloqueado/suspendido
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true)
            setTurnScreenOn(true)
        } else {
            window.addFlags(
                WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD or
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON or
                WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
            )
        }
        val keyguardManager = getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            keyguardManager.requestDismissKeyguard(this, null)
        }

        val settingsManager = SettingsManager(this)

        setContent {
            var selectedVoice by remember { mutableStateOf("voz2") }
            LaunchedEffect(Unit) {
                selectedVoice = settingsManager.selectedVoiceFlow.first().ifEmpty { "voz2" }
                vibrateDevice()
                playAlarmAndVoice(selectedVoice)
            }
            RedAlertScreen(onDismiss = {
                mediaPlayerAlarm?.stop()
                mediaPlayerVoice?.stop()
                finish()
            })
        }
    }

    private fun playAlarmAndVoice(selectedVoice: String) {
        // Alarma en BUCLE hasta que la voz termine
        mediaPlayerAlarm = MediaPlayer.create(this, R.raw.sonido_alerta).apply {
            isLooping = true
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_ALARM)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .build()
                )
            }
            start()
        }

        val voiceResId = if (selectedVoice == "voz1") R.raw.voz1 else R.raw.voz2

        // La voz empieza 3 segundos después de la alarma
        android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
            mediaPlayerVoice = MediaPlayer.create(this, voiceResId).apply {
                setOnCompletionListener {
                    // Cuando la voz termina → para la alarma
                    mediaPlayerAlarm?.stop()
                    mediaPlayerAlarm?.release()
                    mediaPlayerAlarm = null
                }
                start() // La voz se ejecuta UNA sola vez
            }
        }, 3000)
    }

    @Suppress("DEPRECATION")
    private fun vibrateDevice() {
        val pattern = longArrayOf(0, 500, 200, 500, 200, 500, 200, 1000)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val vm = getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
            vm.defaultVibrator.vibrate(VibrationEffect.createWaveform(pattern, -1))
        } else {
            val v = getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                v.vibrate(VibrationEffect.createWaveform(pattern, -1))
            } else {
                v.vibrate(pattern, -1)
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        mediaPlayerAlarm?.release()
        mediaPlayerVoice?.release()
    }
}

// ─── SVG Icons (ImageVector) ──────────────────────────────────────────────────

val IconBag: ImageVector = ImageVector.Builder(
    name = "Bag", defaultWidth = 64.dp, defaultHeight = 64.dp,
    viewportWidth = 24f, viewportHeight = 24f
).path(fill = SolidColor(Color.White)) {
    moveTo(20f, 6f); horizontalLineTo(16f); verticalLineTo(4f)
    curveTo(16f, 2.9f, 15.1f, 2f, 14f, 2f); horizontalLineTo(10f)
    curveTo(8.9f, 2f, 8f, 2.9f, 8f, 4f); verticalLineTo(6f)
    horizontalLineTo(4f); curveTo(2.9f, 6f, 2f, 6.9f, 2f, 8f)
    verticalLineTo(19f); curveTo(2f, 20.1f, 2.9f, 21f, 4f, 21f)
    horizontalLineTo(20f); curveTo(21.1f, 21f, 22f, 20.1f, 22f, 19f)
    verticalLineTo(8f); curveTo(22f, 6.9f, 21.1f, 6f, 20f, 6f); close()
    moveTo(10f, 4f); horizontalLineTo(14f); verticalLineTo(6f)
    horizontalLineTo(10f); verticalLineTo(4f); close()
}.build()

val IconNoHeavy: ImageVector = ImageVector.Builder(
    name = "NoHeavy", defaultWidth = 64.dp, defaultHeight = 64.dp,
    viewportWidth = 24f, viewportHeight = 24f
).path(fill = SolidColor(Color.White)) {
    // Círculo con línea diagonal (prohibido)
    moveTo(12f, 2f); curveTo(6.48f, 2f, 2f, 6.48f, 2f, 12f)
    curveTo(2f, 17.52f, 6.48f, 22f, 12f, 22f)
    curveTo(17.52f, 22f, 22f, 17.52f, 22f, 12f)
    curveTo(22f, 6.48f, 17.52f, 2f, 12f, 2f); close()
    moveTo(4f, 12f); curveTo(4f, 7.58f, 7.58f, 4f, 12f, 4f)
    curveTo(13.85f, 4f, 15.56f, 4.63f, 16.94f, 5.65f)
    lineTo(5.65f, 16.94f); curveTo(4.63f, 15.56f, 4f, 13.85f, 4f, 12f); close()
    moveTo(12f, 20f); curveTo(10.15f, 20f, 8.44f, 19.37f, 7.06f, 18.35f)
    lineTo(18.35f, 7.06f); curveTo(19.37f, 8.44f, 20f, 10.15f, 20f, 12f)
    curveTo(20f, 16.42f, 16.42f, 20f, 12f, 20f); close()
}.build()

val IconEscape: ImageVector = ImageVector.Builder(
    name = "Escape", defaultWidth = 64.dp, defaultHeight = 64.dp,
    viewportWidth = 24f, viewportHeight = 24f
).path(fill = SolidColor(Color.White)) {
    // Figura humana corriendo
    moveTo(13.49f, 5.48f)
    curveTo(14.6f, 5.48f, 15.5f, 4.58f, 15.5f, 3.48f)
    curveTo(15.5f, 2.38f, 14.6f, 1.48f, 13.49f, 1.48f)
    curveTo(12.39f, 1.48f, 11.5f, 2.38f, 11.5f, 3.48f)
    curveTo(11.5f, 4.58f, 12.39f, 5.48f, 13.49f, 5.48f); close()
    moveTo(9.89f, 19.38f); lineTo(10.89f, 14.99f); lineTo(12.99f, 16.99f)
    verticalLineTo(22.99f); horizontalLineTo(14.99f); verticalLineTo(15.49f)
    lineTo(12.89f, 13.49f); lineTo(13.49f, 10.49f)
    curveTo(14.79f, 11.99f, 16.69f, 12.99f, 18.99f, 12.99f)
    verticalLineTo(10.99f); curveTo(17.09f, 10.99f, 15.79f, 9.99f, 15.19f, 8.69f)
    lineTo(14.19f, 6.99f); curveTo(13.89f, 6.49f, 13.39f, 6.19f, 12.79f, 6.19f)
    curveTo(12.59f, 6.19f, 12.39f, 6.19f, 12.19f, 6.29f)
    lineTo(7.99f, 8.09f); verticalLineTo(12.99f); horizontalLineTo(9.99f)
    verticalLineTo(9.39f); lineTo(11.69f, 8.69f); lineTo(10.29f, 15.49f)
    lineTo(6.19f, 14.59f); lineTo(5.79f, 16.59f); lineTo(9.89f, 19.38f); close()
}.build()

val IconShelter: ImageVector = ImageVector.Builder(
    name = "Shelter", defaultWidth = 64.dp, defaultHeight = 64.dp,
    viewportWidth = 24f, viewportHeight = 24f
).path(fill = SolidColor(Color.White)) {
    // Casa/albergue
    moveTo(10f, 20f); verticalLineTo(14f); horizontalLineTo(14f); verticalLineTo(20f)
    horizontalLineTo(19f); verticalLineTo(12f); horizontalLineTo(22f)
    lineTo(12f, 3f); lineTo(2f, 12f); horizontalLineTo(5f)
    verticalLineTo(20f); horizontalLineTo(10f); close()
}.build()

// ─── Pantalla de Alerta Roja ──────────────────────────────────────────────────

@Composable
fun RedAlertScreen(onDismiss: () -> Unit = {}) {
    val redGoogle  = Color(0xFFD32F2F)
    val blackBg    = Color(0xFF0D0D0D)

    Column(modifier = Modifier.fillMaxSize()) {

        // ── MITAD SUPERIOR ROJA ──────────────────────────────────────────
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .weight(0.40f)
                .background(redGoogle)
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Triángulo de advertencia SVG
            androidx.compose.foundation.Canvas(modifier = Modifier.size(52.dp)) {
                val path = androidx.compose.ui.graphics.Path().apply {
                    moveTo(size.width / 2f, 0f)
                    lineTo(size.width, size.height)
                    lineTo(0f, size.height)
                    close()
                }
                drawPath(path, color = Color.White)
                val innerPath = androidx.compose.ui.graphics.Path().apply {
                    moveTo(size.width / 2f, size.height * 0.18f)
                    lineTo(size.width * 0.85f, size.height * 0.85f)
                    lineTo(size.width * 0.15f, size.height * 0.85f)
                    close()
                }
                drawPath(innerPath, color = redGoogle)
            }
            Spacer(Modifier.height(12.dp))
            Text(
                text = "Inundación",
                color = Color.White,
                fontSize = 42.sp,
                fontFamily = FontFamily.Serif,
                fontWeight = FontWeight.Normal,
                textAlign = TextAlign.Center
            )
            Spacer(Modifier.height(6.dp))
            Text(
                text = "Riesgo inminente en tu zona",
                color = Color(0xFFFFCDD2),
                fontSize = 16.sp,
                textAlign = TextAlign.Center
            )
            Text(
                text = "Nivel máximo de alerta detectado",
                color = Color(0xFFFFCDD2),
                fontSize = 14.sp,
                textAlign = TextAlign.Center
            )
        }

        // ── MITAD INFERIOR NEGRA: instrucciones con SVG ──────────────────
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .weight(0.60f)
                .background(blackBg)
                .padding(horizontal = 24.dp),
            verticalArrangement = Arrangement.SpaceEvenly
        ) {
            AlertSvgRow(label = "Solo lo vital",     subLabel = "Documentos y medicamentos",    icon = IconBag)
            HorizontalDivider(color = Color(0xFF2A2A2A))
            AlertSvgRow(label = "Sin peso extra",    subLabel = "Muévete rápido y sin carga",   icon = IconNoHeavy)
            HorizontalDivider(color = Color(0xFF2A2A2A))
            AlertSvgRow(label = "Evacúa ya",         subLabel = "Aléjate del río, busca altura", icon = IconEscape)
            HorizontalDivider(color = Color(0xFF2A2A2A))
            AlertSvgRow(label = "Albergue cercano",  subLabel = "Sigue la ruta de evacuación",  icon = IconShelter)
            
            Spacer(Modifier.height(8.dp))
            androidx.compose.material3.Button(
                onClick = onDismiss,
                colors = androidx.compose.material3.ButtonDefaults.buttonColors(
                    containerColor = redGoogle
                ),
                shape = androidx.compose.foundation.shape.RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
            ) {
                Text(
                    text = "Aceptar",
                    color = Color.White,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

@Composable
fun AlertSvgRow(label: String, subLabel: String, icon: ImageVector) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(label,    color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
            Text(subLabel, color = Color(0xFFAAAAAA), fontSize = 13.sp)
        }
        Spacer(Modifier.width(12.dp))
        androidx.compose.foundation.Image(
            imageVector = icon,
            contentDescription = label,
            modifier = Modifier.size(52.dp)
        )
    }
}