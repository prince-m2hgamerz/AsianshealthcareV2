package com.medsolution.admin.data.repository

import com.medsolution.admin.data.api.AdminApiService
import com.medsolution.admin.data.model.*
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AdminRepository @Inject constructor(
    private val api: AdminApiService,
    private val tokenManager: TokenManager
) {
    suspend fun login(email: String, password: String): Result<LoginResponse> {
        return apiCall { api.login(LoginRequest(email, password)) }
    }

    suspend fun getCurrentUser(): Result<User> {
        return apiCall { api.getCurrentUser() }
    }

    suspend fun getDashboard(): Result<DashboardResponse> {
        return apiCall { api.getDashboard() }
    }

    suspend fun getLeads(
        page: Int = 1,
        perPage: Int = 20,
        search: String? = null,
        stage: String? = null,
        source: String? = null
    ): Result<PaginatedResponse<Lead>> {
        return apiCall { api.getLeads(page, perPage, search, stage, source) }
    }

    suspend fun getLead(id: Int): Result<Lead> {
        return apiCall { api.getLead(id) }
    }

    suspend fun updateLead(id: Int, request: LeadUpdateRequest): Result<ApiResponse> {
        return apiCall { api.updateLead(id, request) }
    }

    suspend fun deleteLead(id: Int): Result<ApiResponse> {
        return apiCall { api.deleteLead(id) }
    }

    suspend fun getEmails(
        cursor: String? = null,
        perPage: Int = 20,
        search: String? = null,
        type: String? = null
    ): Result<PaginatedResponse<Email>> {
        return apiCall { api.getEmails(cursor, perPage, search, type) }
    }

    suspend fun deleteEmail(id: Int): Result<ApiResponse> {
        return apiCall { api.deleteEmail(id) }
    }

    suspend fun sendEmail(request: SendEmailRequest): Result<ApiResponse> {
        return apiCall { api.sendEmail(request) }
    }

    suspend fun getSubscribers(
        page: Int = 1,
        perPage: Int = 20,
        search: String? = null
    ): Result<PaginatedResponse<Subscriber>> {
        return apiCall { api.getSubscribers(page, perPage, search) }
    }

    suspend fun deleteSubscriber(id: Int): Result<ApiResponse> {
        return apiCall { api.deleteSubscriber(id) }
    }

    suspend fun getNotifications(page: Int = 1, perPage: Int = 20): Result<PaginatedResponse<NotificationItem>> {
        return apiCall { api.getNotifications(page, perPage) }
    }

    suspend fun markNotificationRead(id: Int): Result<ApiResponse> {
        return apiCall { api.markNotificationRead(id) }
    }

    suspend fun markAllNotificationsRead(): Result<ApiResponse> {
        return apiCall { api.markAllNotificationsRead() }
    }

    suspend fun getDoctors(search: String? = null): Result<List<Doctor>> {
        return apiCall { api.getDoctors(search) }
    }

    suspend fun getHospitals(search: String? = null): Result<List<Hospital>> {
        return apiCall { api.getHospitals(search) }
    }

    suspend fun getSettings(): Result<SiteSettings> {
        return apiCall { api.getSettings() }
    }

    suspend fun updateSettings(request: SettingsUpdateRequest): Result<ApiResponse> {
        return apiCall { api.updateSettings(request) }
    }

    suspend fun sendFCMTest(request: FCMTestRequest): Result<ApiResponse> {
        return apiCall { api.sendFCMTest(request) }
    }

    suspend fun saveFCMToken(token: String): Result<ApiResponse> {
        return apiCall { api.saveFCMToken(FCMTokenRequest(token)) }
    }

    private suspend fun <T> apiCall(call: suspend () -> retrofit2.Response<T>): Result<T> {
        return try {
            val response = call()
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null) {
                    Result.success(body)
                } else {
                    Result.failure(Exception("Empty response body"))
                }
            } else {
                val errorBody = response.errorBody()?.string()
                val message = when (response.code()) {
                    401 -> "Session expired. Please login again."
                    in 400..499 -> errorBody ?: "Request failed (${response.code()})"
                    else -> "Server error (${response.code()})"
                }
                if (response.code() == 401) {
                    tokenManager.clearToken()
                }
                Result.failure(Exception(message))
            }
        } catch (e: Exception) {
            Result.failure(Exception("Network error: ${e.localizedMessage ?: "Unknown error"}"))
        }
    }
}
