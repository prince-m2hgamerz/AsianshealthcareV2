package com.medsolution.admin.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.medsolution.admin.ui.components.*
import com.medsolution.admin.ui.viewmodel.LeadDetailViewModel

@Composable
fun LeadDetailScreen(
    leadId: Int,
    onBack: () -> Unit,
    viewModel: LeadDetailViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsState()
    var showStageMenu by remember { mutableStateOf(false) }
    var showPriorityMenu by remember { mutableStateOf(false) }
    var showDeleteConfirm by remember { mutableStateOf(false) }
    var notesText by remember(state.lead) { mutableStateOf(state.lead?.notes ?: "") }

    LaunchedEffect(leadId) { viewModel.loadLead(leadId) }

    Scaffold(
        topBar = {
            AppTopBar(
                title = state.lead?.name ?: "Lead Detail",
                onBackClick = onBack,
                actions = {
                    IconButton(onClick = { showDeleteConfirm = true }) {
                        Icon(Icons.Default.Delete, contentDescription = "Delete", tint = MaterialTheme.colorScheme.error)
                    }
                }
            )
        }
    ) { padding ->
        when {
            state.isLoading -> LoadingIndicator(modifier = Modifier.padding(padding))
            state.error != null -> ErrorMessage(
                message = state.error ?: "Error",
                onRetry = { viewModel.loadLead(leadId) },
                modifier = Modifier.padding(padding)
            )
            state.lead == null -> EmptyState("Lead not found", modifier = Modifier.padding(padding))
            else -> {
                val lead = state.lead!!

                Column(
                    modifier = Modifier
                        .padding(padding)
                        .fillMaxSize()
                        .verticalScroll(rememberScrollState())
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Card(
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                UserAvatar(name = lead.name)
                                Spacer(modifier = Modifier.width(12.dp))
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(text = lead.name ?: "Unknown", fontWeight = FontWeight.Bold, fontSize = 20.sp)
                                    Text(text = lead.email ?: lead.phone ?: "No contact", color = MaterialTheme.colorScheme.onSurfaceVariant)
                                }
                            }
                        }
                    }

                    Card(
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text("Contact Details", fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
                            Spacer(modifier = Modifier.height(12.dp))
                            if (lead.email != null) InfoRow("Email", lead.email)
                            if (lead.phone != null) InfoRow("Phone", lead.phone)
                            if (lead.source != null) InfoRow("Source", lead.source)
                        }
                    }

                    Card(
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text("Stage & Priority", fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
                            Spacer(modifier = Modifier.height(12.dp))
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("Stage: ", fontWeight = FontWeight.Medium)
                                Box {
                                    TextButton(onClick = { showStageMenu = true }) {
                                        StatusBadge(status = lead.stage)
                                    }
                                    DropdownMenu(expanded = showStageMenu, onDismissRequest = { showStageMenu = false }) {
                                        LeadDetailViewModel.STAGES.forEach { stage ->
                                            DropdownMenuItem(
                                                text = { Text(stage.replace("_", " ").replaceFirstChar { it.uppercase() }) },
                                                onClick = {
                                                    showStageMenu = false
                                                    viewModel.updateStage(lead.id, stage)
                                                }
                                            )
                                        }
                                    }
                                }
                            }
                            Spacer(modifier = Modifier.height(8.dp))
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("Priority: ", fontWeight = FontWeight.Medium)
                                Box {
                                    TextButton(onClick = { showPriorityMenu = true }) {
                                        Text(
                                            lead.priority?.replaceFirstChar { it.uppercase() } ?: "None",
                                            color = when (lead.priority?.lowercase()) {
                                                "high" -> MaterialTheme.colorScheme.error
                                                "medium" -> MaterialTheme.colorScheme.tertiary
                                                else -> MaterialTheme.colorScheme.onSurface
                                            }
                                        )
                                    }
                                    DropdownMenu(expanded = showPriorityMenu, onDismissRequest = { showPriorityMenu = false }) {
                                        LeadDetailViewModel.PRIORITIES.forEach { p ->
                                            DropdownMenuItem(
                                                text = { Text(p.replaceFirstChar { it.uppercase() }) },
                                                onClick = {
                                                    showPriorityMenu = false
                                                    viewModel.updatePriority(lead.id, p)
                                                }
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }

                    Card(
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text("Notes", fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
                            Spacer(modifier = Modifier.height(8.dp))
                            OutlinedTextField(
                                value = notesText,
                                onValueChange = { notesText = it },
                                modifier = Modifier.fillMaxWidth().heightIn(min = 120.dp),
                                shape = RoundedCornerShape(12.dp)
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Button(
                                onClick = { viewModel.updateNotes(lead.id, notesText) },
                                enabled = !state.isSaving,
                                modifier = Modifier.align(Alignment.End)
                            ) {
                                if (state.isSaving) CircularProgressIndicator(modifier = Modifier.size(16.dp), strokeWidth = 2.dp)
                                else Text("Save Notes")
                            }
                        }
                    }

                    if (state.updateError != null) {
                        Text(
                            text = state.updateError ?: "Error saving",
                            color = MaterialTheme.colorScheme.error,
                            fontSize = 14.sp
                        )
                    }

                    Spacer(modifier = Modifier.height(32.dp))
                }

                if (showDeleteConfirm) {
                    AlertDialog(
                        onDismissRequest = { showDeleteConfirm = false },
                        title = { Text("Delete Lead") },
                        text = { Text("Are you sure you want to delete this lead?") },
                        confirmButton = {
                            TextButton(onClick = {
                                showDeleteConfirm = false
                                viewModel.deleteLead(lead.id)
                                onBack()
                            }) { Text("Delete", color = MaterialTheme.colorScheme.error) }
                        },
                        dismissButton = {
                            TextButton(onClick = { showDeleteConfirm = false }) { Text("Cancel") }
                        }
                    )
                }
            }
        }
    }
}

@Composable
private fun InfoRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(vertical = 3.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(text = label, color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 14.sp)
        Text(text = value, fontWeight = FontWeight.Medium, fontSize = 14.sp)
    }
}
