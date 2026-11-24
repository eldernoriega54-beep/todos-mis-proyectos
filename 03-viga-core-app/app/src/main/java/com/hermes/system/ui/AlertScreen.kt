package com.hermes.system.ui

import android.Manifest
import android.content.pm.PackageManager
import android.media.RingtoneManager
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.telephony.SmsManager
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import com.hermes.system.mqtt.TelemetryData
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import com.hermes.system.data.UserSettings
import com.hermes.system.mqtt.AlertType
import kotlinx.coroutines.delay

@Composable
fun AlertScreen(
    alertType: AlertType,
    settings: UserSettings,
    telemetry: com.hermes.system.mqtt.TelemetryData?,
    onCancel: () -> Unit
) {
    val context = LocalContext.current
    val isSpanish = settings.language == "es"
    var countdown by remember { mutableStateOf(10) }
    val iconScale = remember { Animatable(1f) }
    // smsSent se usa para mostrar estado en UI y para bloquear envíos múltiples
    var smsSent by remember { mutableStateOf(false) }
    // smsAttempted indica que el proceso del contador terminó (para dejar de vibrar)
    var alertFinished by remember { mutableStateOf(false) }

    val alertColor = when (alertType) {
        AlertType.SEVERE -> Color(0xFFCC0000)
        AlertType.MEDIUM -> Color(0xFFFF5500)
        AlertType.LIGHT  -> Color(0xFFFFA000)
    }

    val title = when (alertType) {
        AlertType.SEVERE -> if (isSpanish) "âš ï¸ IMPACTO SEVERO" else "âš ï¸ SEVERE IMPACT"
        AlertType.MEDIUM -> if (isSpanish) "âš ï¸ IMPACTO MODERADO" else "âš ï¸ MODERATE IMPACT"
        AlertType.LIGHT  -> if (isSpanish) "âš ï¸ IMPACTO LEVE" else "âš ï¸ LIGHT IMPACT"
    }

    // Permiso de SMS
    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { }

    LaunchedEffect(Unit) {
        if (ContextCompat.checkSelfPermission(context, Manifest.permission.SEND_SMS) != PackageManager.PERMISSION_GRANTED) {
            permissionLauncher.launch(Manifest.permission.SEND_SMS)
        }
    }

    // Icono pulsante (solo mientras la alerta no terminó)
    LaunchedEffect(alertFinished) {
        if (!alertFinished) {
            while (true) {
                iconScale.animateTo(1.3f, animationSpec = tween(400))
                iconScale.animateTo(1.0f, animationSpec = tween(400))
            }
        }
    }

    // Vibración, sonido y contador
    LaunchedEffect(Unit) {
        // Obtener vibrador
        val vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val manager = context.getSystemService(android.content.Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
            manager.defaultVibrator
        } else {
            @Suppress("DEPRECATION")
            context.getSystemService(android.content.Context.VIBRATOR_SERVICE) as Vibrator
        }

        // Vibrar con patrón (sin repetición infinita: el índice -1 = no repetir)
        val pattern = longArrayOf(0, 500, 300, 500, 300, 500)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // -1 como repeat = NO repetir, solo vibra una vez el patrón
            vibrator.vibrate(VibrationEffect.createWaveform(pattern, -1))
        }

        // Sonido de alarma
        try {
            val alarmUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
            val ringtone = RingtoneManager.getRingtone(context, alarmUri)
            ringtone?.play()
        } catch (_: Exception) {}

        // Cuenta regresiva
        while (countdown > 0) {
            delay(1000)
            countdown--
        }

        // MARCAR COMO TERMINADA (para parar vibración visual)
        alertFinished = true
        // Cancelar vibración del motor físico también
        vibrator.cancel()

        // Enviar SMS si no se ha enviado aún
        if (!smsSent) {
            val contactList = settings.emergencyContacts.split(",").map { it.trim() }.filter { it.isNotEmpty() }
            val enabledStates = settings.contactsEnabled.split(",").map { it == "true" }
            
            val validNumbers = mutableListOf<String>()
            
            // 1. Añadir 911 (simulado) si está activado
            if (settings.emergencyServiceEnabled) {
                validNumbers.add("+50497580983")
            }
            
            // 2. Añadir contactos personales habilitados
            contactList.forEachIndexed { idx, num ->
                val isEnabled = enabledStates.getOrElse(idx) { true }
                if (isEnabled) validNumbers.add(num)
            }

            if (validNumbers.isNotEmpty() && ContextCompat.checkSelfPermission(context, Manifest.permission.SEND_SMS) == PackageManager.PERMISSION_GRANTED) {
                val smsManager = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                    context.getSystemService(SmsManager::class.java)
                } else {
                    @Suppress("DEPRECATION")
                    SmsManager.getDefault()
                }

                val lat = telemetry?.lat ?: 0f
                val lon = telemetry?.lon ?: 0f
                val mapsLink = if (lat != 0f && lon != 0f) "\nMapa: https://maps.google.com/?q=$lat,$lon" else ""
                val speed = telemetry?.speed?.toInt()?.toString() ?: settings.lastSpeed

                val message = "ðŸš¨ EMERGENCIA HERMES-V1 ðŸš¨\n" +
                              "Impacto: $alertType\n" +
                              "Piloto: ${settings.fullName}\n" +
                              "Sangre: ${settings.bloodType}\n" +
                              "Alergias: ${settings.allergies}\n" +
                              "Vel: ${speed}km/h" + mapsLink

                for (num in validNumbers) {
                    try {
                        val parts = smsManager?.divideMessage(message)
                        if (parts != null && parts.size > 1) {
                            smsManager.sendMultipartTextMessage(num, null, parts, null, null)
                        } else {
                            smsManager?.sendTextMessage(num, null, message, null, null)
                        }
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
            }
        }
        smsSent = true

        // Mostrar "SMS enviado" 3 segundos y cerrar la alerta COMPLETAMENTE
        delay(3000)
        onCancel() // Esto limpia la alerta en el ViewModel para que NO vuelva a aparecer
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0D0000)),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(24.dp)
        ) {
            Icon(
                imageVector = Icons.Filled.Warning,
                contentDescription = null,
                tint = alertColor,
                modifier = Modifier
                    .size(80.dp)
                    .scale(if (alertFinished) 1f else iconScale.value)
            )

            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = title,
                color = alertColor,
                fontSize = 28.sp,
                fontWeight = FontWeight.Black,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(16.dp))

            if (!alertFinished) {
                Text(
                    text = if (isSpanish)
                        "El dispositivo enviará una alerta y tu teléfono mandará un SMS a tus familiares en:"
                    else
                        "Device will send an alert and your phone will SMS your family in:",
                    color = Color.White,
                    fontSize = 15.sp,
                    textAlign = TextAlign.Center,
                    lineHeight = 22.sp
                )

                Spacer(modifier = Modifier.height(32.dp))

                Box(
                    modifier = Modifier
                        .size(120.dp)
                        .background(alertColor.copy(alpha = 0.15f), shape = RoundedCornerShape(60.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = countdown.toString(),
                        color = alertColor,
                        fontSize = 60.sp,
                        fontWeight = FontWeight.Black
                    )
                }

                Spacer(modifier = Modifier.height(40.dp))

                Button(
                    onClick = {
                        // Al cancelar manualmente también se limpia el estado completamente
                        onCancel()
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(60.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color.White)
                ) {
                    Text(
                        text = if (isSpanish) "Estoy bien â€” Cancelar" else "I'm OK â€” Cancel",
                        color = Color.Black,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            } else {
                // Pantalla final: SMS enviado
                Text(
                    text = if (isSpanish) "âœ… SMS de emergencia enviado." else "âœ… Emergency SMS sent.",
                    color = Color.Green,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Center
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = if (isSpanish) "Cerrando en 3 segundos..." else "Closing in 3 seconds...",
                    color = Color.Gray,
                    fontSize = 14.sp
                )
            }
        }
    }
}

