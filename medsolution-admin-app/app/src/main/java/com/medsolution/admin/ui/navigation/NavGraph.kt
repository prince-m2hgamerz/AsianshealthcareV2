package com.medsolution.admin.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.navArgument
import com.medsolution.admin.ui.screens.*

@Composable
fun NavGraph(
    navController: NavHostController,
    startDestination: String,
    isLoggedIn: Boolean
) {
    NavHost(
        navController = navController,
        startDestination = if (isLoggedIn) Screen.Dashboard.route else Screen.Login.route
    ) {
        composable(Screen.Login.route) {
            LoginScreen(
                onLoginSuccess = {
                    navController.navigate(Screen.Dashboard.route) {
                        popUpTo(Screen.Login.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.Dashboard.route) {
            DashboardScreen(
                onNavigateToLeads = { navController.navigate(Screen.Leads.route) },
                onNavigateToEmails = { navController.navigate(Screen.Emails.route) },
                onNavigateToSubscribers = { navController.navigate(Screen.Subscribers.route) }
            )
        }

        composable(Screen.Leads.route) {
            LeadsScreen(
                onLeadClick = { leadId ->
                    navController.navigate(Screen.LeadDetail.createRoute(leadId))
                }
            )
        }

        composable(
            route = Screen.LeadDetail.route,
            arguments = listOf(navArgument("leadId") { type = NavType.IntType })
        ) { backStackEntry ->
            val leadId = backStackEntry.arguments?.getInt("leadId") ?: 0
            LeadDetailScreen(
                leadId = leadId,
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.Emails.route) {
            EmailsScreen()
        }

        composable(Screen.Subscribers.route) {
            SubscribersScreen()
        }

        composable(Screen.Notifications.route) {
            NotificationsScreen()
        }

        composable(Screen.Profile.route) {
            ProfileScreen(onLogout = {
                navController.navigate(Screen.Login.route) {
                    popUpTo(Screen.Dashboard.route) { inclusive = true }
                }
            })
        }

        composable(Screen.Settings.route) {
            SettingsScreen(onBack = { navController.popBackStack() })
        }
    }
}
