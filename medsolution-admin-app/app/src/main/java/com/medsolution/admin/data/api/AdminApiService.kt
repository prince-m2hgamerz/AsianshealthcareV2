package com.medsolution.admin.data.api

import com.medsolution.admin.data.model.*
import retrofit2.Response
import retrofit2.http.*

interface AdminApiService {

    @POST("api/admin/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    @GET("api/admin/me")
    suspend fun getCurrentUser(): Response<User>

    @GET("api/admin/dashboard")
    suspend fun getDashboard(): Response<DashboardResponse>

    @GET("api/admin/leads")
    suspend fun getLeads(
        @Query("page") page: Int = 1,
        @Query("per_page") perPage: Int = 20,
        @Query("search") search: String? = null,
        @Query("stage") stage: String? = null,
        @Query("source") source: String? = null
    ): Response<PaginatedResponse<Lead>>

    @GET("api/admin/leads/{id}")
    suspend fun getLead(@Path("id") id: Int): Response<Lead>

    @PUT("api/admin/leads/{id}")
    suspend fun updateLead(
        @Path("id") id: Int,
        @Body request: LeadUpdateRequest
    ): Response<ApiResponse>

    @DELETE("api/admin/leads/{id}")
    suspend fun deleteLead(@Path("id") id: Int): Response<ApiResponse>

    @GET("api/admin/emails")
    suspend fun getEmails(
        @Query("cursor") cursor: String? = null,
        @Query("per_page") perPage: Int = 20,
        @Query("search") search: String? = null,
        @Query("type") type: String? = null
    ): Response<PaginatedResponse<Email>>

    @DELETE("api/admin/emails/{id}")
    suspend fun deleteEmail(@Path("id") id: Int): Response<ApiResponse>

    @POST("api/admin/emails/send")
    suspend fun sendEmail(@Body request: SendEmailRequest): Response<ApiResponse>

    @GET("api/admin/subscribers")
    suspend fun getSubscribers(
        @Query("page") page: Int = 1,
        @Query("per_page") perPage: Int = 20,
        @Query("search") search: String? = null
    ): Response<PaginatedResponse<Subscriber>>

    @DELETE("api/admin/subscribers/{id}")
    suspend fun deleteSubscriber(@Path("id") id: Int): Response<ApiResponse>

    @GET("api/admin/notifications")
    suspend fun getNotifications(
        @Query("page") page: Int = 1,
        @Query("per_page") perPage: Int = 20
    ): Response<PaginatedResponse<NotificationItem>>

    @PUT("api/admin/notifications/{id}/read")
    suspend fun markNotificationRead(@Path("id") id: Int): Response<ApiResponse>

    @PUT("api/admin/notifications/read-all")
    suspend fun markAllNotificationsRead(): Response<ApiResponse>

    @GET("api/admin/doctors")
    suspend fun getDoctors(@Query("search") search: String? = null): Response<List<Doctor>>

    @GET("api/admin/hospitals")
    suspend fun getHospitals(@Query("search") search: String? = null): Response<List<Hospital>>

    @GET("api/admin/settings")
    suspend fun getSettings(): Response<SiteSettings>

    @PUT("api/admin/settings")
    suspend fun updateSettings(@Body request: SettingsUpdateRequest): Response<ApiResponse>

    @POST("api/admin/send-fcm")
    suspend fun sendFCMTest(@Body request: FCMTestRequest): Response<ApiResponse>

    @POST("api/admin/save-fcm-token")
    suspend fun saveFCMToken(@Body request: FCMTokenRequest): Response<ApiResponse>
}
