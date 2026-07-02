package com.medsolution.admin.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.medsolution.admin.data.model.Lead
import com.medsolution.admin.data.model.LeadUpdateRequest
import com.medsolution.admin.data.repository.AdminRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class LeadsUiState(
    val leads: List<Lead> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val searchQuery: String = "",
    val selectedStage: String? = null,
    val currentPage: Int = 1,
    val hasMore: Boolean = false,
    val isLoadingMore: Boolean = false
)

@HiltViewModel
class LeadsViewModel @Inject constructor(
    private val repository: AdminRepository
) : ViewModel() {

    private val _state = MutableStateFlow(LeadsUiState())
    val state: StateFlow<LeadsUiState> = _state.asStateFlow()

    init {
        loadLeads()
    }

    fun loadLeads() {
        _state.value = _state.value.copy(isLoading = true, error = null, currentPage = 1)
        viewModelScope.launch {
            val result = repository.getLeads(
                page = 1,
                search = _state.value.searchQuery.takeIf { it.isNotBlank() },
                stage = _state.value.selectedStage
            )
            result.fold(
                onSuccess = { response ->
                    _state.value = _state.value.copy(
                        leads = response.data,
                        isLoading = false,
                        hasMore = response.hasMore,
                        currentPage = 1
                    )
                },
                onFailure = { e ->
                    _state.value = _state.value.copy(
                        isLoading = false,
                        error = e.message ?: "Failed to load leads"
                    )
                }
            )
        }
    }

    fun loadMore() {
        if (_state.value.isLoadingMore || !_state.value.hasMore) return
        _state.value = _state.value.copy(isLoadingMore = true)
        val nextPage = _state.value.currentPage + 1
        viewModelScope.launch {
            val result = repository.getLeads(
                page = nextPage,
                search = _state.value.searchQuery.takeIf { it.isNotBlank() },
                stage = _state.value.selectedStage
            )
            result.fold(
                onSuccess = { response ->
                    _state.value = _state.value.copy(
                        leads = _state.value.leads + response.data,
                        isLoadingMore = false,
                        hasMore = response.hasMore,
                        currentPage = nextPage
                    )
                },
                onFailure = {
                    _state.value = _state.value.copy(isLoadingMore = false)
                }
            )
        }
    }

    fun onSearchQueryChanged(query: String) {
        _state.value = _state.value.copy(searchQuery = query)
        loadLeads()
    }

    fun onStageFilterChanged(stage: String?) {
        _state.value = _state.value.copy(selectedStage = stage)
        loadLeads()
    }

    fun deleteLead(id: Int) {
        viewModelScope.launch {
            repository.deleteLead(id)
            loadLeads()
        }
    }

    companion object {
        val STAGE_OPTIONS = listOf(
            "new", "contacted", "qualified", "proposal",
            "negotiation", "closed_won", "closed_lost"
        )
    }
}
