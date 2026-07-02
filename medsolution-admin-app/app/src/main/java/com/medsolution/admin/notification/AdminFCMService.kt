package com.medsolution.admin.notification

import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.RingtoneManager
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.medsolution.admin.MainActivity
import com.medsolution.admin.MedSolutionApp
import com.medsolution.admin.R
import com.medsolution.admin.data.repository.AdminRepository
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import javax.inject.Inject

@AndroidEntryPoint
class AdminFCMService : FirebaseMessagingService() {

    @Inject lateinit var adminRepository: AdminRepository

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        CoroutineScope(Dispatchers.IO).launch {
            try {
                adminRepository.saveFCMToken(token)
            } catch (_: Exception) { }
        }
    }

    override fun onMessageReceived(message: RemoteMessage) {
        super.onMessageReceived(message)

        val title = message.notification?.title
            ?: message.data["title"]
            ?: "MedSolution Admin"

        val body = message.notification?.body
            ?: message.data["body"]
            ?: ""

        val type = message.data["type"] ?: "admin"
        val itemId = message.data["id"]?.toIntOrNull()

        showNotification(title, body, type, itemId)
    }

    private fun showNotification(title: String, body: String, type: String, itemId: Int?) {
        val intent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra("notification_type", type)
            if (itemId != null) putExtra("notification_id", itemId)
        }

        val pendingIntentFlags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        } else {
            PendingIntent.FLAG_UPDATE_CURRENT
        }

        val pendingIntent = PendingIntent.getActivity(
            this, 0, intent, pendingIntentFlags
        )

        val channelId = when (type) {
            "promo", "marketing" -> MedSolutionApp.NOTIFICATION_CHANNEL_PROMO
            else -> MedSolutionApp.NOTIFICATION_CHANNEL_ADMIN
        }

        val notification = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(title)
            .setContentText(body)
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION))
            .setContentIntent(pendingIntent)
            .build()

        val notificationId = itemId ?: System.currentTimeMillis().toInt()
        NotificationManagerCompat.from(this).notify(notificationId, notification)
    }
}
