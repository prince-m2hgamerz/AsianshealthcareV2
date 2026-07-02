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

data class LoginUiState(
    val email: String = "",
    val password: String = "",
    val isLoading: Boolean = false,
    val error: String? = null,
    val isSuccess: Boolean = false
)

@HiltViewModel
class LoginViewModel @Inject constructor(
    private val repository: AdminRepository,
    private val tokenManager: TokenManager
) : ViewModel() {

    private val _state = MutableStateFlow(LoginUiState())
    val state: StateFlow<LoginUiState> = _state.asStateFlow()

    fun onEmailChanged(email: String) {
        _state.value = _state.value.copy(email = email, error = null)
    }

    fun onPasswordChanged(password: String) {
        _state.value = _state.value.copy(password = password, error = null)
    }

    fun login() {
        val current = _state.value
        if (current.email.isBlank() || current.password.isBlank()) {
            _state.value = current.copy(error = "Please fill in all fields")
            return
        }

        _state.value = current.copy(isLoading = true, error = null)

        viewModelScope.launch {
            val result = repository.login(current.email, current.password)
            result.fold(
                onSuccess = { response ->
                    if (response.error != null) {
                        _state.value = _state.value.copy(
                            isLoading = false,
                            error = response.error
                        )
                        return@launch
                    }
                    response.token?.let { token ->
                        tokenManager.saveToken(token)
                    }
                    _state.value = _state.value.copy(isLoading = false, isSuccess = true)
                },
                onFailure = { e ->
                    _state.value = _state.value.copy(
                        isLoading = false,
                        error = e.message ?: "Login failed"
                    )
                }
            )
        }
    }
}
