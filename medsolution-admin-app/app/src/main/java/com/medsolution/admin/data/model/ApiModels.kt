package com.medsolution.admin.data.model

import com.google.gson.annotations.SerializedName

data class LoginRequest(
    @SerializedName("email") val email: String,
    @SerializedName("password") val password: String
)

data class LoginResponse(
    @SerializedName("token") val token: String? = null,
    @SerializedName("error") val error: String? = null,
    @SerializedName("message") val message: String? = null
)

data class User(
    @SerializedName("id") val id: Int = 0,
    @SerializedName("name") val name: String? = null,
    @SerializedName("email") val email: String? = null,
    @SerializedName("role") val role: String? = null,
    @SerializedName("avatar_url") val avatarUrl: String? = null
)

data class DashboardStats(
    @SerializedName("total_leads") val totalLeads: Int = 0,
    @SerializedName("new_leads_today") val newLeadsToday: Int = 0,
    @SerializedName("total_subscribers") val totalSubscribers: Int = 0,
    @SerializedName("total_doctors") val totalDoctors: Int = 0,
    @SerializedName("total_hospitals") val totalHospitals: Int = 0,
    @SerializedName("total_emails_sent") val totalEmailsSent: Int = 0,
    @SerializedName("leads_this_month") val leadsThisMonth: Int = 0,
    @SerializedName("leads_last_month") val leadsLastMonth: Int = 0
)

data class PipelineStage(
    @SerializedName("stage") val stage: String? = null,
    @SerializedName("count") val count: Int = 0
)

data class RecentLead(
    @SerializedName("id") val id: Int = 0,
    @SerializedName("name") val name: String? = null,
    @SerializedName("email") val email: String? = null,
    @SerializedName("phone") val phone: String? = null,
    @SerializedName("source") val source: String? = null,
    @SerializedName("condition") val condition: String? = null,
    @SerializedName("stage") val stage: String? = null,
    @SerializedName("created_at") val createdAt: String? = null,
    @SerializedName("doctor_name") val doctorName: String? = null,
    @SerializedName("hospital_name") val hospitalName: String? = null
)

data class DashboardResponse(
    @SerializedName("stats") val stats: DashboardStats? = null,
    @SerializedName("pipeline") val pipeline: List<PipelineStage>? = null,
    @SerializedName("recent_leads") val recentLeads: List<RecentLead>? = null,
    @SerializedName("leads_by_month") val leadsByMonth: Any? = null
)

data class Lead(
    @SerializedName("id") val id: Int = 0,
    @SerializedName("name") val name: String? = null,
    @SerializedName("email") val email: String? = null,
    @SerializedName("phone") val phone: String? = null,
    @SerializedName("source") val source: String? = null,
    @SerializedName("condition") val condition: String? = null,
    @SerializedName("stage") val stage: String? = null,
    @SerializedName("priority") val priority: String? = null,
    @SerializedName("notes") val notes: String? = null,
    @SerializedName("doctor_id") val doctorId: Int? = null,
    @SerializedName("hospital_id") val hospitalId: Int? = null,
    @SerializedName("created_at") val createdAt: String? = null,
    @SerializedName("updated_at") val updatedAt: String? = null,
    @SerializedName("doctor_name") val doctorName: String? = null,
    @SerializedName("hospital_name") val hospitalName: String? = null
)

data class LeadUpdateRequest(
    @SerializedName("stage") val stage: String? = null,
    @SerializedName("priority") val priority: String? = null,
    @SerializedName("notes") val notes: String? = null,
    @SerializedName("doctor_id") val doctorId: Int? = null,
    @SerializedName("hospital_id") val hospitalId: Int? = null
)

data class Email(
    @SerializedName("id") val id: Int = 0,
    @SerializedName("to") val to: String? = null,
    @SerializedName("subject") val subject: String? = null,
    @SerializedName("body") val body: String? = null,
    @SerializedName("status") val status: String? = null,
    @SerializedName("type") val type: String? = null,
    @SerializedName("created_at") val createdAt: String? = null,
    @SerializedName("lead_name") val leadName: String? = null,
    @SerializedName("recipient_count") val recipientCount: Int? = null,
    @SerializedName("sent_at") val sentAt: String? = null
)

data class Subscriber(
    @SerializedName("id") val id: Int = 0,
    @SerializedName("email") val email: String? = null,
    @SerializedName("name") val name: String? = null,
    @SerializedName("is_active") val isActive: Boolean = true,
    @SerializedName("created_at") val createdAt: String? = null
)

data class NotificationItem(
    @SerializedName("id") val id: Int = 0,
    @SerializedName("title") val title: String? = null,
    @SerializedName("body") val body: String? = null,
    @SerializedName("type") val type: String? = null,
    @SerializedName("data") val data: String? = null,
    @SerializedName("is_read") val isRead: Boolean = false,
    @SerializedName("created_at") val createdAt: String? = null
)

data class Doctor(
    @SerializedName("id") val id: Int = 0,
    @SerializedName("name") val name: String? = null,
    @SerializedName("email") val email: String? = null,
    @SerializedName("specialty") val specialty: String? = null
)

data class Hospital(
    @SerializedName("id") val id: Int = 0,
    @SerializedName("name") val name: String? = null,
    @SerializedName("city") val city: String? = null
)

data class SiteSettings(
    @SerializedName("site_name") val siteName: String? = null,
    @SerializedName("site_description") val siteDescription: String? = null,
    @SerializedName("logo_url") val logoUrl: String? = null,
    @SerializedName("favicon_url") val faviconUrl: String? = null,
    @SerializedName("primary_color") val primaryColor: String? = null,
    @SerializedName("contact_email") val contactEmail: String? = null,
    @SerializedName("contact_phone") val contactPhone: String? = null
)

data class PaginatedResponse<T>(
    @SerializedName("data") val data: List<T> = emptyList(),
    @SerializedName("total") val total: Int = 0,
    @SerializedName("page") val page: Int = 1,
    @SerializedName("per_page") val perPage: Int = 20,
    @SerializedName("has_more") val hasMore: Boolean = false,
    @SerializedName("cursor") val cursor: String? = null
)

data class FCMTokenRequest(
    @SerializedName("token") val token: String,
    @SerializedName("device_type") val deviceType: String = "android"
)

data class FCMTestRequest(
    @SerializedName("title") val title: String,
    @SerializedName("body") val body: String,
    @SerializedName("type") val type: String
)

data class SendEmailRequest(
    @SerializedName("to") val to: String,
    @SerializedName("subject") val subject: String,
    @SerializedName("body") val body: String
)

data class ApiResponse(
    @SerializedName("success") val success: Boolean = false,
    @SerializedName("message") val message: String? = null,
    @SerializedName("error") val error: String? = null
)

data class SettingsUpdateRequest(
    @SerializedName("site_name") val siteName: String? = null,
    @SerializedName("site_description") val siteDescription: String? = null,
    @SerializedName("contact_email") val contactEmail: String? = null,
    @SerializedName("contact_phone") val contactPhone: String? = null
)
