package com.medsolution.admin

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.medsolution.admin.ui.navigation.Screen
import com.medsolution.admin.ui.screens.*
import com.medsolution.admin.ui.theme.MedSolutionAdminTheme
import com.medsolution.admin.ui.viewmodel.LoginViewModel
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MedSolutionAdminTheme {
                MainApp()
            }
        }
    }
}

@Composable
fun MainApp() {
    val navController = rememberNavController()
    var isLoggedIn by remember { mutableStateOf(false) }
    val loginViewModel: LoginViewModel = hiltViewModel()
    val loginState by loginViewModel.state.collectAsState()

    LaunchedEffect(loginState.isSuccess) {
        if (loginState.isSuccess) {
            isLoggedIn = true
            navController.navigate(Screen.Dashboard.route) {
                popUpTo(0) { inclusive = true }
            }
        }
    }

    val startDestination = if (isLoggedIn) Screen.Dashboard.route else Screen.Login.route

    Scaffold(
        bottomBar = {
            if (isLoggedIn) {
                BottomNavBar(navController = navController)
            }
        }
    ) { padding ->
        NavHost(
            navController = navController,
            startDestination = startDestination,
            modifier = Modifier.padding(padding)
        ) {
            composable(Screen.Login.route) {
                LoginScreen(
                    onLoginSuccess = {
                        isLoggedIn = true
                        navController.navigate(Screen.Dashboard.route) {
                            popUpTo(0) { inclusive = true }
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
                        navController.navigate("lead_detail/$leadId")
                    }
                )
            }
            composable(
                route = Screen.LeadDetail.route,
                arguments = listOf(navArgument("leadId") { type = NavType.IntType })
            ) { backStackEntry ->
                val leadId = backStackEntry.arguments?.getInt("leadId") ?: return@composable
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
                ProfileScreen(
                    onLogout = {
                        isLoggedIn = false
                        navController.navigate(Screen.Login.route) {
                            popUpTo(0) { inclusive = true }
                        }
                    }
                )
            }
            composable(Screen.Settings.route) {
                SettingsScreen(onBack = { navController.popBackStack() })
            }
        }
    }
}

data class BottomNavItem(
    val label: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector,
    val route: String
)

private val bottomNavItems = listOf(
    BottomNavItem("Dashboard", Icons.Filled.Dashboard, Icons.Outlined.Dashboard, Screen.Dashboard.route),
    BottomNavItem("Leads", Icons.Filled.People, Icons.Outlined.People, Screen.Leads.route),
    BottomNavItem("Emails", Icons.Filled.Email, Icons.Outlined.Email, Screen.Emails.route),
    BottomNavItem("Notifications", Icons.Filled.Notifications, Icons.Outlined.Notifications, Screen.Notifications.route),
    BottomNavItem("Profile", Icons.Filled.Person, Icons.Outlined.Person, Screen.Profile.route)
)

@Composable
private fun BottomNavBar(navController: NavHostController) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    NavigationBar {
        bottomNavItems.forEach { item ->
            val selected = currentRoute == item.route
            NavigationBarItem(
                selected = selected,
                onClick = {
                    if (currentRoute != item.route) {
                        navController.navigate(item.route) {
                            popUpTo(navController.graph.findStartDestination().id) {
                                saveState = true
                            }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                },
                icon = {
                    Icon(
                        imageVector = if (selected) item.selectedIcon else item.unselectedIcon,
                        contentDescription = item.label
                    )
                },
                label = {
                    Text(
                        text = item.label,
                        fontSize = if (selected) 12.sp else 11.sp,
                        fontWeight = if (selected) FontWeight.SemiBold else FontWeight.Normal
                    )
                }
            )
        }
    }
}
