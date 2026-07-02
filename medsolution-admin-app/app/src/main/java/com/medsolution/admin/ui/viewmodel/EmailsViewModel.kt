package com.medsolution.admin.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.medsolution.admin.data.model.Email
import com.medsolution.admin.data.model.SendEmailRequest
import com.medsolution.admin.data.repository.AdminRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class EmailsUiState(
    val emails: List<Email> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val searchQuery: String = "",
    val selectedType: String? = null,
    val cursor: String? = null,
    val hasMore: Boolean = false,
    val isLoadingMore: Boolean = false
)

@HiltViewModel
class EmailsViewModel @Inject constructor(
    private val repository: AdminRepository
) : ViewModel() {

    private val _state = MutableStateFlow(EmailsUiState())
    val state: StateFlow<EmailsUiState> = _state.asStateFlow()

    init {
        loadEmails()
    }

    fun loadEmails() {
        _state.value = _state.value.copy(isLoading = true, error = null, cursor = null)
        viewModelScope.launch {
            val result = repository.getEmails(
                search = _state.value.searchQuery.takeIf { it.isNotBlank() },
                type = _state.value.selectedType
            )
            result.fold(
                onSuccess = { response ->
                    _state.value = _state.value.copy(
                        emails = response.data,
                        isLoading = false,
                        cursor = response.cursor,
                        hasMore = response.hasMore
                    )
                },
                onFailure = { e ->
                    _state.value = _state.value.copy(
                        isLoading = false,
                        error = e.message ?: "Failed to load emails"
                    )
                }
            )
        }
    }

    fun loadMore() {
        if (_state.value.isLoadingMore || !_state.value.hasMore || _state.value.cursor == null) return
        _state.value = _state.value.copy(isLoadingMore = true)
        viewModelScope.launch {
            val result = repository.getEmails(
                cursor = _state.value.cursor,
                search = _state.value.searchQuery.takeIf { it.isNotBlank() },
                type = _state.value.selectedType
            )
            result.fold(
                onSuccess = { response ->
                    _state.value = _state.value.copy(
                        emails = _state.value.emails + response.data,
                        isLoadingMore = false,
                        cursor = response.cursor,
                        hasMore = response.hasMore
                    )
                },
                onFailure = { _state.value = _state.value.copy(isLoadingMore = false) }
            )
        }
    }

    fun onSearchQueryChanged(query: String) {
        _state.value = _state.value.copy(searchQuery = query)
        loadEmails()
    }

    fun deleteEmail(id: Int) {
        viewModelScope.launch {
            repository.deleteEmail(id)
            loadEmails()
        }
    }
}
