package com.hermes.system.data

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "viga_settings")

data class UserSettings(
    val language: String = "",
    val isLanguageSelected: Boolean = false,
    val isTermsAccepted: Boolean = false,
    val fullName: String = "",
    val age: String = "",
    val weight: String = "",
    val bloodType: String = "",
    val allergies: String = "",
    val emergencyContacts: String = "",       // números separados por comas
    val contactsEnabled: String = "",         // "true,false,true" por cada contacto
    val emergencyServiceEnabled: Boolean = true, // Llamada a servicios de emergencia 911
    val isMedicalDataComplete: Boolean = false,
    val isSetupComplete: Boolean = false,
    val isDarkMode: Boolean = true,
    val deviceId: String = "hermessystem001",
    val deviceName: String = "",
    val savedNetworkSsid: String = "",
    val isMedicalSent: Boolean = false,
    val lastSpeed: String = "---",
    val lastMaxSpeed: String = "---",
    val lastBatteryPercent: String = "---",
    val lastBatteryHealth: String = "---"
)

class UserPreferencesRepository(private val dataStore: DataStore<Preferences>) {

    companion object {
        val LANGUAGE = stringPreferencesKey("language")
        val IS_LANGUAGE_SELECTED = booleanPreferencesKey("is_language_selected")
        val IS_TERMS_ACCEPTED = booleanPreferencesKey("is_terms_accepted")
        val FULL_NAME = stringPreferencesKey("full_name")
        val AGE = stringPreferencesKey("age")
        val WEIGHT = stringPreferencesKey("weight")
        val BLOOD_TYPE = stringPreferencesKey("blood_type")
        val ALLERGIES = stringPreferencesKey("allergies")
        val EMERGENCY_CONTACTS = stringPreferencesKey("emergency_contacts")
        val CONTACTS_ENABLED = stringPreferencesKey("contacts_enabled")
        val EMERGENCY_SERVICE_ENABLED = booleanPreferencesKey("emergency_service_enabled")
        val IS_MEDICAL_DATA_COMPLETE = booleanPreferencesKey("is_medical_data_complete")
        val IS_SETUP_COMPLETE = booleanPreferencesKey("is_setup_complete")
        val IS_DARK_MODE = booleanPreferencesKey("is_dark_mode")
        val DEVICE_ID = stringPreferencesKey("device_id")
        val DEVICE_NAME = stringPreferencesKey("device_name")
        val SAVED_NETWORK_SSID = stringPreferencesKey("saved_network_ssid")
        val IS_MEDICAL_SENT = booleanPreferencesKey("is_medical_sent")
        val LAST_SPEED = stringPreferencesKey("last_speed")
        val LAST_MAX_SPEED = stringPreferencesKey("last_max_speed")
        val LAST_BATTERY_PERCENT = stringPreferencesKey("last_battery_percent")
        val LAST_BATTERY_HEALTH = stringPreferencesKey("last_battery_health")
    }

    val userSettingsFlow: Flow<UserSettings> = dataStore.data.map { prefs ->
        UserSettings(
            language = prefs[LANGUAGE] ?: "",
            isLanguageSelected = prefs[IS_LANGUAGE_SELECTED] ?: false,
            isTermsAccepted = prefs[IS_TERMS_ACCEPTED] ?: false,
            fullName = prefs[FULL_NAME] ?: "",
            age = prefs[AGE] ?: "",
            weight = prefs[WEIGHT] ?: "",
            bloodType = prefs[BLOOD_TYPE] ?: "",
            allergies = prefs[ALLERGIES] ?: "",
            emergencyContacts = prefs[EMERGENCY_CONTACTS] ?: "",
            contactsEnabled = prefs[CONTACTS_ENABLED] ?: "",
            emergencyServiceEnabled = prefs[EMERGENCY_SERVICE_ENABLED] ?: true,
            isMedicalDataComplete = prefs[IS_MEDICAL_DATA_COMPLETE] ?: false,
            isSetupComplete = prefs[IS_SETUP_COMPLETE] ?: false,
            isDarkMode = prefs[IS_DARK_MODE] ?: true,
            deviceId = prefs[DEVICE_ID] ?: "hermessystem001",
            deviceName = prefs[DEVICE_NAME] ?: "",
            savedNetworkSsid = prefs[SAVED_NETWORK_SSID] ?: "",
            isMedicalSent = prefs[IS_MEDICAL_SENT] ?: false,
            lastSpeed = prefs[LAST_SPEED] ?: "---",
            lastMaxSpeed = prefs[LAST_MAX_SPEED] ?: "---",
            lastBatteryPercent = prefs[LAST_BATTERY_PERCENT] ?: "---",
            lastBatteryHealth = prefs[LAST_BATTERY_HEALTH] ?: "---"
        )
    }

    suspend fun saveLanguage(language: String) {
        dataStore.edit { prefs ->
            prefs[LANGUAGE] = language
            prefs[IS_LANGUAGE_SELECTED] = true
        }
    }

    suspend fun acceptTerms() {
        dataStore.edit { prefs -> prefs[IS_TERMS_ACCEPTED] = true }
    }

    suspend fun saveMedicalData(name: String, age: String, weight: String, bloodType: String, allergies: String, emergencyContacts: String) {
        dataStore.edit { prefs ->
            prefs[FULL_NAME] = name
            prefs[AGE] = age
            prefs[WEIGHT] = weight
            prefs[BLOOD_TYPE] = bloodType
            prefs[ALLERGIES] = allergies
            prefs[EMERGENCY_CONTACTS] = emergencyContacts
            prefs[IS_MEDICAL_DATA_COMPLETE] = true
            // Al editar, resetear bandera de enviado para reenviar al dispositivo
            prefs[IS_MEDICAL_SENT] = false
        }
    }

    suspend fun completeSetup() {
        dataStore.edit { prefs -> prefs[IS_SETUP_COMPLETE] = true }
    }

    suspend fun setDarkMode(isDarkMode: Boolean) {
        dataStore.edit { prefs -> prefs[IS_DARK_MODE] = isDarkMode }
    }

    suspend fun saveDeviceConfig(deviceId: String, deviceName: String) {
        dataStore.edit { prefs ->
            prefs[DEVICE_ID] = deviceId
            prefs[DEVICE_NAME] = deviceName
        }
    }

    suspend fun saveNetworkSsid(ssid: String) {
        dataStore.edit { prefs -> prefs[SAVED_NETWORK_SSID] = ssid }
    }

    suspend fun markMedicalSent() {
        dataStore.edit { prefs -> prefs[IS_MEDICAL_SENT] = true }
    }

    suspend fun forgetDevice() {
        dataStore.edit { prefs ->
            prefs[DEVICE_NAME] = ""
            prefs[SAVED_NETWORK_SSID] = ""
            prefs[IS_MEDICAL_SENT] = false
        }
    }

    suspend fun cacheTelemetry(speed: String, maxSpeed: String, batteryPercent: String, batteryHealth: String) {
        dataStore.edit { prefs ->
            prefs[LAST_SPEED] = speed
            prefs[LAST_MAX_SPEED] = maxSpeed
            prefs[LAST_BATTERY_PERCENT] = batteryPercent
            prefs[LAST_BATTERY_HEALTH] = batteryHealth
        }
    }

    suspend fun setEmergencyServiceEnabled(enabled: Boolean) {
        dataStore.edit { prefs -> prefs[EMERGENCY_SERVICE_ENABLED] = enabled }
    }

    suspend fun saveContactsEnabled(enabled: String) {
        dataStore.edit { prefs -> prefs[CONTACTS_ENABLED] = enabled }
    }
}

