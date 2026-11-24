package com.example.atri

import android.Manifest
import android.content.Intent
import android.media.MediaPlayer
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.Image
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.core.app.ActivityCompat
import com.example.atri.ui.main.MainScreen
import com.example.atri.theme.ATRITheme
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Pedir TODOS los permisos necesarios al iniciar
        val permissions = mutableListOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION,
            Manifest.permission.VIBRATE
        )
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            permissions.add(Manifest.permission.POST_NOTIFICATIONS)
        }
        ActivityCompat.requestPermissions(this, permissions.toTypedArray(), 101)

        // Iniciar el receptor de alertas por WiFi / Hotspot
        AlertTcpServer.start(applicationContext)

        setContent {
            val context = LocalContext.current
            val settingsManager = remember { SettingsManager(context) }
            val themeMode by settingsManager.themeModeFlow.collectAsState(initial = "system")

            val darkTheme = when (themeMode) {
                "dark"  -> true
                "light" -> false
                else    -> isSystemInDarkTheme()
            }

            ATRITheme(darkTheme = darkTheme) {
                AppContent(settingsManager)
            }
        }
    }
}

@Composable
fun AppContent(settingsManager: SettingsManager) {
    val context    = LocalContext.current
    val scope      = rememberCoroutineScope()
    var selectedVoice  by remember { mutableStateOf<String?>(null) }
    var showVoiceDialog by remember { mutableStateOf(false) }
    var showSplash  by remember { mutableStateOf(true) }
    var currentScreen by remember { mutableStateOf("main") }

    LaunchedEffect(Unit) {
        val saved = settingsManager.selectedVoiceFlow.first()
        delay(1800)
        showSplash = false
        if (saved.isEmpty()) showVoiceDialog = true
        else selectedVoice = saved
    }

    if (showSplash) { SplashScreen(); return }

    if (showVoiceDialog) {
        VoiceSelectionDialog {
            scope.launch {
                settingsManager.saveSelectedVoice(it)
                selectedVoice = it
                showVoiceDialog = false
            }
        }
        return
    }

    if (selectedVoice != null) {
        when (currentScreen) {
            "main"     -> MainScreen(onNavigateToSettings = { currentScreen = "settings" })
            "settings" -> SettingsScreen(
                settingsManager = settingsManager,
                onBack = { currentScreen = "main" },
                onChangeVoice = { showVoiceDialog = true }
            )
        }
    }
}

@Composable
fun SplashScreen() {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Image(
                painter = painterResource(id = R.drawable.ic_logo),
                contentDescription = "Logo A.T.R.I.",
                modifier = Modifier.size(130.dp)
            )
            Spacer(Modifier.height(20.dp))
            Text("A.T.R.I.", style = MaterialTheme.typography.headlineLarge)
            Spacer(Modifier.height(6.dp))
            Text(
                "Alerta Temprana por Riesgo de Inundación",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f)
            )
        }
    }
}

@Composable
fun VoiceSelectionDialog(onVoiceSelected: (String) -> Unit) {
    var selected by remember { mutableStateOf("voz1") }
    val context  = LocalContext.current
    var mp by remember { mutableStateOf<MediaPlayer?>(null) }
    DisposableEffect(Unit) { onDispose { mp?.release() } }

    AlertDialog(
        onDismissRequest = {},
        title = { Text("Elige tu voz de alerta") },
        text = {
            Column {
                Text("Escucha la previa y selecciona tu preferida.")
                Spacer(Modifier.height(16.dp))
                listOf("voz1" to "Voz 1", "voz2" to "Voz 2").forEach { (key, label) ->
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        RadioButton(selected = selected == key, onClick = { selected = key })
                        Text(label, modifier = Modifier.weight(1f))
                        TextButton(onClick = {
                            mp?.release()
                            mp = MediaPlayer.create(context, if (key == "voz1") R.raw.voz1 else R.raw.voz2)
                            mp?.start()
                        }) { Text("Escuchar") }
                    }
                }
            }
        },
        confirmButton = {
            Button(onClick = { mp?.release(); onVoiceSelected(selected) }) {
                Text("Guardar")
            }
        }
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    settingsManager: SettingsManager,
    onBack: () -> Unit,
    onChangeVoice: () -> Unit
) {
    val context = LocalContext.current
    val scope   = rememberCoroutineScope()
    val themeMode by settingsManager.themeModeFlow.collectAsState(initial = "system")

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Configuración") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(
                            painter = painterResource(android.R.drawable.ic_menu_revert),
                            contentDescription = "Regresar"
                        )
                    }
                }
            )
        }
    ) { pad ->
        Column(
            modifier = Modifier
                .padding(pad)
                .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(24.dp)
        ) {

            // — Tema —
            Text("Tema de la aplicación", style = MaterialTheme.typography.titleMedium)
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf(
                    "system" to "Sistema",
                    "light"  to "Claro",
                    "dark"   to "Oscuro"
                ).forEach { (key, label) ->
                    FilterChip(
                        selected = themeMode == key,
                        onClick  = { scope.launch { settingsManager.saveThemeMode(key) } },
                        label    = { Text(label) }
                    )
                }
            }

            HorizontalDivider()

            // — Voz —
            Text("Voz de alerta", style = MaterialTheme.typography.titleMedium)
            OutlinedButton(onClick = onChangeVoice, modifier = Modifier.fillMaxWidth()) {
                Text("Cambiar voz de alerta")
            }

            HorizontalDivider()

            // — Permisos —
            Text("Permisos del sistema", style = MaterialTheme.typography.titleMedium)
            Text(
                "Aquí puedes revisar y activar los permisos de la aplicación desde los ajustes de tu teléfono.",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f)
            )
            Button(
                onClick = {
                    context.startActivity(
                        Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
                            data = Uri.fromParts("package", context.packageName, null)
                        }
                    )
                },
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(
                    painter = painterResource(android.R.drawable.ic_menu_manage),
                    contentDescription = null,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(Modifier.width(8.dp))
                Text("Administrar permisos")
            }
        }
    }
}