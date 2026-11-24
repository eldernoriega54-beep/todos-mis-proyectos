package com.hermes.system.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.hermes.system.data.UserSettings

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    settings: UserSettings,
    onBack: () -> Unit,
    onEditMedical: () -> Unit,
    onForgetDevice: () -> Unit,
    onToggleDarkMode: (Boolean) -> Unit,
    language: String,
    onTerminal: () -> Unit = {}
) {
    val isSpanish = language == "es"
    val bgColor = Color(0xFF121212)
    val panelColor = Color(0xFF1E1E1E)
    val accentColor = Color(0xFF00E5FF)

    var showForgetDialog by remember { mutableStateOf(false) }

    if (showForgetDialog) {
        AlertDialog(
            onDismissRequest = { showForgetDialog = false },
            title = { Text(if (isSpanish) "¿Olvidar dispositivo??" else "Forget device?", color = Color.White) },
            text = {
                Text(
                    if (isSpanish)
                        "El ESP32 olvidará tu red Wi-Fi y volverá a ser visible como HermesSystem-AP."
                    else
                        "The ESP32 will forget your Wi-Fi network and become visible again as HermesSystem-AP.",
                    color = Color.Gray
                )
            },
            confirmButton = {
                TextButton(onClick = { showForgetDialog = false; onForgetDevice() }) {
                    Text(if (isSpanish) "Olvidar" else "Forget", color = Color.Red)
                }
            },
            dismissButton = {
                TextButton(onClick = { showForgetDialog = false }) {
                    Text(if (isSpanish) "Cancelar" else "Cancel", color = accentColor)
                }
            },
            containerColor = Color(0xFF1E1E1E)
        )
    }

    Scaffold(
        containerColor = bgColor,
        topBar = {
            TopAppBar(
                title = { Text(if (isSpanish) "Configuración" else "Settings", color = Color.White) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null, tint = Color.White)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = bgColor)
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {

            // ─── Datos médicos ─────────────────────────────────
            SectionCard(title = if (isSpanish) "ðŸ‘¤ Perfil Médico" else "ðŸ‘¤ Medical Profile", panelColor, accentColor) {
                MedicalRow(if (isSpanish) "Nombre" else "Name", settings.fullName.ifBlank { "---" })
                MedicalRow(if (isSpanish) "Edad" else "Age", settings.age.ifBlank { "---" })
                MedicalRow(if (isSpanish) "Peso" else "Weight", settings.weight.ifBlank { "---" })
                MedicalRow(if (isSpanish) "Tipo de sangre" else "Blood type", settings.bloodType.ifBlank { "---" })
                MedicalRow(if (isSpanish) "Alergias" else "Allergies", settings.allergies.ifBlank { "---" })
                Spacer(modifier = Modifier.height(8.dp))
                Button(
                    onClick = onEditMedical,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = accentColor)
                ) {
                    Icon(Icons.Filled.Edit, contentDescription = null, tint = Color.Black, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(if (isSpanish) "Editar datos" else "Edit data", color = Color.Black, fontWeight = FontWeight.Bold)
                }
            }

            // ─── Dispositivo ────────────────────────────────────
            SectionCard(title = if (isSpanish) "ðŸ“¡ Dispositivo HermesSystem" else "ðŸ“¡ HermesSystem Device", panelColor, accentColor) {
                if (settings.deviceName.isNotBlank()) {
                    MedicalRow(if (isSpanish) "Dispositivo" else "Device", settings.deviceName)
                    MedicalRow("Wi-Fi", settings.savedNetworkSsid.ifBlank { "---" })
                    MedicalRow("ID MQTT", settings.deviceId)
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedButton(
                        onClick = { showForgetDialog = true },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.Red),
                        border = androidx.compose.foundation.BorderStroke(1.dp, Color.Red)
                    ) {
                        Icon(Icons.Filled.Delete, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(if (isSpanish) "Olvidar dispositivo?" else "Forget device")
                    }
                } else {
                    Text(
                        text = if (isSpanish) "Sin dispositivo conectado. Usa el botón '+' para vincular uno.ón '+' para vincular uno." else "No device connected. Use the '+' button to link one.",
                        color = Color.Gray,
                        fontSize = 14.sp
                    )
                }
            }

            // ─── Apariencia ─────────────────────────────────────
            SectionCard(title = if (isSpanish) "ðŸŽ¨ Apariencia" else "ðŸŽ¨ Appearance", panelColor, accentColor) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(if (isSpanish) "Modo oscuro" else "Dark mode", color = Color.White)
                    Switch(
                        checked = settings.isDarkMode,
                        onCheckedChange = onToggleDarkMode,
                        colors = SwitchDefaults.colors(checkedThumbColor = Color.Black, checkedTrackColor = accentColor)
                    )
                }
            }

            // ─── Términos ────────────────────────────────────────
            SectionCard(title = if (isSpanish) "📋 Términos y Condiciones" else "📋 Terms and Conditions", panelColor, accentColor) {
                Text(
                    text = if (isSpanish)
                        "• El ESP32 es responsable único del SMS de emergencia.\n• Los datos médicos solo se guardan en tu teléfono y en el dispositivo.\n• HERMES-V1 no se responsabiliza por fallos del hardware."
                    else
                        "• ESP32 is solely responsible for the emergency SMS.\n• Medical data is only stored on your phone and the device.\n• HERMES-V1 is not responsible for hardware failures.",
                    color = Color.Gray,
                    fontSize = 13.sp,
                    lineHeight = 20.sp
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // ─── Desarrollador / Jueces ────────────────────────────────────────
            SectionCard(title = "🛠 Modo Desarrollador", panelColor, accentColor) {
                Button(
                    onClick = onTerminal,
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(containerColor = Color.DarkGray)
                ) {
                    Text("Abrir Monitor Serial (Terminal BT)", color = accentColor)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text("HERMES-V1 v1.0.0", color = Color.DarkGray, fontSize = 12.sp, modifier = Modifier.align(Alignment.CenterHorizontally))
            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

@Composable
private fun SectionCard(title: String, bgColor: Color, accentColor: Color, content: @Composable ColumnScope.() -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(bgColor)
            .padding(16.dp)
    ) {
        Text(title, color = accentColor, fontWeight = FontWeight.Bold, fontSize = 15.sp)
        Spacer(modifier = Modifier.height(12.dp))
        content()
    }
}

@Composable
private fun MedicalRow(label: String, value: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(label, color = Color.Gray, fontSize = 14.sp)
        Text(value, color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
    }
}

