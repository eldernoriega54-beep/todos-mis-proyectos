package com.example.atri

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.RingtoneManager
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat

class AlertReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val level = intent.getIntExtra("alert_level", 0)
        createNotificationChannels(context)

        when (level) {
            1 -> showAlert(
                context,
                id        = 1,
                channel   = "ATRI_GREEN",
                title     = "Alerta Verde — A.T.R.I.",
                message   = "Tu zona está en alerta verde por riesgo de inundación.",
                bigText   = "Tu zona está en alerta verde por riesgo de inundación. Mantente atento y sigue las actualizaciones del sistema.",
                vibration = longArrayOf(0, 600, 300, 600, 300, 600)
            )
            2 -> showAlert(
                context,
                id        = 2,
                channel   = "ATRI_YELLOW",
                title     = "Alerta Amarilla — A.T.R.I.",
                message   = "Precaución: riesgo moderado de inundación en tu zona.",
                bigText   = "Tu zona está en alerta amarilla. Ten mucha precaución, prepárate para evacuar y mantente atento a las próximas alertas.",
                vibration = longArrayOf(0, 800, 200, 800, 200, 800, 200, 1200)
            )
            3 -> {
                val fullScreenIntent = Intent(context, RedAlertActivity::class.java).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                }
                val pi = PendingIntent.getActivity(
                    context, 0, fullScreenIntent,
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )
                val builder = NotificationCompat.Builder(context, "ATRI_RED")
                    .setSmallIcon(android.R.drawable.ic_dialog_alert)
                    .setContentTitle("ALERTA ROJA — EVACUACIÓN INMEDIATA")
                    .setContentText("Peligro inminente de inundación. Evacúe ahora.")
                    .setPriority(NotificationCompat.PRIORITY_MAX)
                    .setCategory(NotificationCompat.CATEGORY_ALARM)
                    .setFullScreenIntent(pi, true)
                    .setVibrate(longArrayOf(0, 1000, 300, 1000, 300, 1000))
                    .setOngoing(true)
                    .setAutoCancel(false)
                    .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                try {
                    NotificationManagerCompat.from(context).notify(3, builder.build())
                } catch (e: SecurityException) { e.printStackTrace() }
            }
        }
    }

    private fun showAlert(
        context: Context,
        id: Int,
        channel: String,
        title: String,
        message: String,
        bigText: String,
        vibration: LongArray
    ) {
        // Vibrar manualmente además de la notificación
        vibrateDevice(context, vibration)

        val builder = NotificationCompat.Builder(context, channel)
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setContentTitle(title)
            .setContentText(message)
            .setStyle(NotificationCompat.BigTextStyle().bigText(bigText))
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setVibrate(vibration)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setAutoCancel(true)

        try {
            NotificationManagerCompat.from(context).notify(id, builder.build())
        } catch (e: SecurityException) { e.printStackTrace() }
    }

    @Suppress("DEPRECATION")
    private fun vibrateDevice(context: Context, pattern: LongArray) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val vm = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
            vm.defaultVibrator.vibrate(VibrationEffect.createWaveform(pattern, -1))
        } else {
            val v = context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                v.vibrate(VibrationEffect.createWaveform(pattern, -1))
            } else {
                v.vibrate(pattern, -1)
            }
        }
    }

    private fun createNotificationChannels(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            val alarmSound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
            val audioAttr = AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_ALARM)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .build()

            // Canal Verde
            NotificationChannel("ATRI_GREEN", "Alerta Verde ATRI", NotificationManager.IMPORTANCE_HIGH).also {
                it.description = "Notificaciones de alerta nivel verde"
                it.enableVibration(true)
                it.vibrationPattern = longArrayOf(0, 600, 300, 600)
                it.setSound(alarmSound, audioAttr)
                it.setBypassDnd(true)
                it.lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
                nm.createNotificationChannel(it)
            }
            // Canal Amarillo
            NotificationChannel("ATRI_YELLOW", "Alerta Amarilla ATRI", NotificationManager.IMPORTANCE_HIGH).also {
                it.description = "Notificaciones de alerta nivel amarillo"
                it.enableVibration(true)
                it.vibrationPattern = longArrayOf(0, 800, 200, 800)
                it.setSound(alarmSound, audioAttr)
                it.setBypassDnd(true)
                it.lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
                nm.createNotificationChannel(it)
            }
            // Canal Rojo
            NotificationChannel("ATRI_RED", "Alerta Roja ATRI", NotificationManager.IMPORTANCE_HIGH).also {
                it.description = "Canal de máxima urgencia - Alerta Roja"
                it.enableVibration(true)
                it.vibrationPattern = longArrayOf(0, 1000, 300, 1000)
                it.setSound(alarmSound, audioAttr)
                it.setBypassDnd(true)
                it.lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
                nm.createNotificationChannel(it)
            }
        }
    }
}
