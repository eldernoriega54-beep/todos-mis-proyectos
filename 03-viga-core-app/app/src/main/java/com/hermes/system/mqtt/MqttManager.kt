package com.hermes.system.mqtt

import android.content.Context
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import org.eclipse.paho.client.mqttv3.*
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence

@Serializable
data class TelemetryData(
    val speed: Float = 0f,
    val maxSpeed: Float = 0f,
    val ax: Float = 0f,
    val ay: Float = 0f,
    val az: Float = 0f,
    val magnitude: Float = 0f,
    val lat: Float = 0f,
    val lon: Float = 0f
)

@Serializable
data class MedicalPayload(
    val name: String,
    val age: String,
    val weight: String,
    val bloodType: String,
    val allergies: String
)

enum class AlertType { LIGHT, MEDIUM, SEVERE }

class MqttManager(private val context: Context) {

    private val brokerUri = "tcp://broker.emqx.io:1883"
    private var client: MqttAsyncClient? = null
    private var deviceId: String = "hermessystem001"
    private val json = Json { ignoreUnknownKeys = true }

    // Conexión del teléfono al broker (HiveMQ)
    private val _isConnectedToBroker = MutableStateFlow(false)
    
    // Conectado = el teléfono llegó al broker MQTT. Los mensajes del casco fluyen solos.
    private val _isDeviceConnected = MutableStateFlow(false)
    val isDeviceConnected: StateFlow<Boolean> = _isDeviceConnected

    private val _telemetry = MutableStateFlow<TelemetryData?>(null)
    val telemetry: StateFlow<TelemetryData?> = _telemetry

    /** Null = sin alerta activa. Emite AlertType cuando llega un golpe del ESP32. */
    private val _alert = MutableStateFlow<AlertType?>(null)
    val alert: StateFlow<AlertType?> = _alert

    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())

    fun setDeviceId(id: String) { deviceId = id }

    fun connect() {
        scope.launch {
            try {
                val clientId = "VigaApp-${System.currentTimeMillis()}"
                client = MqttAsyncClient(brokerUri, clientId, MemoryPersistence())

                val options = MqttConnectOptions().apply {
                    isAutomaticReconnect = true
                    isCleanSession = true
                    connectionTimeout = 15
                    keepAliveInterval = 30
                }

                client?.setCallback(object : MqttCallbackExtended {
                    override fun connectComplete(reconnect: Boolean, serverURI: String?) {
                        _isConnectedToBroker.value = true
                        _isDeviceConnected.value = true
                        subscribeToTopics()
                    }
                    override fun connectionLost(cause: Throwable?) {
                        _isConnectedToBroker.value = false
                        _isDeviceConnected.value = false
                    }
                    override fun messageArrived(topic: String?, message: MqttMessage?) {
                        val payload = message?.toString() ?: return
                        when {
                            topic?.endsWith("handshake") == true -> {
                                if (payload == "ESP32_ONLINE") {
                                    _isDeviceConnected.value = true
                                }
                            }
                            topic?.endsWith("telemetry") == true -> handleTelemetry(payload)
                            topic?.endsWith("alert") == true     -> {
                                if (message.isRetained) return
                                handleAlert(payload)
                            }
                            topic?.endsWith("status") == true    -> handleStatus(payload)
                        }
                    }
                    override fun deliveryComplete(token: IMqttDeliveryToken?) {}
                })

                client?.connect(options, null, object : IMqttActionListener {
                    override fun onSuccess(asyncActionToken: IMqttToken?) {
                        _isConnectedToBroker.value = true
                        subscribeToTopics()
                        // Enviar Handshake PING apenas me conecto al broker
                        client?.publish("hermessystem/$deviceId/handshake", "APP_ONLINE".toByteArray(), 1, false)
                    }
                    override fun onFailure(asyncActionToken: IMqttToken?, exception: Throwable?) {
                        _isConnectedToBroker.value = false
                        _isDeviceConnected.value = false
                    }
                })

            } catch (e: Exception) {
                _isConnectedToBroker.value = false
                _isDeviceConnected.value = false
            }
        }
    }

    private fun subscribeToTopics() {
        try {
            client?.subscribe("hermessystem/$deviceId/handshake", 1)
            client?.subscribe("hermessystem/$deviceId/telemetry", 1)
            client?.subscribe("hermessystem/$deviceId/alert", 1)
            client?.subscribe("hermessystem/$deviceId/status", 1)
        } catch (_: Exception) {}
    }

    private fun handleTelemetry(payload: String) {
        try {
            _telemetry.value = json.decodeFromString<TelemetryData>(payload)
            _isDeviceConnected.value = true // Si llega telemetría, la placa está viva
        } catch (_: Exception) {}
    }

    private fun handleAlert(payload: String) {
        val type = when {
            payload.contains("severe", true) -> AlertType.SEVERE
            payload.contains("medium", true) -> AlertType.MEDIUM
            else -> AlertType.LIGHT
        }
        _alert.value = type
    }

    private fun handleStatus(payload: String) {
        _isDeviceConnected.value = payload.lowercase() == "online"
    }

    fun clearAlert() { 
        _alert.value = null 
        // Borrar retained alert del broker
        try {
            client?.publish("hermessystem/$deviceId/alert", ByteArray(0), 1, true)
        } catch (_: Exception) {}
        // Decirle al ESP32 que el usuario canceló â†’ desbloquear nuevas alertas
        scope.launch {
            try {
                client?.publish("hermessystem/$deviceId/command", "CANCEL".toByteArray(), 1, false)
            } catch (_: Exception) {}
        }
    }

    fun publishMedicalData(medical: MedicalPayload) {
        scope.launch {
            try {
                val payload = json.encodeToString(MedicalPayload.serializer(), medical)
                val msg = MqttMessage(payload.toByteArray()).apply {
                    qos = 1
                    isRetained = true
                }
                client?.publish("hermessystem/$deviceId/medical", msg)
            } catch (_: Exception) {}
        }
    }

    fun publishAGPS(lat: Double, lon: Double) {
        scope.launch {
            try {
                val payload = "{\"lat\":$lat, \"lon\":$lon}"
                client?.publish("hermessystem/$deviceId/agps", payload.toByteArray(), 1, true)
            } catch (_: Exception) {}
        }
    }

    fun sendResetCommand() {
        scope.launch {
            try {
                client?.publish("hermessystem/$deviceId/command", "RESET".toByteArray(), 1, false)
            } catch (_: Exception) {}
        }
    }

    fun disconnect() {
        scope.launch {
            try { client?.disconnect() } catch (_: Exception) {}
            _isConnectedToBroker.value = false
            _isDeviceConnected.value = false
        }
    }

    fun cleanup() {
        scope.cancel()
        try { client?.disconnectForcibly() } catch (_: Exception) {}
    }
}

