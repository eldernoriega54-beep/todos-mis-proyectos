package com.example.tls.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

enum class ThemeMode {
    SYSTEM, LIGHT, DARK
}

private val DarkColorScheme = darkColorScheme(
    primary = TlsDarkOrange,
    onPrimary = Color.Black,
    primaryContainer = TlsDarkCard,
    onPrimaryContainer = TlsDarkBeigeText,
    secondary = TlsDarkBeigeMuted,
    onSecondary = Color.Black,
    background = TlsDarkBg,
    onBackground = TlsDarkBeigeText,
    surface = TlsDarkSurface,
    onSurface = TlsDarkBeigeText,
    surfaceVariant = TlsDarkCard,
    onSurfaceVariant = TlsDarkBeigeMuted,
    outline = TlsDarkBorder,
    outlineVariant = Color(0xFF4A3428)
)

private val LightColorScheme = lightColorScheme(
    primary = TlsLightOrange,
    onPrimary = Color.White,
    primaryContainer = TlsLightCard,
    onPrimaryContainer = TlsLightText,
    secondary = TlsLightMuted,
    onSecondary = Color.White,
    background = TlsLightBg,
    onBackground = TlsLightText,
    surface = TlsLightSurface,
    onSurface = TlsLightText,
    surfaceVariant = TlsLightCard,
    onSurfaceVariant = TlsLightMuted,
    outline = TlsLightBorder,
    outlineVariant = Color(0xFFC7B19C)
)

@Composable
fun TLSTheme(
    themeMode: ThemeMode = ThemeMode.SYSTEM,
    content: @Composable () -> Unit
) {
    val darkTheme = when (themeMode) {
        ThemeMode.SYSTEM -> isSystemInDarkTheme()
        ThemeMode.LIGHT -> false
        ThemeMode.DARK -> true
    }

    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
