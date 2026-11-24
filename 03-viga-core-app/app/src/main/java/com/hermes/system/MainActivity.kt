package com.hermes.system

import android.os.Bundle
import android.view.WindowManager
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.hermes.system.data.UserPreferencesRepository
import com.hermes.system.data.dataStore
import com.hermes.system.mqtt.AlertType
import com.hermes.system.mqtt.TelemetryData
import com.hermes.system.ui.*
import com.hermes.system.viewmodel.ConnectionViewModel
import com.hermes.system.viewmodel.MainViewModel
import com.hermes.system.viewmodel.MainViewModelFactory

class MainActivity : ComponentActivity() {

    private lateinit var mainViewModel: MainViewModel
    private lateinit var connectionViewModel: ConnectionViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        checkAndRequestBluetoothPermissions(this)
        enableEdgeToEdge()

        // Allow screen to turn on for crash alerts
        window.addFlags(
            WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON or
            WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
            WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
        )

        val repository = UserPreferencesRepository(applicationContext.dataStore)
        mainViewModel = ViewModelProvider(this, MainViewModelFactory(repository))[MainViewModel::class.java]
        connectionViewModel = ViewModelProvider(this)[ConnectionViewModel::class.java]

        setContent {
            HermesApp(mainViewModel, connectionViewModel)
        }
    }
}

@Composable
fun HermesApp(mainViewModel: MainViewModel, connectionViewModel: ConnectionViewModel) {
    val settings by mainViewModel.userSettings.collectAsStateWithLifecycle()
    val isConnected by connectionViewModel.isConnected.collectAsStateWithLifecycle()
    val telemetry by connectionViewModel.telemetry.collectAsStateWithLifecycle()
    val alert by connectionViewModel.alert.collectAsStateWithLifecycle()

    val mainNavController = rememberNavController()
    var splashDone by remember { mutableStateOf(false) }

    // Cache telemetry when connected
    LaunchedEffect(telemetry) {
        telemetry?.let { data ->
            mainViewModel.cacheTelemetry(
                speed = data.speed.toInt().toString(),
                maxSpeed = data.maxSpeed.toInt().toString(),
                battery = "",
                health = ""
            )
        }
    }

    // Start MQTT connection after setup
    LaunchedEffect(settings.isSetupComplete, settings.deviceId) {
        if (settings.isSetupComplete) {
            connectionViewModel.startConnection(settings.deviceId)
        }
    }

    // Publish medical data once after connecting (if not sent yet)
    LaunchedEffect(isConnected, settings.isMedicalSent, settings.isMedicalDataComplete) {
        if (isConnected && !settings.isMedicalSent && settings.isMedicalDataComplete) {
            connectionViewModel.publishMedical(
                name = settings.fullName,
                age = settings.age,
                weight = settings.weight,
                bloodType = settings.bloodType,
                allergies = settings.allergies
            )
            mainViewModel.markMedicalSent()
        }
    }

    val darkColors = darkColorScheme(
        background = androidx.compose.ui.graphics.Color(0xFF121212),
        surface = androidx.compose.ui.graphics.Color(0xFF121212),
        surfaceVariant = androidx.compose.ui.graphics.Color(0xFF1E1E1E),
        onBackground = androidx.compose.ui.graphics.Color.White,
        onSurface = androidx.compose.ui.graphics.Color.White,
        onSurfaceVariant = androidx.compose.ui.graphics.Color(0xFF9E9E9E),
        primary = androidx.compose.ui.graphics.Color(0xFF00E5FF),
        onPrimary = androidx.compose.ui.graphics.Color.Black
    )
    val lightColors = lightColorScheme(
        background = androidx.compose.ui.graphics.Color(0xFFF2F4F7),
        surface = androidx.compose.ui.graphics.Color(0xFFF2F4F7),
        surfaceVariant = androidx.compose.ui.graphics.Color.White,
        onBackground = androidx.compose.ui.graphics.Color(0xFF111111),
        onSurface = androidx.compose.ui.graphics.Color(0xFF111111),
        onSurfaceVariant = androidx.compose.ui.graphics.Color(0xFF555555),
        primary = androidx.compose.ui.graphics.Color(0xFF0088AA),
        onPrimary = androidx.compose.ui.graphics.Color.White
    )

    MaterialTheme(
        colorScheme = if (settings.isDarkMode) darkColors else lightColors
    ) {
        Surface(modifier = Modifier.fillMaxSize()) {

            // ─── Full-screen crash alert (overrides everything) ─────────
            if (alert != null) {
                AlertScreen(
                    alertType = alert!!,
                    settings = settings,
                    telemetry = telemetry,
                    onCancel = { connectionViewModel.clearAlert() }
                )
                return@Surface
            }

            // ─── Main navigation ────────────────────────────────────────
            if (!splashDone) {
                SplashScreen(onSplashFinished = { splashDone = true })
                return@Surface
            }

            val startDest = when {
                !settings.isLanguageSelected  -> "language"
                !settings.isTermsAccepted     -> "terms"
                !settings.isMedicalDataComplete -> "medical"
                !settings.isSetupComplete     -> "welcome"
                else                          -> "main"
            }

            NavHost(navController = mainNavController, startDestination = startDest) {

                composable("language") {
                    LanguageScreen(onLanguageSelected = { lang ->
                        mainViewModel.saveLanguage(lang)
                        mainNavController.navigate("terms") {
                            popUpTo("language") { inclusive = true }
                        }
                    })
                }

                composable("terms") {
                    TermsScreen(
                        language = settings.language,
                        onAccept = {
                            mainViewModel.acceptTerms()
                            mainNavController.navigate("medical") {
                                popUpTo("terms") { inclusive = true }
                            }
                        }
                    )
                }

                composable("medical") {
                    MedicalDataScreen(
                        language = settings.language,
                        initialName = settings.fullName,
                        initialAge = settings.age,
                        initialWeight = settings.weight,
                        initialBlood = settings.bloodType,
                        initialAllergies = settings.allergies,
                        initialContacts = settings.emergencyContacts,
                        initialContactsEnabled = settings.contactsEnabled,
                        initial911Enabled = settings.emergencyServiceEnabled,
                        onSaveCompleted = { name, age, weight, blood, allergies, contacts, states, s911 ->
                            mainViewModel.saveMedicalData(name, age, weight, blood, allergies, contacts, states, s911)
                            mainNavController.navigate("welcome") {
                                popUpTo("medical") { inclusive = true }
                            }
                        }
                    )
                }

                composable("welcome") {
                    WelcomeAnimationScreen(
                        language = settings.language,
                        onFinished = {
                            mainViewModel.completeSetup()
                            mainNavController.navigate("main") {
                                popUpTo("welcome") { inclusive = true }
                            }
                        }
                    )
                }

                composable("main") {
                    val tabNavController = rememberNavController()
                    AppShell(navController = tabNavController, language = settings.language) { padding ->
                        Box(modifier = Modifier.padding(padding)) {
                            NavHost(navController = tabNavController, startDestination = "home") {

                                composable("home") {
                                    DashboardScreen(
                                        isConnected = isConnected,
                                        telemetry = telemetry,
                                        lastSpeed = settings.lastSpeed,
                                        lastMaxSpeed = settings.lastMaxSpeed,
                                        lastBatteryPercent = settings.lastBatteryPercent,
                                        lastBatteryHealth = settings.lastBatteryHealth,
                                        deviceName = settings.deviceName,
                                        onSettingsClick = { tabNavController.navigate("settings") },
                                        onMapClick = { tabNavController.navigate("map") }
                                    )
                                }

                                composable("map") {
                                    MapScreen(
                                        telemetry = telemetry,
                                        language = settings.language,
                                        onBack = { tabNavController.popBackStack() },
                                        onStartRoute = { connectionViewModel.startRoute() },
                                        onStopRoute  = { connectionViewModel.stopRoute()  },
                                        onNavigate   = { tabNavController.navigate("navigate") },
                                        onAiChat     = { tabNavController.navigate("chat") },
                                        onHome       = { tabNavController.navigate("mihogar") }
                                    )
                                }

                                composable("navigate?destLat={destLat}&destLon={destLon}&destName={destName}") { backStackEntry ->
                                    val lat = telemetry?.lat?.toDouble() ?: 0.0
                                    val lon = telemetry?.lon?.toDouble() ?: 0.0
                                    
                                    val destLatStr = backStackEntry.arguments?.getString("destLat")
                                    val destLonStr = backStackEntry.arguments?.getString("destLon")
                                    val destName = backStackEntry.arguments?.getString("destName")
                                    
                                    val destLat = destLatStr?.toDoubleOrNull()
                                    val destLon = destLonStr?.toDoubleOrNull()
                                    
                                    NavigationScreen(
                                        currentLat = lat,
                                        currentLon = lon,
                                        initialDestLat = destLat,
                                        initialDestLon = destLon,
                                        initialDestName = destName,
                                        onBack = { tabNavController.popBackStack() }
                                    )
                                }

                                composable("chat") {
                                    com.hermes.system.ui.AiChatScreen(
                                        onBack = { tabNavController.popBackStack() },
                                        onNavigateTo = { lat, lon, name ->
                                            val encodedName = java.net.URLEncoder.encode(name, "UTF-8")
                                            tabNavController.navigate("navigate?destLat=$lat&destLon=$lon&destName=$encodedName") {
                                                popUpTo("chat") { inclusive = true }
                                            }
                                        }
                                    )
                                }

                                composable("mihogar") {
                                    val lat = telemetry?.lat?.toDouble() ?: 0.0
                                    val lon = telemetry?.lon?.toDouble() ?: 0.0
                                    com.hermes.system.ui.HomeScreen(
                                        currentLat = lat,
                                        currentLon = lon,
                                        onBack = { tabNavController.popBackStack() }
                                    )
                                }

                                composable("terminal") {
                                    com.hermes.system.ui.TerminalScreen(
                                        rawLogsFlow = connectionViewModel.rawLogs,
                                        onSendCommand = { cmd -> connectionViewModel.sendCustomCommand(cmd) },
                                        onBack = { tabNavController.popBackStack() }
                                    )
                                }

                                composable("connect") {
                                    WiFiScanScreen(
                                        connectionViewModel = connectionViewModel,
                                        savedSsid = settings.savedNetworkSsid,
                                        language = settings.language,
                                        onNetworkProvisioned = { ssid ->
                                            mainViewModel.saveNetworkSsid(ssid)
                                            mainViewModel.saveDeviceConfig(settings.deviceId, "HermesSystem Device")
                                            tabNavController.navigate("home")
                                        }
                                    )
                                }

                                composable("settings") {
                                    SettingsScreen(
                                        settings = settings,
                                        language = settings.language,
                                        onBack = { tabNavController.popBackStack() },
                                        onEditMedical = {
                                            mainNavController.navigate("medical")
                                        },
                                        onForgetDevice = {
                                            connectionViewModel.sendResetCommand()
                                            mainViewModel.forgetDevice()
                                        },
                                        onToggleDarkMode = { mainViewModel.setDarkMode(it) },
                                        onTerminal = { tabNavController.navigate("terminal") }
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

