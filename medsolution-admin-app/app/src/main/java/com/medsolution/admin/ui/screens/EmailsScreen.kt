package com.medsolution.admin.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.medsolution.admin.ui.components.*
import com.medsolution.admin.ui.viewmodel.EmailsViewModel

@Composable
fun EmailsScreen(
    viewModel: EmailsViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsState()

    Scaffold(
        topBar = { AppTopBar(title = "Email Campaigns") }
    ) { padding ->
        Column(modifier = Modifier.padding(padding).fillMaxSize()) {
            SearchBar(
                query = state.searchQuery,
                onQueryChanged = viewModel::onSearchQueryChanged,
                placeholder = "Search campaigns...",
                modifier = Modifier.padding(16.dp)
            )

            when {
                state.isLoading -> LoadingIndicator()
                state.error != null -> ErrorMessage(message = state.error ?: "Error", onRetry = viewModel::loadEmails)
                state.emails.isEmpty() -> EmptyState("No email campaigns")
                else -> {
                    LazyColumn(
                        contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(state.emails) { email ->
                            EmailCard(email = email)
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
private fun EmailCard(email: com.medsolution.admin.data.model.Email) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = email.subject ?: "No Subject",
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 15.sp,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.weight(1f)
                )
                Spacer(modifier = Modifier.width(8.dp))
                StatusBadge(status = email.status)
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = email.recipientCount?.let { "$it recipients" } ?: "",
                fontSize = 13.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            if (email.sentAt != null) {
                Text(
                    text = email.sentAt.take(16).replace("T", " "),
                    fontSize = 12.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}
