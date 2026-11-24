package com.example.atri

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "atri_settings")

class SettingsManager(private val context: Context) {
    companion object {
        val SELECTED_VOICE = stringPreferencesKey("selected_voice")
        val THEME_MODE = stringPreferencesKey("theme_mode")
    }

    val selectedVoiceFlow: Flow<String> = context.dataStore.data
        .map { it[SELECTED_VOICE] ?: "" }

    val themeModeFlow: Flow<String> = context.dataStore.data
        .map { it[THEME_MODE] ?: "system" }

    suspend fun saveSelectedVoice(voice: String) {
        context.dataStore.edit { it[SELECTED_VOICE] = voice }
    }

    suspend fun saveThemeMode(mode: String) {
        context.dataStore.edit { it[THEME_MODE] = mode }
    }
}
