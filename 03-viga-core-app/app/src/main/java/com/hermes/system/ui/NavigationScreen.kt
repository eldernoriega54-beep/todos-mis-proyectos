package com.hermes.system.ui

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.app.NotificationCompat
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import org.osmdroid.config.Configuration
import org.osmdroid.util.GeoPoint
import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.Marker
import org.osmdroid.views.overlay.Polyline
import java.io.File
import java.net.URL
import java.net.URLEncoder

data class PlaceSuggestion(val name: String, val lat: Double, val lon: Double)
data class OsrmRoute(val distanceKm: Double, val durationMin: Int, val points: List<GeoPoint>, val steps: List<String>)

suspend fun getPlaceSuggestions(query: String): List<PlaceSuggestion> = withContext(Dispatchers.IO) {
    try {
        val q = URLEncoder.encode(query, "UTF-8")
        // Restringir a Honduras (&countrycodes=hn) para evitar lugares en Europa que causan fallos de ruta
        val url = "https://nominatim.openstreetmap.org/search?q=$q&format=json&limit=5&addressdetails=1&countrycodes=hn"
        val conn = URL(url).openConnection() as java.net.HttpURLConnection
        conn.setRequestProperty("User-Agent", "HERMES-V1-App")
        val response = conn.inputStream.bufferedReader().readText()
        val jsonArray = JSONArray(response)
        val list = mutableListOf<PlaceSuggestion>()
        for (i in 0 until jsonArray.length()) {
            val obj = jsonArray.getJSONObject(i)
            list.add(PlaceSuggestion(obj.getString("display_name"), obj.getString("lat").toDouble(), obj.getString("lon").toDouble()))
        }
        list
    } catch (e: Exception) { emptyList() }
}

suspend fun fetchOsrmRoute(fromLat: Double, fromLon: Double, toLat: Double, toLon: Double): OsrmRoute? = withContext(Dispatchers.IO) {
    try {
        val urlStr = "https://router.project-osrm.org/route/v1/driving/$fromLon,$fromLat;$toLon,$toLat?overview=full&geometries=geojson&steps=true"
        val conn = URL(urlStr).openConnection() as java.net.HttpURLConnection
        conn.setRequestProperty("User-Agent", "HERMES-V1-App/1.0 (Android)")
        
        if (conn.responseCode == 200) {
            val responseText = conn.inputStream.bufferedReader().readText()
            val json = JSONObject(responseText)
            if (json.getString("code") == "Ok") {
                val route = json.getJSONArray("routes").getJSONObject(0)
                val distance = route.getDouble("distance") / 1000.0
                val duration = (route.getDouble("duration") / 60).toInt()
                val coords = route.getJSONObject("geometry").getJSONArray("coordinates")
                val points = (0 until coords.length()).map { i ->
                    val c = coords.getJSONArray(i)
                    GeoPoint(c.getDouble(1), c.getDouble(0))
                }
                val legs = route.getJSONArray("legs")
                val steps = mutableListOf<String>()
                for (l in 0 until legs.length()) {
                    val legSteps = legs.getJSONObject(l).getJSONArray("steps")
                    for (s in 0 until legSteps.length()) {
                        val step = legSteps.getJSONObject(s)
                        val type = step.getJSONObject("maneuver").getString("type")
                        val dist = step.getDouble("distance").toInt()
                        val instr = when (type) {
                            "depart" -> "▶ Inicia ruta"
                            "arrive" -> "ðŸ Llegaste a tu destino"
                            "turn" -> "↱ Gira en $dist m"
                            "continue" -> "⬆ Continúa $dist m"
                            else -> ""
                        }
                        if (instr.isNotBlank()) steps.add(instr)
                    }
                }
                return@withContext OsrmRoute(distance, duration, points, steps)
            }
        }
    } catch (e: Exception) { e.printStackTrace() }
    
    // FALLBACK: Si OSRM falla (ej. lugares sin carreteras, errores de servidor), traza ruta en línea recta
    val start = GeoPoint(fromLat, fromLon)
    val end = GeoPoint(toLat, toLon)
    
    // Calcular distancia Haversine manual básica para la línea recta
    val dLat = Math.toRadians(toLat - fromLat)
    val dLon = Math.toRadians(toLon - fromLon)
    val a = kotlin.math.sin(dLat/2) * kotlin.math.sin(dLat/2) +
            kotlin.math.cos(Math.toRadians(fromLat)) * kotlin.math.cos(Math.toRadians(toLat)) *
            kotlin.math.sin(dLon/2) * kotlin.math.sin(dLon/2)
    val distKm = (6371.0 * 2 * kotlin.math.atan2(kotlin.math.sqrt(a), kotlin.math.sqrt(1-a)))
    val duration = (distKm / 40.0 * 60.0).toInt() // asumiendo 40 km/h en moto
    
    OsrmRoute(
        distanceKm = distKm,
        durationMin = duration,
        points = listOf(start, end),
        steps = listOf("▶ Dirígete directo a tu destino (Ruta directa)", "ðŸ Llegaste a tu destino")
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NavigationScreen(
    currentLat: Double,
    currentLon: Double,
    initialDestLat: Double? = null,
    initialDestLon: Double? = null,
    initialDestName: String? = null,
    onBack: () -> Unit
) {
    val scope = rememberCoroutineScope()
    val accentColor = Color(0xFF00E5FF)
    
    var searchQuery by remember { mutableStateOf(initialDestName ?: "") }
    var suggestions by remember { mutableStateOf<List<PlaceSuggestion>>(emptyList()) }
    var isSearching by remember { mutableStateOf(false) }
    var loading by remember { mutableStateOf(false) }
    var route by remember { mutableStateOf<OsrmRoute?>(null) }
    var stepIndex by remember { mutableStateOf(0) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    
    var mapViewRef by remember { mutableStateOf<MapView?>(null) }
    var routeLineRef by remember { mutableStateOf<Polyline?>(null) }
    var destMarker by remember { mutableStateOf<Marker?>(null) }

    // Autocompletado en vivo
    LaunchedEffect(searchQuery) {
        if (searchQuery.length > 2) {
            isSearching = true
            delay(600) // debounce
            suggestions = getPlaceSuggestions(searchQuery)
            isSearching = false
        } else {
            suggestions = emptyList()
        }
    }

    // Evitar calcular rutas desde África (0.0, 0.0) si no hay GPS aún
    val startLat = if (currentLat != 0.0) currentLat else 15.37681
    val startLon = if (currentLon != 0.0) currentLon else -87.79224

    // Disparar ruta inicial si viene del Chat IA
    LaunchedEffect(initialDestLat, initialDestLon) {
        if (initialDestLat != null && initialDestLon != null) {
            loading = true
            val r = fetchOsrmRoute(startLat, startLon, initialDestLat, initialDestLon)
            loading = false
            if (r == null) errorMessage = "No se pudo trazar la ruta hacia ese lugar. Intenta otro."
            else route = r
        }
    }

    LaunchedEffect(route) {
        val r = route ?: return@LaunchedEffect
        if (r.points.size < 2) return@LaunchedEffect
        routeLineRef?.setPoints(r.points)
        mapViewRef?.controller?.setZoom(15.0)
        mapViewRef?.controller?.animateTo(r.points.first())
        destMarker?.position = r.points.last()
        mapViewRef?.invalidate()
    }

    Box(modifier = Modifier.fillMaxSize().background(Color(0xFF121212))) {
        AndroidView(
            factory = { ctx ->
                Configuration.getInstance().load(ctx, ctx.getSharedPreferences("osmdroid", Context.MODE_PRIVATE))
                MapView(ctx).apply {
                    setTileSource(GOOGLE_MAPS)
                    setMultiTouchControls(true)
                    controller.setZoom(15.0)
                    controller.setCenter(GeoPoint(startLat, startLon))
                    
                    val myMk = Marker(this).apply { position = GeoPoint(startLat, startLon) }
                    overlays.add(myMk)
                    
                    val rl = Polyline().apply { outlinePaint.color = android.graphics.Color.parseColor("#00E676"); outlinePaint.strokeWidth = 14f }
                    overlays.add(rl); routeLineRef = rl
                    
                    val dm = Marker(this)
                    overlays.add(dm); destMarker = dm
                    mapViewRef = this
                }
            },
            modifier = Modifier.fillMaxSize()
        )

        // Buscador Inteligente
        Column(modifier = Modifier.fillMaxWidth().background(Color(0xFF1E1E1E).copy(alpha=0.95f)).padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, null, tint = Color.White) }
                Text("Búsqueda Inteligente", color = accentColor, fontSize = 18.sp, fontWeight = FontWeight.Bold)
            }
            Spacer(Modifier.height(8.dp))
            
            Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                OutlinedTextField(
                    value = searchQuery, onValueChange = { searchQuery = it },
                    placeholder = { Text("Ej: Estadio Nacional...", color = Color.Gray) },
                    modifier = Modifier.weight(1f), singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(focusedTextColor = Color.White, unfocusedTextColor = Color.White, focusedBorderColor = accentColor)
                )
                Spacer(Modifier.width(8.dp))
                // Botón explícito de buscar
                Button(
                    onClick = {
                        if (searchQuery.isNotBlank()) {
                            isSearching = true
                            scope.launch {
                                suggestions = getPlaceSuggestions(searchQuery)
                                isSearching = false
                            }
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = accentColor)
                ) {
                    Icon(Icons.Filled.Search, contentDescription = "Buscar", tint = Color.Black)
                }
            }
            
            errorMessage?.let { Text(it, color = Color.Red, fontSize = 13.sp, modifier = Modifier.padding(top=4.dp)) }
            
            // Sugerencias Autocompletado
            if (isSearching) {
                LinearProgressIndicator(color = accentColor, modifier = Modifier.fillMaxWidth().padding(top=4.dp))
            } else if (suggestions.isNotEmpty()) {
                LazyColumn(modifier = Modifier.fillMaxWidth().heightIn(max = 200.dp).background(Color(0xFF2A2A2A), RoundedCornerShape(8.dp)).padding(8.dp)) {
                    items(suggestions) { place ->
                        Text(
                            text = place.name, color = Color.White, fontSize = 13.sp,
                            modifier = Modifier.fillMaxWidth().clickable {
                                searchQuery = "" // Ocultar sugerencias
                                suggestions = emptyList()
                                loading = true; route = null; stepIndex = 0; errorMessage = null
                                scope.launch {
                                    val r = fetchOsrmRoute(startLat, startLon, place.lat, place.lon)
                                    loading = false
                                    if (r == null) errorMessage = "No se pudo trazar la ruta hacia ese lugar. Intenta otro."
                                    else route = r
                                }
                            }.padding(12.dp)
                        )
                        HorizontalDivider(color = Color.DarkGray)
                    }
                }
            }
        }

        if (loading) {
            CircularProgressIndicator(color = accentColor, modifier = Modifier.align(Alignment.Center))
        }

        // Panel inferior
        route?.let { r ->
            Column(modifier = Modifier.align(Alignment.BottomCenter).fillMaxWidth().background(Color(0xFF1E1E1E)).padding(16.dp)) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("${"%.1f".format(r.distanceKm)} km", color = accentColor, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                    Text("${r.durationMin} min", color = Color(0xFF00E676), fontSize = 24.sp, fontWeight = FontWeight.Bold)
                }
                Spacer(Modifier.height(8.dp))
                if (r.steps.isNotEmpty()) {
                    Text(r.steps.getOrElse(stepIndex) { r.steps.last() }, color = Color.White, fontSize = 16.sp)
                    Row(modifier = Modifier.fillMaxWidth().padding(top=8.dp)) {
                        if (stepIndex > 0) Button(onClick = { stepIndex-- }, modifier = Modifier.weight(1f)) { Text("â—€") }
                        Spacer(Modifier.width(8.dp))
                        if (stepIndex < r.steps.lastIndex) Button(onClick = { stepIndex++ }, modifier = Modifier.weight(1f)) { Text("▶") }
                    }
                }
            }
        }
    }
}

