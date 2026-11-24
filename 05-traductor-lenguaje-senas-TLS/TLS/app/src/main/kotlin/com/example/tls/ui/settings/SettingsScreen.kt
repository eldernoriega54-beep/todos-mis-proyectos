package com.example.tls.ui.settings

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.BrightnessAuto
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.DarkMode
import androidx.compose.material.icons.filled.LightMode
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.tls.dictionary.DictionaryRepository
import com.example.tls.ui.theme.ThemeMode
import com.example.tls.ui.theme.TlsDarkBorder
import com.example.tls.ui.theme.TlsDarkOrange
import com.example.tls.ui.theme.TlsGreenActive

@Composable
fun SettingsScreen(
    currentThemeMode: ThemeMode,
    onThemeModeChange: (ThemeMode) -> Unit,
    dictionaryRepo: DictionaryRepository,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(18.dp)
    ) {
        Text(
            text = "Configuración del Sistema",
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onBackground,
            modifier = Modifier.padding(top = 8.dp)
        )

        // SECCIÓN DE TEMA: MODO SISTEMA, MODO CLARO, MODO OSCURO
        Text(
            text = "TEMA VISUAL (BEIGE & NARANJA)",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = TlsDarkOrange,
            letterSpacing = 1.sp
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            ThemeOptionCard(
                title = "Sistema",
                icon = Icons.Default.BrightnessAuto,
                isSelected = currentThemeMode == ThemeMode.SYSTEM,
                modifier = Modifier.weight(1f),
                onClick = { onThemeModeChange(ThemeMode.SYSTEM) }
            )
            ThemeOptionCard(
                title = "Claro",
                icon = Icons.Default.LightMode,
                isSelected = currentThemeMode == ThemeMode.LIGHT,
                modifier = Modifier.weight(1f),
                onClick = { onThemeModeChange(ThemeMode.LIGHT) }
            )
            ThemeOptionCard(
                title = "Oscuro",
                icon = Icons.Default.DarkMode,
                isSelected = currentThemeMode == ThemeMode.DARK,
                modifier = Modifier.weight(1f),
                onClick = { onThemeModeChange(ThemeMode.DARK) }
            )
        }

        Spacer(modifier = Modifier.height(10.dp))

        // SECCIÓN DE GITHUB Y DICCIONARIOS
        Text(
            text = "REPOSITORIO DE DICCIONARIOS EN GITHUB",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = TlsDarkOrange,
            letterSpacing = 1.sp
        )

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(18.dp))
                .background(MaterialTheme.colorScheme.surfaceVariant)
                .border(1.5.dp, MaterialTheme.colorScheme.outlineVariant, RoundedCornerShape(18.dp))
                .padding(16.dp)
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = "GitHub: ElderNoriega / tls-dictionaries",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onBackground
                )
                Text(
                    text = "Servidor sincronizado. Contiene SVGs de palmas de manos y metadatos de señas para traducción bidireccional.",
                    fontSize = 12.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }

        Spacer(modifier = Modifier.height(6.dp))

        // INFORMACIÓN DE VERSIÓN
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
                .padding(14.dp)
        ) {
            Column {
                Text("TLS (Traductor de Lenguaje de Señas)", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = MaterialTheme.colorScheme.onBackground)
                Text("Versión Beta 1.0 · Android MediaPipe AI + TTS + STT", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
    }
}

@Composable
private fun ThemeOptionCard(
    title: String,
    icon: ImageVector,
    isSelected: Boolean,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(16.dp))
            .background(if (isSelected) TlsDarkOrange.copy(alpha = 0.2f) else MaterialTheme.colorScheme.surfaceVariant)
            .border(1.5.dp, if (isSelected) TlsDarkOrange else MaterialTheme.colorScheme.outlineVariant, RoundedCornerShape(16.dp))
            .clickable { onClick() }
            .padding(vertical = 14.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = title,
                tint = if (isSelected) TlsDarkOrange else MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.size(26.dp)
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = title,
                fontSize = 12.sp,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                color = if (isSelected) TlsDarkOrange else MaterialTheme.colorScheme.onBackground
            )
        }
    }
}
