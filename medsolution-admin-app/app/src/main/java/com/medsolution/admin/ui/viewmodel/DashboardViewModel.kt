package com.medsolution.admin.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.medsolution.admin.data.model.DashboardResponse
import com.medsolution.admin.data.repository.AdminRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class DashboardUiState(
    val isLoading: Boolean = true,
    val error: String? = null,
    val data: DashboardResponse? = null
)

@HiltViewModel
class DashboardViewModel @Inject constructor(
    private val repository: AdminRepository
) : ViewModel() {

    private val _state = MutableStateFlow(DashboardUiState())
    val state: StateFlow<DashboardUiState> = _state.asStateFlow()

    init {
        loadDashboard()
    }

    fun loadDashboard() {
        _state.value = DashboardUiState(isLoading = true)
        viewModelScope.launch {
            repository.getDashboard().fold(
                onSuccess = { response ->
                    _state.value = DashboardUiState(isLoading = false, data = response)
                },
                onFailure = { e ->
                    _state.value = DashboardUiState(
                        isLoading = false,
                        error = e.message ?: "Failed to load dashboard"
                    )
                }
            )
        }
    }
}
