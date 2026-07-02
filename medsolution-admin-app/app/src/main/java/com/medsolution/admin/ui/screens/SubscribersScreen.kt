package com.medsolution.admin.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import com.medsolution.admin.data.model.Subscriber
import com.medsolution.admin.ui.components.*
import com.medsolution.admin.ui.viewmodel.SubscribersViewModel

@Composable
fun SubscribersScreen(
    viewModel: SubscribersViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsState()

    Scaffold(
        topBar = {
            AppTopBar(
                title = "Subscribers",
                actions = {
                    if (state.subscribers.isNotEmpty()) {
                        IconButton(onClick = viewModel::toggleShowActiveOnly) {
                            Icon(
                                imageVector = if (state.showActiveOnly) Icons.Default.PersonOff else Icons.Default.Person,
                                contentDescription = if (state.showActiveOnly) "Show all" else "Show active only",
                                tint = if (state.showActiveOnly) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            )
        }
    ) { padding ->
        Column(modifier = Modifier.padding(padding).fillMaxSize()) {
            SearchBar(
                query = state.searchQuery,
                onQueryChanged = viewModel::onSearchQueryChanged,
                placeholder = "Search subscribers...",
                modifier = Modifier.padding(16.dp)
            )

            when {
                state.isLoading -> LoadingIndicator()
                state.error != null -> ErrorMessage(message = state.error ?: "Error", onRetry = viewModel::loadSubscribers)
                state.subscribers.isEmpty() -> EmptyState("No subscribers found")
                else -> {
                    LazyColumn(
                        contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(state.subscribers) { subscriber ->
                            SubscriberCard(
                                subscriber = subscriber,
                                onDelete = { viewModel.deleteSubscriber(subscriber.id) }
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
private fun SubscriberCard(
    subscriber: Subscriber,
    onDelete: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            UserAvatar(name = subscriber.email)
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = subscriber.email ?: "No email",
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 15.sp,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                if (subscriber.name != null) {
                    Text(
                        text = subscriber.name,
                        fontSize = 13.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
            Column(horizontalAlignment = Alignment.End) {
                StatusBadge(status = if (subscriber.isActive) "active" else "inactive")
                Spacer(modifier = Modifier.height(4.dp))
                IconButton(onClick = onDelete, modifier = Modifier.size(32.dp)) {
                    Icon(Icons.Default.Delete, contentDescription = "Delete", tint = MaterialTheme.colorScheme.error, modifier = Modifier.size(18.dp))
                }
            }
        }
    }
}
