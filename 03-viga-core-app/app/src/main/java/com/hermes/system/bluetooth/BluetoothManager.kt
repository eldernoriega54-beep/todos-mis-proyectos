package com.hermes.system.bluetooth

import android.annotation.SuppressLint
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothManager as AndroidBluetoothManager
import android.bluetooth.BluetoothSocket
import android.content.Context
import com.hermes.system.mqtt.AlertType
import com.hermes.system.mqtt.TelemetryData
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import java.io.InputStream
import java.io.OutputStream
import java.util.UUID

class BluetoothManager(private val context: Context) {

    private val bluetoothAdapter: BluetoothAdapter? =
        (context.getSystemService(Context.BLUETOOTH_SERVICE) as AndroidBluetoothManager).adapter

    private val _isDeviceConnected = MutableStateFlow(false)
    val isDeviceConnected: StateFlow<Boolean> = _isDeviceConnected

    private val _telemetry = MutableStateFlow<TelemetryData?>(null)
    val telemetry: StateFlow<TelemetryData?> = _telemetry

    // Canal para el Terminal Serial (envía los logs crudos)
    private val _rawLogs = kotlinx.coroutines.flow.MutableSharedFlow<String>(extraBufferCapacity = 100)
    val rawLogs: kotlinx.coroutines.flow.SharedFlow<String> = _rawLogs

    private val _alert = MutableStateFlow<AlertType?>(null)
    val alert: StateFlow<AlertType?> = _alert

    private var socket: BluetoothSocket? = null
    private var inputStream: InputStream? = null
    private var outputStream: OutputStream? = null

    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private var readJob: Job? = null

    // UUID estándar para RFCOMM / Serial Port Profile (SPP)
    private val MY_UUID: UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB")
    private val DEVICE_NAME = "CASCO_HERMES_001"
    private val json = Json { ignoreUnknownKeys = true }

    @SuppressLint("MissingPermission")
    fun connect() {
        if (bluetoothAdapter == null || !bluetoothAdapter.isEnabled) return
        
        scope.launch {
            while (!_isDeviceConnected.value) {
                try {
                    val pairedDevices: Set<BluetoothDevice>? = bluetoothAdapter.bondedDevices
                    val vigaDevice = pairedDevices?.find { it.name == DEVICE_NAME }

                    if (vigaDevice != null) {
                        try {
                            socket = vigaDevice.createRfcommSocketToServiceRecord(MY_UUID)
                            socket?.connect()
                        } catch (e: Exception) {
                            // Fallback for Android ESP32 pairing bugs
                            val method = vigaDevice.javaClass.getMethod("createInsecureRfcommSocket", Int::class.java)
                            socket = method.invoke(vigaDevice, 1) as BluetoothSocket
                            socket?.connect()
                        }
                        inputStream = socket?.inputStream
                        outputStream = socket?.outputStream
                        
                        _isDeviceConnected.value = true
                        startReading()
                        sendAGPS() // A-GPS: enviar ubicación del celular al ESP32
                        break
                    }
                } catch (e: Exception) {
                    socket?.close()
                    _isDeviceConnected.value = false
                }
                delay(1000) // Reintentar agresivamente cada segundo
            }
        }
    }

    private fun startReading() {
        readJob = scope.launch {
            val buffer = ByteArray(1024)
            var messageBuilder = StringBuilder()
            
            while (isActive && _isDeviceConnected.value) {
                try {
                    val bytes = inputStream?.read(buffer) ?: -1
                    if (bytes > 0) {
                        val chunk = String(buffer, 0, bytes)
                        messageBuilder.append(chunk)
                        _rawLogs.tryEmit(chunk)
                        
                        var newLineIndex = messageBuilder.indexOf("\n")
                        while (newLineIndex != -1) {
                            val fullMessage = messageBuilder.substring(0, newLineIndex).trim()
                            messageBuilder.delete(0, newLineIndex + 1)
                            handleMessage(fullMessage)
                            newLineIndex = messageBuilder.indexOf("\n")
                        }
                    }
                } catch (e: Exception) {
                    _isDeviceConnected.value = false
                    connect() // Reconectar al perder conexión
                    break
                }
            }
        }
    }

    private fun handleMessage(payload: String) {
        if (payload.isEmpty() || !payload.startsWith("{")) return
        try {
            val jsonObj = json.parseToJsonElement(payload).jsonObject
            if (jsonObj.containsKey("alert")) {
                val typeStr = jsonObj["alert"]?.jsonPrimitive?.content ?: return
                val alertType = when (typeStr.lowercase()) {
                    "severe" -> AlertType.SEVERE
                    "medium" -> AlertType.MEDIUM
                    "light" -> AlertType.LIGHT
                    else -> return
                }
                _alert.value = alertType
            } else if (jsonObj.containsKey("speed")) {
                val speed = jsonObj["speed"]?.jsonPrimitive?.content?.toFloatOrNull() ?: 0f
                val maxSpeed = jsonObj["maxSpeed"]?.jsonPrimitive?.content?.toFloatOrNull() ?: 0f
                val ax = jsonObj["ax"]?.jsonPrimitive?.content?.toFloatOrNull() ?: 0f
                val ay = jsonObj["ay"]?.jsonPrimitive?.content?.toFloatOrNull() ?: 0f
                val az = jsonObj["az"]?.jsonPrimitive?.content?.toFloatOrNull() ?: 0f
                val magnitude = jsonObj["magnitude"]?.jsonPrimitive?.content?.toFloatOrNull() ?: 0f
                val lat = jsonObj["lat"]?.jsonPrimitive?.content?.toFloatOrNull() ?: 0f
                val lon = jsonObj["lon"]?.jsonPrimitive?.content?.toFloatOrNull() ?: 0f
                
                _telemetry.value = TelemetryData(speed, maxSpeed, ax, ay, az, magnitude, lat, lon)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    @SuppressLint("MissingPermission")
    private fun sendAGPS() {
        scope.launch {
            try {
                val locationManager = context.getSystemService(android.content.Context.LOCATION_SERVICE) as android.location.LocationManager
                val location = locationManager.getLastKnownLocation(android.location.LocationManager.GPS_PROVIDER)
                    ?: locationManager.getLastKnownLocation(android.location.LocationManager.NETWORK_PROVIDER)
                if (location != null) {
                    val agpsJson = "{\"agps\":{\"lat\":${location.latitude},\"lon\":${location.longitude},\"time\":${System.currentTimeMillis()}}}\n"
                    outputStream?.write(agpsJson.toByteArray())
                    android.util.Log.d("HermesSystem", "A-GPS enviado: lat=${location.latitude} lon=${location.longitude}")
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun sendCommand(cmd: String) {
        scope.launch {
            try {
                outputStream?.write("{\"cmd\":\"$cmd\"}\n".toByteArray())
            } catch (e: Exception) { e.printStackTrace() }
        }
    }

    fun clearAlert() {
        _alert.value = null
        try {
            outputStream?.write("CANCEL\n".toByteArray())
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}

