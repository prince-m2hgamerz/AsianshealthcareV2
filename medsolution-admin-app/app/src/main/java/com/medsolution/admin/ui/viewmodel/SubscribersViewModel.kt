package com.medsolution.admin.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.medsolution.admin.data.model.Subscriber
import com.medsolution.admin.data.repository.AdminRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class SubscribersUiState(
    val subscribers: List<Subscriber> = emptyList(),
    val isLoading: Boolean = true,
    val isLoadingMore: Boolean = false,
    val hasMore: Boolean = true,
    val error: String? = null,
    val searchQuery: String = "",
    val showActiveOnly: Boolean = false
)

@HiltViewModel
class SubscribersViewModel @Inject constructor(
    private val repository: AdminRepository
) : ViewModel() {

    private val _state = MutableStateFlow(SubscribersUiState())
    val state: StateFlow<SubscribersUiState> = _state.asStateFlow()

    private var currentPage = 1
    private var searchJob: Job? = null

    init {
        loadSubscribers()
    }

    fun loadSubscribers() {
        currentPage = 1
        _state.value = _state.value.copy(isLoading = true, error = null)
        fetchSubscribers()
    }

    fun loadMore() {
        if (_state.value.isLoadingMore || !_state.value.hasMore) return
        _state.value = _state.value.copy(isLoadingMore = true)
        currentPage++
        fetchSubscribers(isLoadMore = true)
    }

    fun onSearchQueryChanged(query: String) {
        _state.value = _state.value.copy(searchQuery = query)
        searchJob?.cancel()
        searchJob = viewModelScope.launch {
            delay(500)
            loadSubscribers()
        }
    }

    fun toggleShowActiveOnly() {
        _state.value = _state.value.copy(showActiveOnly = !_state.value.showActiveOnly)
        loadSubscribers()
    }

    fun deleteSubscriber(id: Int) {
        viewModelScope.launch {
            repository.deleteSubscriber(id).fold(
                onSuccess = {
                    _state.value = _state.value.copy(
                        subscribers = _state.value.subscribers.filter { it.id != id }
                    )
                },
                onFailure = { /* ignore */ }
            )
        }
    }

    private fun fetchSubscribers(isLoadMore: Boolean = false) {
        viewModelScope.launch {
            val query = _state.value.searchQuery.takeIf { it.isNotBlank() }
            repository.getSubscribers(
                page = currentPage,
                search = query
            ).fold(
                onSuccess = { response ->
                    val items = response.data ?: emptyList()
                    _state.value = _state.value.copy(
                        subscribers = if (isLoadMore) _state.value.subscribers + items else items,
                        isLoading = false,
                        isLoadingMore = false,
                        hasMore = items.size >= 20,
                        error = null
                    )
                },
                onFailure = { e ->
                    _state.value = _state.value.copy(
                        isLoading = false,
                        isLoadingMore = false,
                        error = e.message ?: "Failed to load subscribers"
                    )
                }
            )
        }
    }
}
