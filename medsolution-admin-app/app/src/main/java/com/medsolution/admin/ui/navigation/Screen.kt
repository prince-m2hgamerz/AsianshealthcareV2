package com.medsolution.admin.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(
    val route: String,
    val title: String,
    val icon: ImageVector? = null
) {
    data object Login : Screen("login", "Login", Icons.Default.Login)
    data object Dashboard : Screen("dashboard", "Dashboard", Icons.Default.Dashboard)
    data object Leads : Screen("leads", "Leads", Icons.Default.People)
    data object LeadDetail : Screen("leads/{leadId}", "Lead Detail") {
        fun createRoute(leadId: Int) = "leads/$leadId"
    }
    data object Emails : Screen("emails", "Emails", Icons.Default.Email)
    data object Subscribers : Screen("subscribers", "Subscribers", Icons.Default.ContactMail)
    data object Notifications : Screen("notifications", "Notifications", Icons.Default.Notifications)
    data object Profile : Screen("profile", "Profile", Icons.Default.Person)
    data object Settings : Screen("settings", "Settings", Icons.Default.Settings)

    companion object {
        val bottomNavItems = listOf(
            Dashboard,
            Leads,
            Emails,
            Notifications,
            Profile
        )
    }
}
