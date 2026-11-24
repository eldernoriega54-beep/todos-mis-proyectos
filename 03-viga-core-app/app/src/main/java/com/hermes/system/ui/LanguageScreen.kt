package com.hermes.system.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class LanguageOption(val code: String, val flag: String, val label: String)

val supportedLanguages = listOf(
    LanguageOption("es", "🇪🇸", "Español"),
    LanguageOption("en", "🇺🇸", "English"),
    LanguageOption("fr", "🇫🇷", "Français"),
    LanguageOption("pt", "🇧🇷", "Português"),
    LanguageOption("de", "🇩🇪", "Deutsch"),
    LanguageOption("it", "🇮🇹", "Italiano"),
    LanguageOption("zh", "🇨🇳", "中文"),
    LanguageOption("ar", "🇸🇦", "العربية")
)

@Composable
fun LanguageScreen(onLanguageSelected: (String) -> Unit) {
    Surface(
        modifier = Modifier.fillMaxSize(),
        color = Color(0xFF121212)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(64.dp))

            Text(
                text = "HERMES-V1",
                color = Color(0xFF00E5FF),
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 4.sp
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Select your language / Selecciona tu idioma",
                color = Color.Gray,
                fontSize = 14.sp
            )

            Spacer(modifier = Modifier.height(40.dp))

            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(supportedLanguages.size) { idx ->
                    val lang = supportedLanguages[idx]
                    LanguageCard(lang = lang, onClick = { onLanguageSelected(lang.code) })
                }
            }
        }
    }
}

@Composable
private fun LanguageCard(lang: LanguageOption, onClick: () -> Unit) {
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(14.dp),
        color = Color(0xFF1E1E1E),
        modifier = Modifier
            .fillMaxWidth()
            .height(64.dp)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 20.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text(text = lang.flag, fontSize = 28.sp)
            Text(
                text = lang.label,
                color = Color.White,
                fontSize = 18.sp,
                fontWeight = FontWeight.SemiBold
            )
        }
    }
}

