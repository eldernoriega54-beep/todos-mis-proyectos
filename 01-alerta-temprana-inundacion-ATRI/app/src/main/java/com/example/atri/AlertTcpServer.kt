package com.example.atri

import android.content.Context
import android.content.Intent
import android.util.Log
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.ServerSocket
import java.net.Socket
import kotlin.concurrent.thread

/**
 * Servicio en segundo plano que escucha por WiFi / Hotspot en el puerto 5000.
 * La laptop le manda directamente el nivel de alerta sin necesidad de cable USB.
 */
object AlertTcpServer {
    private const val TAG = "AlertTcpServer"
    private const val PORT = 5000
    private var isRunning = false
    private var serverSocket: ServerSocket? = null

    fun start(context: Context) {
        if (isRunning) return
        isRunning = true

        thread(name = "ATRI_TCP_Listener", isDaemon = true) {
            try {
                serverSocket = ServerSocket(PORT)
                Log.d(TAG, "Servidor TCP ATRI iniciado en puerto $PORT")

                while (isRunning) {
                    try {
                        val client: Socket = serverSocket?.accept() ?: break
                        handleClient(context, client)
                    } catch (e: Exception) {
                        if (!isRunning) break
                        Log.e(TAG, "Error aceptando conexion: ${e.message}")
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error iniciando ServerSocket: ${e.message}")
            }
        }
    }

    private fun handleClient(context: Context, socket: Socket) {
        thread(isDaemon = true) {
            try {
                val reader = BufferedReader(InputStreamReader(socket.getInputStream()))
                val line = reader.readLine()?.trim() // Recibe "ALERT:1", "ALERT:2" o "ALERT:3"
                Log.d(TAG, "Mensaje recibido por WiFi: $line")

                if (line != null && line.startsWith("ALERT:")) {
                    val level = line.removePrefix("ALERT:").toIntOrNull() ?: 0
                    dispararAlerta(context, level)
                }
                socket.close()
            } catch (e: Exception) {
                Log.e(TAG, "Error en lectura de cliente TCP: ${e.message}")
            }
        }
    }

    private fun dispararAlerta(context: Context, level: Int) {
        if (level == 3) {
            // ALERTA ROJA: Pantalla completa, alarma y voz
            val intent = Intent(context, RedAlertActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            }
            context.startActivity(intent)
        } else if (level == 1 || level == 2) {
            // ALERTAS VERDE Y AMARILLA: Notificación Push con vibración
            val intent = Intent(context, AlertReceiver::class.java).apply {
                action = "com.example.atri.ACTION_ALERT"
                putExtra("alert_level", level)
            }
            context.sendBroadcast(intent)
        }
    }

    fun stop() {
        isRunning = false
        try {
            serverSocket?.close()
        } catch (_: Exception) {}
        serverSocket = null
    }
}
