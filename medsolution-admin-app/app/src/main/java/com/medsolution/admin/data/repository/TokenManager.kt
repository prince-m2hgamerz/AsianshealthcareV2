package com.medsolution.admin.data.repository

import android.content.Context
import android.content.SharedPreferences
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class TokenManager @Inject constructor(
    @ApplicationContext context: Context
) {
    private val prefs: SharedPreferences by lazy {
        val masterKey = MasterKey.Builder(context)
            .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
            .build()
        EncryptedSharedPreferences.create(
            context,
            "auth_prefs",
            masterKey,
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
        )
    }

    private val _isLoggedIn = MutableStateFlow(getToken() != null)
    val isLoggedIn: StateFlow<Boolean> = _isLoggedIn.asStateFlow()

    suspend fun saveToken(token: String) {
        prefs.edit().putString(KEY_TOKEN, token).apply()
        _isLoggedIn.value = true
    }

    fun getToken(): String? {
        return prefs.getString(KEY_TOKEN, null)
    }

    suspend fun clearToken() {
        prefs.edit().remove(KEY_TOKEN).apply()
        _isLoggedIn.value = false
    }

    suspend fun saveUser(user: com.medsolution.admin.data.model.User) {
        prefs.edit()
            .putInt(KEY_USER_ID, user.id)
            .putString(KEY_USER_NAME, user.name)
            .putString(KEY_USER_EMAIL, user.email)
            .putString(KEY_USER_ROLE, user.role)
            .putString(KEY_USER_AVATAR, user.avatarUrl)
            .apply()
    }

    suspend fun getUser(): com.medsolution.admin.data.model.User? {
        val id = prefs.getInt(KEY_USER_ID, -1)
        if (id == -1) return null
        return com.medsolution.admin.data.model.User(
            id = id,
            name = prefs.getString(KEY_USER_NAME, null),
            email = prefs.getString(KEY_USER_EMAIL, null),
            role = prefs.getString(KEY_USER_ROLE, null),
            avatarUrl = prefs.getString(KEY_USER_AVATAR, null)
        )
    }

    suspend fun clearAll() {
        prefs.edit().clear().apply()
        _isLoggedIn.value = false
    }

    companion object {
        private const val KEY_TOKEN = "auth_token"
        private const val KEY_USER_ID = "user_id"
        private const val KEY_USER_NAME = "user_name"
        private const val KEY_USER_EMAIL = "user_email"
        private const val KEY_USER_ROLE = "user_role"
        private const val KEY_USER_AVATAR = "user_avatar"
    }
}
