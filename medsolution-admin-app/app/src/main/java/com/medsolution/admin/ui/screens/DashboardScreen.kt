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
import com.medsolution.admin.ui.viewmodel.DashboardViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(
    onNavigateToLeads: () -> Unit = {},
    onNavigateToEmails: () -> Unit = {},
    onNavigateToSubscribers: () -> Unit = {},
    viewModel: DashboardViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsState()

    Scaffold(
        topBar = { AppTopBar(title = "Dashboard") }
    ) { padding ->
        when {
            state.isLoading -> LoadingIndicator(modifier = Modifier.padding(padding))
            state.error != null -> ErrorMessage(
                message = state.error ?: "Error",
                onRetry = viewModel::loadDashboard,
                modifier = Modifier.padding(padding)
            )
            else -> DashboardContent(
                state = state,
                onNavigateToLeads = onNavigateToLeads,
                onNavigateToEmails = onNavigateToEmails,
                onNavigateToSubscribers = onNavigateToSubscribers,
                modifier = Modifier.padding(padding)
            )
        }
    }
}

@Composable
private fun DashboardContent(
    state: com.medsolution.admin.ui.viewmodel.DashboardUiState,
    onNavigateToLeads: () -> Unit,
    onNavigateToEmails: () -> Unit,
    onNavigateToSubscribers: () -> Unit,
    modifier: Modifier = Modifier
) {
    val stats = state.data?.stats
    val pipeline = state.data?.pipeline ?: emptyList()
    val recentLeads = state.data?.recentLeads ?: emptyList()

    LazyColumn(
        modifier = modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text(
                text = "Overview",
                fontSize = 18.sp,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.onBackground
            )
        }

        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                StatCard(
                    title = "Total Leads",
                    value = "${stats?.totalLeads ?: 0}",
                    modifier = Modifier.weight(1f)
                )
                StatCard(
                    title = "New Today",
                    value = "${stats?.newLeadsToday ?: 0}",
                    modifier = Modifier.weight(1f)
                )
            }
        }

        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                StatCard(
                    title = "Subscribers",
                    value = "${stats?.totalSubscribers ?: 0}",
                    modifier = Modifier.weight(1f)
                )
                StatCard(
                    title = "Doctors",
                    value = "${stats?.totalDoctors ?: 0}",
                    modifier = Modifier.weight(1f)
                )
            }
        }

        if (pipeline.isNotEmpty()) {
            item {
                Text(
                    text = "Pipeline",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        pipeline.forEach { stage ->
                            val total = pipeline.sumOf { it.count }
                            val fraction = if (total > 0) stage.count.toFloat() / total else 0f
                            Row(
                                modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(
                                    text = stage.stage?.replace("_", " ")?.replaceFirstChar { it.uppercase() } ?: "Unknown",
                                    fontSize = 14.sp
                                )
                                Text(
                                    text = "${stage.count}",
                                    fontWeight = FontWeight.SemiBold,
                                    fontSize = 14.sp
                                )
                            }
                            LinearProgressIndicator(
                                progress = { fraction },
                                modifier = Modifier.fillMaxWidth().height(4.dp),
                                color = MaterialTheme.colorScheme.primary,
                                trackColor = MaterialTheme.colorScheme.surfaceVariant
                            )
                        }
                    }
                }
            }
        }

        item {
            Text(
                text = "Recent Leads",
                fontSize = 18.sp,
                fontWeight = FontWeight.SemiBold
            )
        }

        if (recentLeads.isEmpty()) {
            item { Text("No recent leads", color = MaterialTheme.colorScheme.onSurfaceVariant) }
        } else {
            items(recentLeads.take(5)) { lead ->
                Card(
                    modifier = Modifier.fillMaxWidth().clickable { onNavigateToLeads() },
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = lead.name ?: "Unknown",
                                fontWeight = FontWeight.SemiBold,
                                fontSize = 15.sp
                            )
                            Text(
                                text = lead.email ?: "",
                                fontSize = 13.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        }
                        StatusBadge(status = lead.stage)
                    }
                }
            }
        }

        item {
            Text(
                text = "Quick Links",
                fontSize = 18.sp,
                fontWeight = FontWeight.SemiBold
            )
        }

        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                QuickLinkCard(
                    title = "Leads",
                    icon = Icons.Default.People,
                    onClick = onNavigateToLeads,
                    modifier = Modifier.weight(1f)
                )
                QuickLinkCard(
                    title = "Emails",
                    icon = Icons.Default.Email,
                    onClick = onNavigateToEmails,
                    modifier = Modifier.weight(1f)
                )
                QuickLinkCard(
                    title = "Subscribers",
                    icon = Icons.Default.ContactMail,
                    onClick = onNavigateToSubscribers,
                    modifier = Modifier.weight(1f)
                )
            }
        }

        item { Spacer(modifier = Modifier.height(80.dp)) }
    }
}

@Composable
private fun QuickLinkCard(
    title: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        onClick = onClick,
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                imageVector = icon,
                contentDescription = title,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(28.dp)
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(text = title, fontSize = 14.sp, fontWeight = FontWeight.Medium)
        }
    }
}
