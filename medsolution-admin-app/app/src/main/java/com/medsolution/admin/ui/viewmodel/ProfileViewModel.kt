package com.medsolution.admin.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.medsolution.admin.data.model.User
import com.medsolution.admin.data.repository.AdminRepository
import com.medsolution.admin.data.repository.TokenManager
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class ProfileUiState(
    val user: User? = null,
    val isLoading: Boolean = true,
    val error: String? = null
)

@HiltViewModel
class ProfileViewModel @Inject constructor(
    private val repository: AdminRepository,
    private val tokenManager: TokenManager
) : ViewModel() {

    private val _state = MutableStateFlow(ProfileUiState())
    val state: StateFlow<ProfileUiState> = _state.asStateFlow()

    init {
        loadProfile()
    }

    private fun loadProfile() {
        viewModelScope.launch {
            val cached = tokenManager.getUser()
            if (cached != null) {
                _state.value = ProfileUiState(isLoading = false, user = cached)
            }
            repository.getCurrentUser().fold(
                onSuccess = { user ->
                    tokenManager.saveUser(user)
                    _state.value = ProfileUiState(isLoading = false, user = user)
                },
                onFailure = { e ->
                    if (cached == null) {
                        _state.value = ProfileUiState(
                            isLoading = false,
                            error = e.message ?: "Failed to load profile"
                        )
                    }
                }
            )
        }
    }

    fun logout() {
        viewModelScope.launch {
            tokenManager.clearAll()
        }
    }
}
