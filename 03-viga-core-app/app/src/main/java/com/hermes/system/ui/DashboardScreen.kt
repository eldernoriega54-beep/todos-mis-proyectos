package com.hermes.system.ui

import androidx.compose.animation.core.*
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.hermes.system.R
import com.hermes.system.mqtt.TelemetryData

@Composable
fun DashboardScreen(
    isConnected: Boolean,
    telemetry: TelemetryData?,
    lastSpeed: String,
    lastMaxSpeed: String,
    lastBatteryPercent: String,
    lastBatteryHealth: String,
    deviceName: String,
    onSettingsClick: () -> Unit,
    onMapClick: () -> Unit = {}
) {
    val bgColor = MaterialTheme.colorScheme.background
    val panelColor = MaterialTheme.colorScheme.surfaceVariant
    val accentColor = Color(0xFF00E5FF)
    val textColor = MaterialTheme.colorScheme.onBackground
    val subTextColor = MaterialTheme.colorScheme.onSurfaceVariant

    val speed = if (isConnected && telemetry != null) telemetry.speed.toInt().toString() else lastSpeed
    val maxSpeed = if (isConnected && telemetry != null) telemetry.maxSpeed.toInt().toString() else lastMaxSpeed
    val magnitude = if (isConnected && telemetry != null) String.format("%.1f", telemetry.magnitude) else "---"
    val dataColor = if (isConnected) textColor else Color(0xFF555555)
    val hasGPS = (telemetry?.lat ?: 0f) != 0f && (telemetry?.lon ?: 0f) != 0f

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(bgColor)
            .padding(16.dp)
    ) {
        Column(modifier = Modifier.fillMaxSize()) {

            // ─── Header ───────────────────────────────────
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(modifier = Modifier)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = if (isConnected) "CONECTADO" else "DESCONECTADO",
                            color = if (isConnected) Color.Green else Color.Red,
                            fontWeight = FontWeight.Bold, fontSize = 13.sp
                        )
                    }
                    if (deviceName.isNotBlank()) {
                        Text(text = deviceName, color = subTextColor, fontSize = 11.sp)
                    }
                }
                Row {
                    // Botón de mapa
                    IconButton(onClick = onMapClick) {
                        Icon(
                            Icons.Filled.LocationOn,
                            contentDescription = "Mapa",
                            tint = if (hasGPS) accentColor else subTextColor
                        )
                    }
                    IconButton(onClick = onSettingsClick) {
                        Icon(Icons.Filled.Settings, contentDescription = "Ajustes", tint = textColor)
                    }
                }
            }

            // Aviso si desconectado y hay cache
            if (!isConnected && lastSpeed != "---") {
                Spacer(modifier = Modifier.height(8.dp))
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = Color(0xFF2A2A00)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.Filled.Warning, contentDescription = null, tint = Color.Yellow, modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Mostrando último dato registrado", color = Color.Yellow, fontSize = 11.sp)
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // ─── Telemetría ────────────────────────────────
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                TelemetryCard("VELOCIDAD", speed, "km/h", Modifier.weight(1f), panelColor, if (isConnected) accentColor else Color(0xFF335555), dataColor)
                TelemetryCard("VEL. MÃXIMA", maxSpeed, "km/h", Modifier.weight(1f), panelColor, if (isConnected) Color(0xFFFF3D00) else Color(0xFF553322), dataColor)
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                TelemetryCard("IMPACTO (IMU)", magnitude, "G", Modifier.weight(1f), panelColor, if (isConnected) Color.Green else Color(0xFF335533), dataColor)
            }

            Spacer(modifier = Modifier.height(20.dp))

            // ─── Mapa preview ──────────────────────────────
            Surface(
                onClick = onMapClick,
                modifier = Modifier.fillMaxWidth().weight(1f),
                shape = RoundedCornerShape(16.dp),
                color = panelColor
            ) {
                Box {
                    // Imagen de fondo del mapa
                    Image(
                        painter = painterResource(id = R.drawable.map_preview),
                        contentDescription = null,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.fillMaxSize()
                    )
                    // Gradiente oscuro sobre la imagen para legibilidad
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(
                                Brush.verticalGradient(
                                    colors = listOf(
                                        Color.Transparent,
                                        Color(0xBB000000)
                                    ),
                                    startY = 0f
                                )
                            )
                    )
                    // Contenido encima
                    Column(
                        modifier = Modifier
                            .align(Alignment.BottomStart)
                            .padding(14.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                Icons.Filled.LocationOn,
                                contentDescription = null,
                                tint = if (hasGPS) Color(0xFF00E5FF) else Color.White,
                                modifier = Modifier.size(20.dp)
                            )
                            Spacer(Modifier.width(6.dp))
                            Text(
                                "Ver mapa de ruta",
                                color = Color.White,
                                fontWeight = FontWeight.Bold,
                                fontSize = 15.sp
                            )
                        }
                        Spacer(Modifier.height(2.dp))
                        Text(
                            if (hasGPS)
                                "ðŸ“ ${"%.5f".format(telemetry?.lat)}, ${"%.5f".format(telemetry?.lon)}"
                            else "Toca para abrir el mapa",
                            color = Color.LightGray,
                            fontSize = 11.sp
                        )
                    }
                    // Badge de GPS activo
                    if (hasGPS) {
                        Surface(
                            modifier = Modifier.align(Alignment.TopEnd).padding(10.dp),
                            shape = RoundedCornerShape(20.dp),
                            color = Color(0xCC00C853)
                        ) {
                            Text(
                                "â— GPS",
                                color = Color.White,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun TelemetryCard(title: String, value: String, unit: String, modifier: Modifier, panelColor: Color, accentColor: Color, textColor: Color) {
    Column(
        modifier = modifier
            .clip(RoundedCornerShape(14.dp))
            .background(panelColor)
            .padding(14.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(title, color = Color.Gray, fontSize = 11.sp, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(6.dp))
        Row(verticalAlignment = Alignment.Bottom) {
            Text(value, color = accentColor, fontSize = 32.sp, fontWeight = FontWeight.Bold)
            if (unit.isNotEmpty()) {
                Spacer(modifier = Modifier.width(3.dp))
                Text(unit, color = textColor.copy(alpha = 0.6f), fontSize = 13.sp, modifier = Modifier.padding(bottom = 5.dp))
            }
        }
    }
}

