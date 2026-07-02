package com.medsolution.admin.ui.viewmodel

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.medsolution.admin.data.model.Doctor
import com.medsolution.admin.data.model.Hospital
import com.medsolution.admin.data.model.Lead
import com.medsolution.admin.data.model.LeadUpdateRequest
import com.medsolution.admin.data.repository.AdminRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class LeadDetailUiState(
    val lead: Lead? = null,
    val doctors: List<Doctor> = emptyList(),
    val hospitals: List<Hospital> = emptyList(),
    val isLoading: Boolean = true,
    val isSaving: Boolean = false,
    val error: String? = null,
    val updateError: String? = null,
    val saveSuccess: Boolean = false
)

@HiltViewModel
class LeadDetailViewModel @Inject constructor(
    savedStateHandle: SavedStateHandle,
    private val repository: AdminRepository
) : ViewModel() {

    private var leadId: Int = savedStateHandle.get<Int>("leadId") ?: 0

    private val _state = MutableStateFlow(LeadDetailUiState())
    val state: StateFlow<LeadDetailUiState> = _state.asStateFlow()

    init {
        if (leadId > 0) {
            loadLead()
            loadDoctors()
            loadHospitals()
        }
    }

    fun loadLead(id: Int? = null) {
        id?.let { leadId = it }
        _state.value = _state.value.copy(isLoading = true, error = null)
        viewModelScope.launch {
            repository.getLead(leadId).fold(
                onSuccess = { _state.value = _state.value.copy(lead = it, isLoading = false) },
                onFailure = { _state.value = _state.value.copy(error = it.message, isLoading = false) }
            )
        }
    }

    private fun loadDoctors() {
        viewModelScope.launch {
            repository.getDoctors().fold(
                onSuccess = { _state.value = _state.value.copy(doctors = it) },
                onFailure = { }
            )
        }
    }

    private fun loadHospitals() {
        viewModelScope.launch {
            repository.getHospitals().fold(
                onSuccess = { _state.value = _state.value.copy(hospitals = it) },
                onFailure = { }
            )
        }
    }

    fun updateStage(leadId: Int, stage: String) {
        _state.value = _state.value.copy(isSaving = true, updateError = null)
        viewModelScope.launch {
            repository.updateLead(leadId, LeadUpdateRequest(stage = stage)).fold(
                onSuccess = {
                    _state.value = _state.value.copy(isSaving = false, saveSuccess = true)
                    loadLead()
                },
                onFailure = {
                    _state.value = _state.value.copy(isSaving = false, updateError = it.message)
                }
            )
        }
    }

    fun updatePriority(leadId: Int, priority: String) {
        _state.value = _state.value.copy(isSaving = true, updateError = null)
        viewModelScope.launch {
            repository.updateLead(leadId, LeadUpdateRequest(priority = priority)).fold(
                onSuccess = {
                    _state.value = _state.value.copy(isSaving = false, saveSuccess = true)
                    loadLead()
                },
                onFailure = {
                    _state.value = _state.value.copy(isSaving = false, updateError = it.message)
                }
            )
        }
    }

    fun updateNotes(leadId: Int, notes: String) {
        _state.value = _state.value.copy(isSaving = true, updateError = null)
        viewModelScope.launch {
            repository.updateLead(leadId, LeadUpdateRequest(notes = notes)).fold(
                onSuccess = {
                    _state.value = _state.value.copy(isSaving = false, saveSuccess = true)
                    loadLead()
                },
                onFailure = {
                    _state.value = _state.value.copy(isSaving = false, updateError = it.message)
                }
            )
        }
    }

    fun deleteLead(leadId: Int) {
        viewModelScope.launch {
            repository.deleteLead(leadId).fold(
                onSuccess = { },
                onFailure = {
                    _state.value = _state.value.copy(updateError = it.message)
                }
            )
        }
    }

    companion object {
        val STAGES = listOf(
            "new", "contacted", "qualified", "consultation", "proposal",
            "negotiation", "closed_won", "closed_lost"
        )
        val PRIORITIES = listOf("low", "medium", "high")
    }
}
