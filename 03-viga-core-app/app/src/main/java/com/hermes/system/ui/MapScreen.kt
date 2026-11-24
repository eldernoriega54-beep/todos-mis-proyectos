package com.hermes.system.ui

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import kotlin.math.pow
import kotlin.math.sqrt
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
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
import androidx.core.content.ContextCompat
import com.hermes.system.mqtt.TelemetryData
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import org.osmdroid.config.Configuration
import org.osmdroid.tileprovider.tilesource.XYTileSource
import org.osmdroid.util.GeoPoint
import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.Marker
import org.osmdroid.views.overlay.Polyline
import java.io.File

// Ã¢â€â‚¬Ã¢â€â‚¬ Tiles de Google Maps (100% confiable, sin error 403) Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
internal val GOOGLE_MAPS = object : org.osmdroid.tileprovider.tilesource.OnlineTileSourceBase(
    "Google", 0, 19, 256, "", 
    arrayOf("https://mt0.google.com/vt/lyrs=m&x=", "https://mt1.google.com/vt/lyrs=m&x=", "https://mt2.google.com/vt/lyrs=m&x=", "https://mt3.google.com/vt/lyrs=m&x=")
) {
    override fun getTileURLString(pMapTileIndex: Long): String {
        return baseUrl + org.osmdroid.util.MapTileIndex.getX(pMapTileIndex) +
               "&y=" + org.osmdroid.util.MapTileIndex.getY(pMapTileIndex) +
               "&z=" + org.osmdroid.util.MapTileIndex.getZoom(pMapTileIndex)
    }
}

enum class RouteState { IDLE, RECORDING, FINISHED, ANIMATING }

data class RoutePoint(val lat: Double, val lon: Double, val speed: Float, val timeMs: Long)

@Composable
fun MapScreen(
    telemetry: TelemetryData?,
    language: String,
    onBack: () -> Unit,
    onStartRoute: () -> Unit = {},
    onStopRoute: () -> Unit = {},
    onNavigate: () -> Unit = {},
    onAiChat: () -> Unit = {},
    onHome: () -> Unit = {}
) {
    val isSpanish = language == "es"
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    // GPS del celular como respaldo Ã¢â‚¬â€ actualización en VIVO
    var phoneLat by remember { mutableStateOf(0.0) }
    var phoneLon by remember { mutableStateOf(0.0) }

    DisposableEffect(Unit) {
        val lm = context.getSystemService(Context.LOCATION_SERVICE) as android.location.LocationManager

        val listener = android.location.LocationListener { loc ->
            phoneLat = loc.latitude
            phoneLon = loc.longitude
        }

        if (ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION)
            == PackageManager.PERMISSION_GRANTED) {
            try {
                // Arrancar con la última posición conocida inmediatamente
                val last = lm.getLastKnownLocation(android.location.LocationManager.GPS_PROVIDER)
                    ?: lm.getLastKnownLocation(android.location.LocationManager.NETWORK_PROVIDER)
                last?.let { phoneLat = it.latitude; phoneLon = it.longitude }

                // Pedir actualizaciones en vivo cada 1 segundo o 1 metro
                if (lm.isProviderEnabled(android.location.LocationManager.GPS_PROVIDER)) {
                    lm.requestLocationUpdates(android.location.LocationManager.GPS_PROVIDER, 1000L, 1f, listener)
                }
                if (lm.isProviderEnabled(android.location.LocationManager.NETWORK_PROVIDER)) {
                    lm.requestLocationUpdates(android.location.LocationManager.NETWORK_PROVIDER, 1000L, 1f, listener)
                }
            } catch (_: Exception) {}
        }

        // Limpiar listener cuando salgas del mapa
        onDispose {
            try { lm.removeUpdates(listener) } catch (_: Exception) {}
        }
    }

    val effectiveLat = if ((telemetry?.lat ?: 0f) != 0f) telemetry!!.lat.toDouble() else phoneLat
    val effectiveLon = if ((telemetry?.lon ?: 0f) != 0f) telemetry!!.lon.toDouble() else phoneLon
    val hasPosition  = effectiveLat != 0.0 && effectiveLon != 0.0
    val usingHelmet  = (telemetry?.lat ?: 0f) != 0f

    // Estado de ruta
    var routeState by remember { mutableStateOf(RouteState.IDLE) }
    val fullRoute = remember { mutableStateListOf<RoutePoint>() }
    var elapsedSecs by remember { mutableStateOf(0) }

    // Contador mientras graba
    LaunchedEffect(routeState) {
        if (routeState == RouteState.RECORDING) {
            elapsedSecs = 0
            while (routeState == RouteState.RECORDING) {
                delay(1000)
                elapsedSecs++
            }
        }
    }

    // Referencias al mapa
    var mapViewRef  by remember { mutableStateOf<MapView?>(null) }
    var routeLine   by remember { mutableStateOf<Polyline?>(null) }
    var animLine    by remember { mutableStateOf<Polyline?>(null) }
    var markerRef   by remember { mutableStateOf<Marker?>(null) }

    // Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ GRABACIÃƒâ€œN DE RUTA CON FILTROS PROFESIONALES Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    // Buffer de puntos: acumula nuevas posiciones y redibuja cada 500ms
    // Filtro 1: mínimo 3 metros entre puntos consecutivos (evita puntos duplicados)
    // Filtro 2: descartar saltos > 80 metros (lecturas erróneas del GPS)
    LaunchedEffect(routeState) {
        while (true) {
            delay(500) // Redibuja cada 500ms Ã¢â‚¬â€ evita el efecto "zigzag" por redraws continuos
            if (routeState == RouteState.RECORDING && hasPosition) {
                val newPt = GeoPoint(effectiveLat, effectiveLon)
                val last  = fullRoute.lastOrNull()

                if (last == null) {
                    // Primer punto Ã¢â‚¬â€ siempre agregar
                    fullRoute.add(RoutePoint(effectiveLat, effectiveLon,
                        telemetry?.speed ?: 0f, System.currentTimeMillis()))
                } else {
                    val distM = last.let {
                        val dLat = Math.toRadians(effectiveLat - it.lat)
                        val dLon = Math.toRadians(effectiveLon - it.lon)
                        val a = Math.sin(dLat/2).pow(2) +
                                Math.cos(Math.toRadians(it.lat)) *
                                Math.cos(Math.toRadians(effectiveLat)) *
                                Math.sin(dLon/2).pow(2)
                        6371000.0 * 2 * Math.atan2(sqrt(a), sqrt(1-a))
                    }
                    // Solo grabar si moví entre 3m y 80m desde el último punto
                    if (distM >= 3.0 && distM <= 80.0) {
                        fullRoute.add(RoutePoint(effectiveLat, effectiveLon,
                            telemetry?.speed ?: 0f, System.currentTimeMillis()))
                    }
                }

                // Redibujar línea solo si hay puntos suficientes
                if (fullRoute.size >= 2) {
                    routeLine?.setPoints(fullRoute.map { GeoPoint(it.lat, it.lon) })
                    mapViewRef?.invalidate()
                }
            }
        }
    }

    // Actualizar marcador en vivo (siempre, independiente de la ruta)
    LaunchedEffect(effectiveLat, effectiveLon) {
        if (!hasPosition) return@LaunchedEffect
        val pt = GeoPoint(effectiveLat, effectiveLon)
        markerRef?.position = pt
        mapViewRef?.controller?.animateTo(pt)
        mapViewRef?.invalidate()
    }

    // Ã¢â€â‚¬Ã¢â€â‚¬ UI Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    Box(modifier = Modifier.fillMaxSize()) {

        // Mapa
        AndroidView(
            factory = { ctx ->
                val cfg = Configuration.getInstance()
                cfg.load(ctx, ctx.getSharedPreferences("osmdroid", Context.MODE_PRIVATE))
                cfg.userAgentValue = ctx.packageName + "/1.0" // User Agent VÃƒ¡lido para OSM
                cfg.osmdroidBasePath  = File(ctx.cacheDir, "osmdroid")
                cfg.osmdroidTileCache = File(ctx.cacheDir, "osmdroid/tiles")

                MapView(ctx).apply {
                    setTileSource(GOOGLE_MAPS)
                    
                    // Forzar tema oscuro al mapa por defecto invirtiendo colores
                    val inverseMatrix = android.graphics.ColorMatrix(floatArrayOf(
                        -1.0f, 0.0f, 0.0f, 0.0f, 255f,
                        0.0f, -1.0f, 0.0f, 0.0f, 255f,
                        0.0f, 0.0f, -1.0f, 0.0f, 255f,
                        0.0f, 0.0f, 0.0f, 1.0f, 0.0f
                    ))
                    val destColor = android.graphics.ColorMatrix(floatArrayOf(
                        0.21f, 0.71f, 0.07f, 0.0f, 0.0f,
                        0.21f, 0.71f, 0.07f, 0.0f, 0.0f,
                        0.21f, 0.71f, 0.07f, 0.0f, 0.0f,
                        0.0f, 0.0f, 0.0f, 1.0f, 0.0f
                    ))
                    // Combinar para un efecto oscuro sutil
                    inverseMatrix.postConcat(destColor)
                    overlayManager.tilesOverlay.setColorFilter(android.graphics.ColorMatrixColorFilter(inverseMatrix))

                    setMultiTouchControls(true)
                    controller.setZoom(16.0)
                    val startLat = if (hasPosition) effectiveLat else 15.389126
                    val startLon = if (hasPosition) effectiveLon else -87.812883
                    controller.setCenter(GeoPoint(startLat, startLon))

                    // Línea de ruta grabada (azul eléctrico profesional)
                    val rl = Polyline().apply {
                        outlinePaint.color = android.graphics.Color.parseColor("#2979FF")
                        outlinePaint.strokeWidth = 14f
                        outlinePaint.isAntiAlias = true
                        outlinePaint.strokeCap = android.graphics.Paint.Cap.ROUND
                        outlinePaint.strokeJoin = android.graphics.Paint.Join.ROUND
                    }
                    overlays.add(rl)
                    routeLine = rl

                    // Línea de animación (naranja)
                    val al = Polyline().apply {
                        outlinePaint.color = android.graphics.Color.parseColor("#FF6F00")
                        outlinePaint.strokeWidth = 6f
                        outlinePaint.isAntiAlias = true
                    }
                    overlays.add(al)
                    animLine = al

                    // Marcador de posición actual
                    val mk = Marker(this).apply {
                        position = GeoPoint(startLat, startLon)
                        setAnchor(Marker.ANCHOR_CENTER, Marker.ANCHOR_BOTTOM)
                        title = "HermesSystem Ã°Å¸ÂÂÃ¯Â¸Â"
                    }
                    overlays.add(mk)
                    markerRef = mk
                    mapViewRef = this
                }
            },
            modifier = Modifier.fillMaxSize()
        )

        // Botón volver
        Box(
            modifier = Modifier.padding(16.dp).align(Alignment.TopStart)
                .background(Color.Black.copy(alpha = 0.7f), RoundedCornerShape(50))
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, null, tint = Color.White)
            }
        }

        // Badge GPS + Botón de Navegación
        Column(
            modifier = Modifier.align(Alignment.TopEnd).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
            horizontalAlignment = Alignment.End
        ) {
            if (hasPosition) {
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = if (usingHelmet) Color(0xCC00C853) else Color(0xCCFF8F00)
                ) {
                    Text(
                        if (usingHelmet) "Ã¢â€”Â GPS Casco" else "Ã¢â€”Â GPS Celular",
                        color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                    )
                }
            }
            // Botón Mi Hogar
            Surface(
                onClick = onHome,
                shape = RoundedCornerShape(20.dp),
                color = Color(0xCCFFAB40)
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Filled.Home, null, tint = Color.Black, modifier = Modifier.size(14.dp))
                    Spacer(Modifier.width(4.dp))
                    Text("Mi Hogar", color = Color.Black, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }
            // Botón Chat IA
            Surface(
                onClick = onAiChat,
                shape = RoundedCornerShape(20.dp),
                color = Color(0xCCFFAB00)
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Filled.Send, null, tint = Color.Black, modifier = Modifier.size(14.dp))
                    Spacer(Modifier.width(4.dp))
                    Text("Chat IA", color = Color.Black, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }
        }

        // Panel inferior con controles de ruta
        Surface(
            modifier = Modifier.align(Alignment.BottomCenter).fillMaxWidth().padding(12.dp),
            shape = RoundedCornerShape(20.dp),
            color = Color(0xEE111111)
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {

                when (routeState) {
                    RouteState.IDLE -> {
                        // Info de posición
                        if (hasPosition) {
                            Text("Ã°Å¸â€œÂ ${"%.5f".format(effectiveLat)}, ${"%.5f".format(effectiveLon)}",
                                color = Color.LightGray, fontSize = 12.sp)
                            Text("Ã°Å¸ÂÅ½Ã¯Â¸Â ${telemetry?.speed?.toInt() ?: 0} km/h",
                                color = Color.LightGray, fontSize = 12.sp)
                        } else {
                            Text(if (isSpanish) "Esperando GPS..." else "Waiting for GPS...",
                                color = Color.Gray, fontSize = 12.sp)
                        }
                        // Botón iniciar ruta
                        Button(
                            onClick = {
                                fullRoute.clear()
                                routeLine?.setPoints(emptyList())
                                animLine?.setPoints(emptyList())
                                mapViewRef?.invalidate()
                                routeState = RouteState.RECORDING
                                onStartRoute()
                            },
                            modifier = Modifier.fillMaxWidth().height(52.dp),
                            shape = RoundedCornerShape(14.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFF6F00))
                        ) {
                            Icon(Icons.Filled.PlayArrow, null, tint = Color.Black, modifier = Modifier.size(20.dp))
                            Spacer(Modifier.width(8.dp))
                            Text(if (isSpanish) "Iniciar Ruta" else "Start Route",
                                color = Color.Black, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        }
                    }

                    RouteState.RECORDING -> {
                        // Contador en naranja
                        val mins = elapsedSecs / 60
                        val secs = elapsedSecs % 60
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                            Surface(shape = RoundedCornerShape(12.dp), color = Color(0xFFFF6F00)) {
                                Text(
                                    "%02d:%02d".format(mins, secs),
                                    color = Color.Black, fontSize = 28.sp,
                                    fontWeight = FontWeight.Black,
                                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp)
                                )
                            }
                            Column {
                                Text("Ã¢â€”Â ${if (isSpanish) "Grabando ruta" else "Recording route"}",
                                    color = Color(0xFFFF6F00), fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                Text("${fullRoute.size} ${if (isSpanish) "puntos  Ã‚Â·  " else "pts  Ã‚Â·  "}${telemetry?.speed?.toInt() ?: 0} km/h",
                                    color = Color.LightGray, fontSize = 11.sp)
                            }
                        }
                        Button(
                            onClick = {
                                routeState = RouteState.FINISHED
                                onStopRoute()
                            },
                            modifier = Modifier.fillMaxWidth().height(48.dp),
                            shape = RoundedCornerShape(12.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF880000))
                        ) {
                            Icon(Icons.Filled.Stop, null, tint = Color.White, modifier = Modifier.size(18.dp))
                            Spacer(Modifier.width(8.dp))
                            Text(if (isSpanish) "Finalizar Ruta" else "Finish Route",
                                color = Color.White, fontWeight = FontWeight.Bold)
                        }
                    }

                    RouteState.FINISHED -> {
                        Text(
                            "Ã¢Å“â€¦ ${if (isSpanish) "Ruta finalizada Ã¢â‚¬â€ ${fullRoute.size} puntos" else "Route done Ã¢â‚¬â€ ${fullRoute.size} pts"}",
                            color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp
                        )
                        // Nueva ruta
                        Button(
                            onClick = {
                                fullRoute.clear()
                                routeLine?.setPoints(emptyList())
                                animLine?.setPoints(emptyList())
                                mapViewRef?.invalidate()
                                routeState = RouteState.IDLE
                            },
                            modifier = Modifier.fillMaxWidth().height(48.dp),
                            shape = RoundedCornerShape(12.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFF6F00))
                        ) {
                            Icon(Icons.Filled.PlayArrow, null, tint = Color.Black, modifier = Modifier.size(18.dp))
                            Spacer(Modifier.width(8.dp))
                            Text(if (isSpanish) "Iniciar Ruta" else "Start Route",
                                color = Color.Black, fontWeight = FontWeight.Bold)
                        }
                        // Ver simulación
                        if (fullRoute.size >= 2) {
                            OutlinedButton(
                                onClick = { routeState = RouteState.ANIMATING },
                                modifier = Modifier.fillMaxWidth().height(40.dp),
                                shape = RoundedCornerShape(10.dp),
                                colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFF00C853))
                            ) {
                                Icon(Icons.Filled.Slideshow, null, modifier = Modifier.size(16.dp))
                                Spacer(Modifier.width(6.dp))
                                Text(if (isSpanish) "Ver Simulación de Ruta" else "View Route Simulation",
                                    fontSize = 13.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }

                    RouteState.ANIMATING -> {
                        var animIdx by remember { mutableStateOf(0) }
                        var animSpeed by remember { mutableStateOf(0f) }
                        var animRunning by remember { mutableStateOf(true) }

                        LaunchedEffect(animRunning) {
                            if (!animRunning) return@LaunchedEffect
                            animLine?.setPoints(emptyList())
                            val pts = mutableListOf<GeoPoint>()
                            for (i in fullRoute.indices) {
                                if (!animRunning) break
                                val rp = fullRoute[i]
                                pts.add(GeoPoint(rp.lat, rp.lon))
                                animLine?.setPoints(pts.toList())
                                markerRef?.position = GeoPoint(rp.lat, rp.lon)
                                mapViewRef?.controller?.animateTo(GeoPoint(rp.lat, rp.lon))
                                mapViewRef?.invalidate()
                                animIdx = i
                                animSpeed = rp.speed
                                delay(120) // velocidad de animación
                            }
                            animRunning = false
                        }

                        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                            Text(if (isSpanish) "Ã°Å¸Å½Â¬ Simulación de Ruta" else "Ã°Å¸Å½Â¬ Route Simulation",
                                color = Color(0xFF00C853), fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Text("${animIdx + 1}/${fullRoute.size} pts  Ã‚Â·  ${animSpeed.toInt()} km/h",
                                color = Color.LightGray, fontSize = 12.sp)
                            LinearProgressIndicator(
                                progress = { if (fullRoute.isEmpty()) 0f else (animIdx + 1f) / fullRoute.size },
                                modifier = Modifier.fillMaxWidth().height(6.dp),
                                color = Color(0xFF00C853),
                                trackColor = Color(0xFF333333)
                            )
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                if (animRunning) {
                                    OutlinedButton(
                                        onClick = { animRunning = false },
                                        modifier = Modifier.weight(1f),
                                        colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.Red)
                                    ) { Text(if (isSpanish) "Detener" else "Stop") }
                                } else {
                                    Button(
                                        onClick = { routeState = RouteState.FINISHED },
                                        modifier = Modifier.fillMaxWidth(),
                                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFF6F00))
                                    ) { Text(if (isSpanish) "Volver" else "Back", color = Color.Black, fontWeight = FontWeight.Bold) }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}


