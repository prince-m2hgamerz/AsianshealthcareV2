package com.medsolution.admin.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.medsolution.admin.ui.components.*
import com.medsolution.admin.ui.viewmodel.LeadsViewModel
import com.google.accompanist.swiperefresh.SwipeRefresh
import com.google.accompanist.swiperefresh.rememberSwipeRefreshState

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LeadsScreen(
    onLeadClick: (Int) -> Unit = {},
    viewModel: LeadsViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsState()
    var showStageFilter by remember { mutableStateOf(false) }

    Scaffold(
        topBar = { AppTopBar(title = "Leads") }
    ) { padding ->
        Column(modifier = Modifier.padding(padding).fillMaxSize()) {
            SearchBar(
                query = state.searchQuery,
                onQueryChanged = viewModel::onSearchQueryChanged,
                placeholder = "Search leads...",
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
            )

            Row(
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                FilterChip(
                    selected = state.selectedStage == null,
                    onClick = { viewModel.onStageFilterChanged(null) },
                    label = { Text("All") }
                )
                LeadsViewModel.STAGE_OPTIONS.take(4).forEach { stage ->
                    FilterChip(
                        selected = state.selectedStage == stage,
                        onClick = { viewModel.onStageFilterChanged(stage) },
                        label = { Text(stage.replaceFirstChar { it.uppercase() }) }
                    )
                }
            }

            when {
                state.isLoading -> LoadingIndicator()
                state.error != null -> ErrorMessage(
                    message = state.error ?: "Error",
                    onRetry = viewModel::loadLeads
                )
                state.leads.isEmpty() -> EmptyState("No leads found")
                else -> {
                    LazyColumn(
                        contentPadding = PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(state.leads) { lead ->
                            LeadCard(
                                lead = lead,
                                onClick = { onLeadClick(lead.id) },
                                onDelete = { viewModel.deleteLead(lead.id) }
                            )
                        }
                        item {
                            PaginationLoader(
                                hasMore = state.hasMore,
                                isLoadingMore = state.isLoadingMore,
                                onLoadMore = viewModel::loadMore
                            )
                        }
                        item { Spacer(modifier = Modifier.height(80.dp)) }
                    }
                }
            }
        }
    }
}

@Composable
private fun LeadCard(
    lead: com.medsolution.admin.data.model.Lead,
    onClick: () -> Unit,
    onDelete: () -> Unit
) {
    Card(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            UserAvatar(name = lead.name)
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = lead.name ?: "Unknown",
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 15.sp,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Text(
                    text = lead.email ?: lead.phone ?: "No contact",
                    fontSize = 13.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    if (lead.source != null) {
                        Text(
                            text = lead.source,
                            fontSize = 11.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    if (lead.createdAt != null) {
                        Text(
                            text = lead.createdAt.take(10),
                            fontSize = 11.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
            Column(horizontalAlignment = Alignment.End) {
                StatusBadge(status = lead.stage)
                if (lead.priority != null) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = lead.priority.replaceFirstChar { it.uppercase() },
                        fontSize = 11.sp,
                        color = when (lead.priority?.lowercase()) {
                            "high" -> MaterialTheme.colorScheme.error
                            "medium" -> MaterialTheme.colorScheme.tertiary
                            else -> MaterialTheme.colorScheme.onSurfaceVariant
                        }
                    )
                }
            }
        }
    }
}
