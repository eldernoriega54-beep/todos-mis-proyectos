package com.hermes.system.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

private fun termsContent(lang: String): Pair<String, List<Pair<String, String>>> {
    return when (lang) {
        "es" -> Pair(
            "Términos y Condiciones",
            listOf(
                "🛡️ Responsabilidad del Dispositivo" to
                    "El dispositivo HermesSystem ESP32 es el ÚNICO responsable del envío de alertas SMS en caso de accidente. La aplicación móvil NO gestiona llamadas ni mensajes de emergencia.",
                "📡 Comunicación Wi-Fi" to
                    "La app se comunica con el casco a través de una red Wi-Fi local y un servidor MQTT. Es necesario que ambos estén conectados a la misma red o al internet para el intercambio de datos.",
                "🏥 Datos Médicos" to
                    "Tu información médica (nombre, tipo de sangre, alergias, etc.) se almacena de forma local en tu teléfono y se transmite una única vez al dispositivo ESP32 para casos de emergencia.",
                "⚠️ Limitación de Responsabilidad" to
                    "HERMES-V1 y sus desarrolladores NO se responsabilizan por: (1) fallos del hardware que impidan el envío de alertas, (2) pérdida de conectividad en el momento del accidente, (3) mal uso de la tecnología por parte del usuario.",
                "🔒 Privacidad" to
                    "Tus datos médicos NUNCA se comparten con terceros ni se suben a servidores externos. Solo existen en tu teléfono y en el dispositivo físico."
            )
        )
        else -> Pair(
            "Terms and Conditions",
            listOf(
                "🛡️ Device Responsibility" to
                    "The HermesSystem ESP32 device is the SOLE responsible for sending SMS alerts in case of an accident. The mobile app does NOT manage emergency calls or messages.",
                "📡 Wi-Fi Communication" to
                    "The app communicates with the helmet through a local Wi-Fi network and an MQTT server. Both must be connected to the same network or internet.",
                "🏥 Medical Data" to
                    "Your medical information (name, blood type, allergies, etc.) is stored locally on your phone and transmitted once to the ESP32 device for emergency situations.",
                "⚠️ Limitation of Liability" to
                    "HERMES-V1 and its developers are NOT responsible for: (1) hardware failures preventing alert delivery, (2) loss of connectivity at the time of accident, (3) misuse of the technology.",
                "🔒 Privacy" to
                    "Your medical data is NEVER shared with third parties or uploaded to external servers. It only exists on your phone and the physical device."
            )
        )
    }
}

@Composable
fun TermsScreen(language: String, onAccept: () -> Unit) {
    val (title, clauses) = remember(language) { termsContent(language) }
    val isSpanish = language == "es"
    val acceptLabel = if (isSpanish) "Acepto los Términos y Condiciones" else "I Accept the Terms and Conditions"
    val scrollState = rememberScrollState()
    val hasScrolledToBottom by remember { derivedStateOf { scrollState.value >= scrollState.maxValue - 10 } }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = Color(0xFF121212)
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            // Header
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFF1A1A2E))
                    .padding(24.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("HERMES-V1", color = Color(0xFF00E5FF), fontSize = 20.sp, fontWeight = FontWeight.Bold, letterSpacing = 3.sp)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(title, color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.SemiBold)
                }
            }

            // Scroll content
            Column(
                modifier = Modifier
                    .weight(1f)
                    .verticalScroll(scrollState)
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                clauses.forEach { (heading, body) ->
                    Surface(
                        shape = RoundedCornerShape(14.dp),
                        color = Color(0xFF1E1E1E)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(heading, color = Color(0xFF00E5FF), fontWeight = FontWeight.Bold, fontSize = 15.sp)
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(body, color = Color.LightGray, fontSize = 13.sp, lineHeight = 20.sp)
                        }
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = if (isSpanish) "↑ Desplázate hasta el final para aceptar" else "↑ Scroll to the bottom to accept",
                    color = Color.DarkGray,
                    fontSize = 12.sp,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth()
                )
            }

            // Accept button
            Box(modifier = Modifier.padding(16.dp)) {
                Button(
                    onClick = onAccept,
                    enabled = hasScrolledToBottom,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFF00E5FF),
                        disabledContainerColor = Color(0xFF1E1E1E)
                    )
                ) {
                    Text(
                        text = acceptLabel,
                        color = if (hasScrolledToBottom) Color.Black else Color.Gray,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}

