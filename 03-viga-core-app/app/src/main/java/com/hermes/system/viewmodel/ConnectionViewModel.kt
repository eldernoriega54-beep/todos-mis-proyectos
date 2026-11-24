package com.hermes.system.viewmodel

import android.Manifest
import android.annotation.SuppressLint
import android.app.Application
import android.content.Context
import android.content.pm.PackageManager
import android.net.wifi.ScanResult
import android.net.wifi.WifiManager
import androidx.core.content.ContextCompat
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.hermes.system.mqtt.AlertType
import com.hermes.system.mqtt.MedicalPayload
import com.hermes.system.bluetooth.BluetoothManager
import com.hermes.system.mqtt.TelemetryData
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class WifiNetwork(
    val ssid: String,
    val level: Int,        // dBm
    val isSecured: Boolean
)

class ConnectionViewModel(application: Application) : AndroidViewModel(application) {

    val bluetoothManager = BluetoothManager(application)
    private val wifiManager = application.getSystemService(Context.WIFI_SERVICE) as WifiManager

    // Estado de conexión Bluetooth
    val isConnected: StateFlow<Boolean> = bluetoothManager.isDeviceConnected
    val telemetry: StateFlow<TelemetryData?> = bluetoothManager.telemetry
    val alert: StateFlow<AlertType?> = bluetoothManager.alert
    
    // Terminal Raw Logs
    val rawLogs = bluetoothManager.rawLogs

    fun sendCustomCommand(cmd: String) {
        if (!cmd.endsWith("\n")) {
            bluetoothManager.sendCommand(cmd + "\n")
        } else {
            bluetoothManager.sendCommand(cmd)
        }
    }

    // Escaneo Wi-Fi
    private val _scanResults = MutableStateFlow<List<WifiNetwork>>(emptyList())
    val scanResults: StateFlow<List<WifiNetwork>> = _scanResults

    private val _isScanning = MutableStateFlow(false)
    val isScanning: StateFlow<Boolean> = _isScanning

    // Estado de provisioning
    private val _provisioningStatus = MutableStateFlow<String?>(null)
    val provisioningStatus: StateFlow<String?> = _provisioningStatus

    init {
        // Cada vez que llega telemetría real, se guarda externamente en DataStore desde MainActivity
    }

    fun startConnection(deviceId: String) {
        // deviceId is no longer used for MQTT topic, we just connect to paired Bluetooth
        bluetoothManager.connect()
    }

    private fun sendAGPSData() {
        try {
            val locationManager = getApplication<Application>().getSystemService(Context.LOCATION_SERVICE) as android.location.LocationManager
            val location = locationManager.getLastKnownLocation(android.location.LocationManager.GPS_PROVIDER)
                ?: locationManager.getLastKnownLocation(android.location.LocationManager.NETWORK_PROVIDER)
            
            if (location != null) {
                // Ya no usamos MQTT para el AGPS en este modo Bluetooth básico
            }
        } catch (e: SecurityException) {
            // Permisos no concedidos
        }
    }


    @SuppressLint("MissingPermission")
    fun scanWifi(context: Context) {
        val hasPermission = ContextCompat.checkSelfPermission(
            context, Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED

        if (!hasPermission) return

        viewModelScope.launch(Dispatchers.IO) {
            _isScanning.value = true
            wifiManager.startScan()
            delay(2000)
            val results = wifiManager.scanResults
                .filter { it.SSID.isNotBlank() }
                .distinctBy { it.SSID }
                .sortedByDescending { it.level }
                .map { scan ->
                    WifiNetwork(
                        ssid = scan.SSID,
                        level = scan.level,
                        isSecured = scan.capabilities.contains("WPA") ||
                                    scan.capabilities.contains("WEP")
                    )
                }
            _scanResults.value = results
            _isScanning.value = false
        }
    }

    /**
     * Envía las credenciales de Wi-Fi al ESP32 vía HTTP POST.
     * Requiere que el celular esté conectado a la red HermesSystem-AP (192.168.4.1).
     */
    fun provisionDevice(ssid: String, password: String) {
        viewModelScope.launch(Dispatchers.IO) {
            _provisioningStatus.value = "sending"
            try {
                val url = java.net.URL("http://192.168.4.1/wifi")
                val body = "ssid=$ssid&password=$password"
                val conn = url.openConnection() as java.net.HttpURLConnection
                conn.apply {
                    requestMethod = "POST"
                    doOutput = true
                    connectTimeout = 5000
                    readTimeout = 5000
                    setRequestProperty("Content-Type", "application/x-www-form-urlencoded")
                    outputStream.write(body.toByteArray())
                }
                val code = conn.responseCode
                _provisioningStatus.value = if (code == 200) "success" else "error"
                conn.disconnect()
            } catch (e: Exception) {
                _provisioningStatus.value = "error"
            }
        }
    }

    fun clearProvisioningStatus() { _provisioningStatus.value = null }

    fun publishMedical(name: String, age: String, weight: String, bloodType: String, allergies: String) {
        // En Bluetooth Clásico no estamos enviando el perfil médico a la placa por ahora
    }

    fun clearAlert() { bluetoothManager.clearAlert() }

    fun sendResetCommand() { bluetoothManager.sendCommand("reset") }
    fun startRoute()       { bluetoothManager.sendCommand("start") }
    fun stopRoute()        { bluetoothManager.sendCommand("stop")  }

    override fun onCleared() {
        super.onCleared()
    }
}

