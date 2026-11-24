package com.example.tls

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.example.tls.dictionary.DictionaryRepository
import com.example.tls.ui.components.BubbleNavigationBar
import com.example.tls.ui.components.NavigationTab
import com.example.tls.ui.home.HomeScreen
import com.example.tls.ui.onboarding.OnboardingScreen
import com.example.tls.ui.profile.ProfileScreen
import com.example.tls.ui.settings.SettingsScreen
import com.example.tls.ui.splash.SplashScreen
import com.example.tls.ui.theme.TLSTheme
import com.example.tls.ui.theme.ThemeMode
import com.example.tls.ui.translator.TranslatorScreen

enum class AppDestination {
    SPLASH,
    ONBOARDING,
    MAIN_TABS,
    TRANSLATOR,
    CALIBRATION
}

class MainActivity : ComponentActivity() {

    private lateinit var dictionaryRepo: DictionaryRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        dictionaryRepo = DictionaryRepository(applicationContext)

        setContent {
            var themeMode by remember { mutableStateOf(ThemeMode.SYSTEM) }
            var currentDestination by remember { mutableStateOf(AppDestination.SPLASH) }
            var selectedTab by remember { mutableStateOf(NavigationTab.HOME) }

            var userName by remember { mutableStateOf("Elder Noriega") }
            var activeLanguage by remember { mutableStateOf("es-LSM") }

            TLSTheme(themeMode = themeMode) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(MaterialTheme.colorScheme.background)
                ) {
                    AnimatedContent(
                        targetState = currentDestination,
                        transitionSpec = { fadeIn() togetherWith fadeOut() },
                        label = "screenTransition"
                    ) { destination ->
                        when (destination) {
                            AppDestination.SPLASH -> {
                                SplashScreen(
                                    onSplashFinished = {
                                        currentDestination = AppDestination.ONBOARDING
                                    }
                                )
                            }

                            AppDestination.ONBOARDING -> {
                                OnboardingScreen(
                                    dictionaryRepo = dictionaryRepo,
                                    onOnboardingCompleted = { name, lang ->
                                        userName = name
                                        activeLanguage = lang
                                        currentDestination = AppDestination.MAIN_TABS
                                        selectedTab = NavigationTab.HOME
                                    }
                                )
                            }

                            AppDestination.MAIN_TABS -> {
                                Scaffold(
                                    bottomBar = {
                                        BubbleNavigationBar(
                                            selectedTab = selectedTab,
                                            onTabSelected = { selectedTab = it }
                                        )
                                    },
                                    containerColor = MaterialTheme.colorScheme.background
                                ) { paddingValues ->
                                    Box(
                                        modifier = Modifier
                                            .fillMaxSize()
                                            .padding(paddingValues)
                                    ) {
                                        when (selectedTab) {
                                            NavigationTab.PROFILE -> {
                                                ProfileScreen(
                                                    userName = userName,
                                                    onUserNameChange = { userName = it }
                                                )
                                            }

                                            NavigationTab.HOME -> {
                                                HomeScreen(
                                                    userName = userName,
                                                    activeLanguage = activeLanguage,
                                                    onOpenTranslator = {
                                                        currentDestination = AppDestination.TRANSLATOR
                                                    },
                                                    onOpenCalibration = {
                                                        currentDestination = AppDestination.CALIBRATION
                                                    }
                                                )
                                            }

                                            NavigationTab.SETTINGS -> {
                                                SettingsScreen(
                                                    currentThemeMode = themeMode,
                                                    onThemeModeChange = { themeMode = it },
                                                    dictionaryRepo = dictionaryRepo
                                                )
                                            }
                                        }
                                    }
                                }
                            }

                            AppDestination.TRANSLATOR -> {
                                TranslatorScreen(
                                    dictionaryRepo = dictionaryRepo,
                                    onBack = {
                                        currentDestination = AppDestination.MAIN_TABS
                                    }
                                )
                            }

                            AppDestination.CALIBRATION -> {
                                OnboardingScreen(
                                    dictionaryRepo = dictionaryRepo,
                                    onOnboardingCompleted = { _, _ ->
                                        currentDestination = AppDestination.MAIN_TABS
                                    }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
