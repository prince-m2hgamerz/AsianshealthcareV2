package com.medsolution.admin.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.medsolution.admin.data.model.NotificationItem
import com.medsolution.admin.data.repository.AdminRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class NotificationsUiState(
    val notifications: List<NotificationItem> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val currentPage: Int = 1,
    val hasMore: Boolean = false,
    val unreadCount: Int = 0
)

@HiltViewModel
class NotificationsViewModel @Inject constructor(
    private val repository: AdminRepository
) : ViewModel() {

    private val _state = MutableStateFlow(NotificationsUiState())
    val state: StateFlow<NotificationsUiState> = _state.asStateFlow()

    init {
        loadNotifications()
    }

    fun loadNotifications() {
        _state.value = _state.value.copy(isLoading = true, error = null, currentPage = 1)
        viewModelScope.launch {
            repository.getNotifications().fold(
                onSuccess = { response ->
                    _state.value = _state.value.copy(
                        notifications = response.data,
                        isLoading = false,
                        hasMore = response.hasMore,
                        unreadCount = response.data.count { !it.isRead }
                    )
                },
                onFailure = { e ->
                    _state.value = _state.value.copy(
                        isLoading = false,
                        error = e.message ?: "Failed to load notifications"
                    )
                }
            )
        }
    }

    fun markAsRead(id: Int) {
        viewModelScope.launch {
            repository.markNotificationRead(id)
            loadNotifications()
        }
    }

    fun markAllRead() {
        viewModelScope.launch {
            repository.markAllNotificationsRead()
            loadNotifications()
        }
    }
}
