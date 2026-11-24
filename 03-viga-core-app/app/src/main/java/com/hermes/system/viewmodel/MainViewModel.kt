package com.hermes.system.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.hermes.system.data.UserPreferencesRepository
import com.hermes.system.data.UserSettings
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class MainViewModel(private val repository: UserPreferencesRepository) : ViewModel() {

    val userSettings: StateFlow<UserSettings> = repository.userSettingsFlow.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = UserSettings()
    )

    fun saveLanguage(language: String) = viewModelScope.launch { repository.saveLanguage(language) }
    fun acceptTerms() = viewModelScope.launch { repository.acceptTerms() }
    fun completeSetup() = viewModelScope.launch { repository.completeSetup() }
    fun setDarkMode(isDark: Boolean) = viewModelScope.launch { repository.setDarkMode(isDark) }
    fun forgetDevice() = viewModelScope.launch { repository.forgetDevice() }
    fun saveNetworkSsid(ssid: String) = viewModelScope.launch { repository.saveNetworkSsid(ssid) }
    fun markMedicalSent() = viewModelScope.launch { repository.markMedicalSent() }
    fun saveDeviceConfig(deviceId: String, deviceName: String) =
        viewModelScope.launch { repository.saveDeviceConfig(deviceId, deviceName) }

    fun saveMedicalData(name: String, age: String, weight: String, bloodType: String, allergies: String, emergencyContacts: String, contactsEnabled: String, emergencyServiceEnabled: Boolean) {
        viewModelScope.launch {
            repository.saveMedicalData(name, age, weight, bloodType, allergies, emergencyContacts)
            repository.saveContactsEnabled(contactsEnabled)
            repository.setEmergencyServiceEnabled(emergencyServiceEnabled)
        }
    }

    fun cacheTelemetry(speed: String, maxSpeed: String, battery: String, health: String) {
        viewModelScope.launch { repository.cacheTelemetry(speed, maxSpeed, battery, health) }
    }
}

class MainViewModelFactory(private val repository: UserPreferencesRepository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(MainViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return MainViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}

