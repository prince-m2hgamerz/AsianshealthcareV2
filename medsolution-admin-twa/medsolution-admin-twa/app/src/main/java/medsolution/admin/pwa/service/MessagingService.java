package medsolution.admin.pwa.service;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.util.Log;

import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import org.json.JSONObject;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import medsolution.admin.pwa.service.NotificationHelper;

public class MessagingService extends FirebaseMessagingService {

    private static final String TAG = "MessagingService";
    private static final String REGISTER_URL = "https://asianshealthcare.com/api/admin/push/fcm/register";

    @Override
    public void onNewToken(String token) {
        Log.d(TAG, "FCM Token: " + token);
        registerTokenWithServer(token);
    }

    private void registerTokenWithServer(String token) {
        new Thread(() -> {
            try {
                JSONObject payload = new JSONObject();
                payload.put("token", token);
                payload.put("os_version", "Android " + Build.VERSION.RELEASE);
                payload.put("device_model", Build.MANUFACTURER + " " + Build.MODEL);

                URL url = new URL(REGISTER_URL);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);
                conn.setConnectTimeout(10000);
                conn.setReadTimeout(10000);

                try (OutputStream os = conn.getOutputStream()) {
                    byte[] input = payload.toString().getBytes(StandardCharsets.UTF_8);
                    os.write(input, 0, input.length);
                }

                int code = conn.getResponseCode();
                Log.d(TAG, "Token registration response: " + code);
                conn.disconnect();
            } catch (Exception e) {
                Log.e(TAG, "Failed to register FCM token", e);
            }
        }).start();
    }

    @Override
    public void onMessageReceived(RemoteMessage message) {
        NotificationHelper.createNotificationChannel(this);

        String title;
        String body;
        String url = "";

        if (message.getNotification() != null) {
            title = message.getNotification().getTitle() != null
                ? message.getNotification().getTitle() : "MedSolution Admin";
            body = message.getNotification().getBody() != null
                ? message.getNotification().getBody() : "";
        } else {
            title = "MedSolution Admin";
            body = "";
        }

        Map<String, String> data = message.getData();
        if (data != null) {
            if (data.containsKey("title")) title = data.get("title");
            if (data.containsKey("body")) body = data.get("body");
            if (data.containsKey("url")) url = data.get("url");
        }

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU ||
            ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                == PackageManager.PERMISSION_GRANTED) {
            NotificationHelper.showNotification(this, title, body, url);
        }
    }
}
