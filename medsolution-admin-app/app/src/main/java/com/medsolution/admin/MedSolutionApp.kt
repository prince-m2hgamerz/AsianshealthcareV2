package com.medsolution.admin

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import androidx.hilt.work.HiltWorkerFactory
import androidx.work.Configuration
import dagger.hilt.android.HiltAndroidApp
import javax.inject.Inject

@HiltAndroidApp
class MedSolutionApp : Application(), Configuration.Provider {

    @Inject lateinit var workerFactory: HiltWorkerFactory

    override val workManagerConfiguration: Configuration
        get() = Configuration.Builder()
            .setWorkerFactory(workerFactory)
            .setMinimumLoggingLevel(android.util.Log.INFO)
            .build()

    override fun onCreate() {
        super.onCreate()
        createNotificationChannels()
    }

    private fun createNotificationChannels() {
        val manager = getSystemService(NotificationManager::class.java)

        val adminChannel = NotificationChannel(
            NOTIFICATION_CHANNEL_ADMIN,
            "Admin Alerts",
            NotificationManager.IMPORTANCE_HIGH
        ).apply {
            description = "Administrative notifications and alerts"
            enableVibration(true)
            enableLights(true)
            setShowBadge(true)
        }

        val promoChannel = NotificationChannel(
            NOTIFICATION_CHANNEL_PROMO,
            "Promotions",
            NotificationManager.IMPORTANCE_DEFAULT
        ).apply {
            description = "Marketing and promotional notifications"
            setShowBadge(false)
        }

        manager.createNotificationChannel(adminChannel)
        manager.createNotificationChannel(promoChannel)
    }

    companion object {
        const val NOTIFICATION_CHANNEL_ADMIN = "admin_alerts"
        const val NOTIFICATION_CHANNEL_PROMO = "promotions"
    }
}
