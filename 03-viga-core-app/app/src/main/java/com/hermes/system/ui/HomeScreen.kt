package com.hermes.system.ui

import android.content.Context
import android.content.Intent
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import android.speech.RecognizerIntent
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import kotlin.math.*

data class HomeStatus(
    val pirActive: Boolean = false,
    val alarmActive: Boolean = false,
    val light1: Boolean = false,
    val light2: Boolean = false,
    val light3: Boolean = false,
    val currentAmps: Float = 0f,
    val voltageV: Float = 120f
)

suspend fun fetchHomeStatus(ip: String): HomeStatus = withContext(Dispatchers.IO) {
    try {
        val conn = URL("http:///status").openConnection() as HttpURLConnection
        conn.setRequestProperty("User-Agent", "HERMES-V1")
        conn.connectTimeout = 3000; conn.readTimeout = 3000
        if (conn.responseCode == 200) {
            val json = JSONObject(conn.inputStream.bufferedReader().readText())
            return@withContext HomeStatus(
                pirActive = json.optBoolean("pir", false),
                alarmActive = json.optBoolean("alarm", false),
                light1 = json.optBoolean("light1", false),
                light2 = json.optBoolean("light2", false),
                light3 = json.optBoolean("light3", false),
                currentAmps = json.optDouble("amps", 0.0).toFloat(),
                voltageV = json.optDouble("voltage", 120.0).toFloat()
            )
        }
    } catch (e: Exception) {}
    HomeStatus()
}

suspend fun sendHomeCommand(ip: String, endpoint: String): Boolean = withContext(Dispatchers.IO) {
    try {
        val conn = URL("http:///").openConnection() as HttpURLConnection
        conn.requestMethod = "POST"; conn.connectTimeout = 3000; conn.readTimeout = 3000
        conn.doOutput = true; conn.outputStream.write("{}".toByteArray())
        return@withContext conn.responseCode == 200
    } catch (e: Exception) { false }
}

suspend fun sendVoiceCmd(ip: String, text: String): String = withContext(Dispatchers.IO) {
    try {
        val enc = java.net.URLEncoder.encode(text, "UTF-8")
        val conn = URL("http:///voice?cmd=").openConnection() as HttpURLConnection
        conn.connectTimeout = 3000; conn.readTimeout = 3000
        if (conn.responseCode == 200) return@withContext conn.inputStream.bufferedReader().readText()
    } catch (e: Exception) {}
    "Sin respuesta"
}

fun calcEnee(amps: Float, volts: Float): Triple<Float, Float, Float> {
    val watts = amps * volts
    val kwh = (watts * 8 * 30) / 1000f
    var bill = 0f; var rem = kwh
    if (rem > 0) { val b = minOf(rem, 10f); bill += b * 0.79f; rem -= b }
    if (rem > 0) { val b = minOf(rem, 290f); bill += b * 2.21f; rem -= b }
    if (rem > 0) { val b = minOf(rem, 200f); bill += b * 2.65f; rem -= b }
    if (rem > 0) { bill += rem * 3.11f }
    bill = (bill + 20f) * 1.05f
    return Triple(kwh, bill, watts)
}

fun distMeters(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Double {
    val R = 6371000.0; val dLat = Math.toRadians(lat2 - lat1); val dLon = Math.toRadians(lon2 - lon1)
    val a = sin(dLat/2).pow(2) + cos(Math.toRadians(lat1)) * cos(Math.toRadians(lat2)) * sin(dLon/2).pow(2)
    return R * 2 * atan2(sqrt(a), sqrt(1 - a))
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(currentLat: Double, currentLon: Double, onBack: () -> Unit) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val prefs = remember { context.getSharedPreferences("hermes_home", Context.MODE_PRIVATE) }
    val accent = Color(0xFF00E5FF); val homeColor = Color(0xFFFFAB40); val bg = Color(0xFF0A0A0F); val panel = Color(0xFF1A1A2E)

    var connected by remember { mutableStateOf(false) }
    var routerIp by remember { mutableStateOf(prefs.getString("router_ip", "") ?: "") }
    var showIpDialog by remember { mutableStateOf(false) }
    var ipInput by remember { mutableStateOf(routerIp) }
    var status by remember { mutableStateOf(HomeStatus()) }
    var geofence by remember { mutableStateOf(prefs.getBoolean("geofence", true)) }
    var homeLat by remember { mutableStateOf(prefs.getFloat("home_lat", 0f).toDouble()) }
    var homeLon by remember { mutableStateOf(prefs.getFloat("home_lon", 0f).toDouble()) }
    var aiMsg by remember { mutableStateOf("") }
    var voiceRes by remember { mutableStateOf("") }
    var listening by remember { mutableStateOf(false) }
    var showBill by remember { mutableStateOf(false) }
    var statusMsg by remember { mutableStateOf("") }

    val speechLauncher = rememberLauncherForActivityResult(ActivityResultContracts.StartActivityForResult()) { r ->
        val txt = r.data?.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS)?.firstOrNull() ?: ""
        listening = false
        if (txt.isNotEmpty()) {
            voiceRes = "Escuche: \"\""
            scope.launch { val res = sendVoiceCmd(routerIp, txt); voiceRes = "Ejecutado: "; status = fetchHomeStatus(routerIp) }
        }
    }

    LaunchedEffect(connected, routerIp) {
        if (connected && routerIp.isNotEmpty()) {
            while (true) { try { status = fetchHomeStatus(routerIp) } catch (e: Exception) {}; delay(3000) }
        }
    }

    LaunchedEffect(connected) {
        if (connected) {
            while (true) {
                delay(60000)
                val (kwh, bill, watts) = calcEnee(status.currentAmps, status.voltageV)
                aiMsg = if (watts > 500) {
                    if (status.light3) { sendHomeCommand(routerIp, "lights/3/off"); "Consumo alto (W). La IA apago Luz 3 para ahorrar. Est. L /mes." }
                    else "Consumo alto (W). Considera apagar algo. Est. L /mes."
                } else "Consumo normal (W). Est. factura ENEE: L /mes."
            }
        }
    }

    LaunchedEffect(currentLat, currentLon) {
        if (geofence && homeLat != 0.0 && connected && routerIp.isNotEmpty()) {
            val dist = distMeters(currentLat, currentLon, homeLat, homeLon)
            if (dist > 3.0) {
                sendHomeCommand(routerIp, "lights/all/off"); sendHomeCommand(routerIp, "security/on")
                statusMsg = "Te alejaste m de casa. Luces apagadas y PIR activo."
            }
        }
    }

    if (showIpDialog) {
        AlertDialog(onDismissRequest = { showIpDialog = false }, containerColor = panel,
            title = { Text("IP del ESP32 Hogar", color = homeColor, fontWeight = FontWeight.Bold) },
            text = {
                Column {
                    Text("IP asignada al ESP32 por el router (ej: 192.168.1.100)", color = Color.Gray, fontSize = 13.sp)
                    Spacer(Modifier.height(8.dp))
                    OutlinedTextField(value = ipInput, onValueChange = { ipInput = it },
                        label = { Text("IP del Hogar", color = Color.Gray) },
                        colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = homeColor, unfocusedBorderColor = Color.Gray, focusedTextColor = Color.White, unfocusedTextColor = Color.White))
                }
            },
            confirmButton = {
                Button(onClick = {
                    routerIp = ipInput.trim()
                    prefs.edit().putString("router_ip", routerIp).apply()
                    showIpDialog = false
                    scope.launch {
                        try {
                            status = fetchHomeStatus(routerIp); connected = true
                            if (homeLat == 0.0 && currentLat != 0.0) {
                                homeLat = currentLat; homeLon = currentLon
                                prefs.edit().putFloat("home_lat", currentLat.toFloat()).putFloat("home_lon", currentLon.toFloat()).apply()
                            }
                            statusMsg = "Conectado a HERMES HOME"
                        } catch (e: Exception) { statusMsg = "No se pudo conectar. Verifica la IP." }
                    }
                }, colors = ButtonDefaults.buttonColors(containerColor = homeColor)) { Text("Conectar", color = Color.Black, fontWeight = FontWeight.Bold) }
            },
            dismissButton = { TextButton(onClick = { showIpDialog = false }) { Text("Cancelar", color = Color.Gray) } }
        )
    }

    if (showBill) {
        val (kwh, bill, watts) = calcEnee(status.currentAmps, status.voltageV)
        AlertDialog(onDismissRequest = { showBill = false }, containerColor = panel,
            title = { Text("Estimado Factura ENEE", color = homeColor, fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Potencia actual:  W", color = Color.White)
                    Text("Consumo mensual est.:  kWh", color = Color.White)
                    HorizontalDivider(color = Color.DarkGray)
                    Text("Factura estimada (ENEE Honduras):", color = Color.Gray, fontSize = 13.sp)
                    Text("L ", color = homeColor, fontSize = 32.sp, fontWeight = FontWeight.Black)
                    Text("Incluye cargo fijo L20 + alumbrado 5%", color = Color.Gray, fontSize = 11.sp)
                    HorizontalDivider(color = Color.DarkGray)
                    Text("Ahorro potencial apagando todo: L /mes", color = Color(0xFF90EE90), fontSize = 13.sp)
                }
            },
            confirmButton = { TextButton(onClick = { showBill = false }) { Text("Cerrar", color = homeColor) } }
        )
    }

    Column(Modifier.fillMaxSize().background(bg).verticalScroll(rememberScrollState())) {
        Row(Modifier.fillMaxWidth().background(panel).padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.SpaceBetween) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, null, tint = Color.White) }
                Spacer(Modifier.width(4.dp))
                Icon(Icons.Filled.Home, null, tint = homeColor, modifier = Modifier.size(22.dp))
                Spacer(Modifier.width(6.dp))
                Text("HERMES HOME", color = homeColor, fontSize = 20.sp, fontWeight = FontWeight.Bold)
            }
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Box(Modifier.size(10.dp).clip(CircleShape).background(if (connected) Color.Green else Color.Red))
                Text(if (connected) "Online" else "Offline", color = Color.Gray, fontSize = 12.sp)
                IconButton(onClick = { showIpDialog = true }) { Icon(Icons.Filled.Settings, null, tint = Color.Gray) }
            }
        }

        if (statusMsg.isNotEmpty()) Box(Modifier.fillMaxWidth().background(Color(0xFF1E2D1E)).padding(12.dp)) {
            Text(statusMsg, color = Color(0xFF90EE90), fontSize = 13.sp)
        }

        if (!connected) {
            Box(Modifier.fillMaxWidth().padding(40.dp), contentAlignment = Alignment.Center) {
                Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(16.dp)) {
                    Icon(Icons.Filled.Home, null, tint = homeColor, modifier = Modifier.size(80.dp))
                    Text("HERMES HOME", color = homeColor, fontSize = 22.sp, fontWeight = FontWeight.Bold)
                    Text("Conéctate al router de tu hogar\npara controlar todo.", color = Color.Gray, textAlign = TextAlign.Center)
                    Button(onClick = { showIpDialog = true },
                        colors = ButtonDefaults.buttonColors(containerColor = homeColor), modifier = Modifier.fillMaxWidth()) {
                        Icon(Icons.Filled.Wifi, null, tint = Color.Black); Spacer(Modifier.width(8.dp))
                        Text("Conectar al Hogar", color = Color.Black, fontWeight = FontWeight.Bold)
                    }
                }
            }
        } else {
            Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                if (status.alarmActive || status.pirActive) {
                    Surface(shape = RoundedCornerShape(12.dp), color = Color(0xFF3D1010)) {
                        Row(Modifier.fillMaxWidth().padding(16.dp), Arrangement.SpaceBetween, Alignment.CenterVertically) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Filled.Warning, null, tint = Color.Red, modifier = Modifier.size(28.dp))
                                Spacer(Modifier.width(8.dp))
                                Column { Text("MOVIMIENTO DETECTADO!", color = Color.Red, fontWeight = FontWeight.Bold); Text("Alarma activa", color = Color.Gray, fontSize = 12.sp) }
                            }
                            Button(onClick = { scope.launch { sendHomeCommand(routerIp, "alarm/off") } },
                                colors = ButtonDefaults.buttonColors(containerColor = Color.Red)) { Text("Desactivar", color = Color.White, fontSize = 12.sp) }
                        }
                    }
                }

                Surface(shape = RoundedCornerShape(16.dp), color = panel) {
                    Column(Modifier.padding(16.dp)) {
                        Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween, Alignment.CenterVertically) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Filled.ElectricBolt, null, tint = Color.Yellow, modifier = Modifier.size(20.dp))
                                Spacer(Modifier.width(6.dp)); Text("Consumo Eléctrico", color = Color.White, fontWeight = FontWeight.SemiBold)
                            }
                            Button(onClick = { showBill = true }, colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2A3A2A)),
                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)) {
                                Icon(Icons.Filled.ReceiptLong, null, tint = Color(0xFF90EE90), modifier = Modifier.size(14.dp))
                                Spacer(Modifier.width(4.dp)); Text("Gastos Futuros", color = Color(0xFF90EE90), fontSize = 11.sp)
                            }
                        }
                        Spacer(Modifier.height(12.dp))
                        Row(Modifier.fillMaxWidth(), Arrangement.SpaceAround) {
                            listOf(
                                Triple(" A", "Corriente", accent),
                                Triple(" W", "Potencia", Color.Yellow),
                                Triple(" V", "Voltaje", Color(0xFF90EE90))
                            ).forEach { (val_, lbl, clr) ->
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text(val_, color = clr, fontSize = 22.sp, fontWeight = FontWeight.Black)
                                    Text(lbl, color = Color.Gray, fontSize = 11.sp)
                                }
                            }
                        }
                    }
                }

                Surface(shape = RoundedCornerShape(16.dp), color = panel) {
                    Column(Modifier.padding(16.dp)) {
                        Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween, Alignment.CenterVertically) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Filled.Lightbulb, null, tint = Color.Yellow, modifier = Modifier.size(20.dp))
                                Spacer(Modifier.width(6.dp)); Text("Luces", color = Color.White, fontWeight = FontWeight.SemiBold, modifier = Modifier.weight(1f))
                            }
                            TextButton(onClick = { scope.launch { sendHomeCommand(routerIp, "lights/all/off"); status = status.copy(light1=false, light2=false, light3=false) } }) {
                                Text("Apagar todo", color = Color.Gray, fontSize = 12.sp)
                            }
                        }
                        listOf(Triple("Luz 1", status.light1, "lights/1"), Triple("Luz 2", status.light2, "lights/2"), Triple("Luz 3", status.light3, "lights/3")).forEach { (name, on, ep) ->
                            Row(Modifier.fillMaxWidth().padding(vertical = 4.dp), Arrangement.SpaceBetween, Alignment.CenterVertically) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(Icons.Filled.Lightbulb, null, tint = if (on) Color.Yellow else Color.DarkGray, modifier = Modifier.size(18.dp))
                                    Spacer(Modifier.width(8.dp)); Text(name, color = if (on) Color.White else Color.Gray)
                                }
                                Switch(checked = on, onCheckedChange = { v ->
                                    scope.launch {
                                        sendHomeCommand(routerIp, if (v) "/on" else "/off")
                                        status = status.copy(light1 = if(name=="Luz 1") v else status.light1, light2 = if(name=="Luz 2") v else status.light2, light3 = if(name=="Luz 3") v else status.light3)
                                    }
                                }, colors = SwitchDefaults.colors(checkedThumbColor = Color.Yellow, checkedTrackColor = Color(0xFF444400)))
                            }
                        }
                    }
                }

                Surface(shape = RoundedCornerShape(16.dp), color = panel) {
                    Column(Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Filled.Mic, null, tint = accent, modifier = Modifier.size(20.dp))
                            Spacer(Modifier.width(6.dp)); Text("Control por Voz", color = Color.White, fontWeight = FontWeight.SemiBold)
                        }
                        Spacer(Modifier.height(8.dp))
                        if (voiceRes.isNotEmpty()) { Text(voiceRes, color = accent, fontSize = 13.sp); Spacer(Modifier.height(6.dp)) }
                        Text("Ej: \"apaga las luces\", \"activa alarma\", \"cuanto consumo\"", color = Color.Gray, fontSize = 11.sp)
                        Spacer(Modifier.height(8.dp))
                        Button(onClick = {
                            listening = true
                            val i = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                                putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                                putExtra(RecognizerIntent.EXTRA_LANGUAGE, "es-HN")
                                putExtra(RecognizerIntent.EXTRA_PROMPT, "Di un comando para tu hogar...")
                            }
                            try { speechLauncher.launch(i) } catch (e: Exception) { listening = false }
                        }, colors = ButtonDefaults.buttonColors(containerColor = if (listening) Color.Red else accent), modifier = Modifier.fillMaxWidth()) {
                            Icon(if (listening) Icons.Filled.Stop else Icons.Filled.Mic, null, tint = Color.Black)
                            Spacer(Modifier.width(8.dp)); Text(if (listening) "Escuchando..." else "Hablar", color = Color.Black, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                if (aiMsg.isNotEmpty()) Surface(shape = RoundedCornerShape(16.dp), color = Color(0xFF1A2A1A)) {
                    Row(Modifier.padding(14.dp), verticalAlignment = Alignment.Top) {
                        Icon(Icons.Filled.Psychology, null, tint = accent, modifier = Modifier.size(20.dp))
                        Spacer(Modifier.width(8.dp)); Text(aiMsg, color = Color.LightGray, fontSize = 13.sp)
                    }
                }

                Surface(shape = RoundedCornerShape(16.dp), color = panel) {
                    Column(Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Filled.Tune, null, tint = Color.Gray, modifier = Modifier.size(20.dp))
                            Spacer(Modifier.width(6.dp)); Text("Configuracion del Hogar", color = Color.White, fontWeight = FontWeight.SemiBold)
                        }
                        Spacer(Modifier.height(8.dp))
                        Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween, Alignment.CenterVertically) {
                            Column { Text("Geovalla (3 metros)", color = Color.White, fontSize = 14.sp); Text("Luces apagadas al salir de casa", color = Color.Gray, fontSize = 11.sp) }
                            Switch(checked = geofence, onCheckedChange = { v -> geofence = v; prefs.edit().putBoolean("geofence", v).apply() },
                                colors = SwitchDefaults.colors(checkedThumbColor = homeColor, checkedTrackColor = Color(0xFF3D2A00)))
                        }
                        HorizontalDivider(color = Color.DarkGray, modifier = Modifier.padding(vertical = 8.dp))
                        Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween, Alignment.CenterVertically) {
                            Text("IP guardada:", color = Color.Gray, fontSize = 12.sp)
                            Text(routerIp.ifEmpty { "No configurada" }, color = accent, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                        Spacer(Modifier.height(8.dp))
                        OutlinedButton(onClick = { showIpDialog = true }, modifier = Modifier.fillMaxWidth(),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color.Gray)) {
                            Text("Cambiar IP del Router", color = Color.Gray, fontSize = 13.sp)
                        }
                    }
                }
                Spacer(Modifier.height(24.dp))
            }
        }
    }
}
