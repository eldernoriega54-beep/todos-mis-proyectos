package com.hermes.system.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.currentBackStackEntryAsState

sealed class BottomTab(val route: String, val iconFilled: ImageVector, val labelEs: String, val labelEn: String) {
    object Home    : BottomTab("home",    Icons.Filled.Home,    "Inicio",   "Home")
    object Connect : BottomTab("connect", Icons.Filled.AddCircle, "Conectar", "Connect")
    object Settings: BottomTab("settings",Icons.Filled.Settings,"Ajustes",  "Settings")
}

val bottomTabs = listOf(BottomTab.Home, BottomTab.Connect, BottomTab.Settings)

@Composable
fun AppShell(
    navController: NavController,
    language: String,
    content: @Composable (PaddingValues) -> Unit
) {
    val isSpanish = language == "es"
    val currentEntry by navController.currentBackStackEntryAsState()
    val currentRoute = currentEntry?.destination?.route

    Scaffold(
        containerColor = Color(0xFF121212),
        bottomBar = {
            NavigationBar(
                containerColor = Color(0xFF1A1A1A),
                tonalElevation = 0.dp
            ) {
                bottomTabs.forEach { tab ->
                    NavigationBarItem(
                        selected = currentRoute == tab.route,
                        onClick = {
                            navController.navigate(tab.route) {
                                popUpTo(navController.graph.findStartDestination().id) { saveState = true }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                        icon = {
                            Icon(
                                imageVector = tab.iconFilled,
                                contentDescription = if (isSpanish) tab.labelEs else tab.labelEn
                            )
                        },
                        label = {
                            Text(if (isSpanish) tab.labelEs else tab.labelEn)
                        },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = Color(0xFF00E5FF),
                            selectedTextColor = Color(0xFF00E5FF),
                            unselectedIconColor = Color.Gray,
                            unselectedTextColor = Color.Gray,
                            indicatorColor = Color(0xFF002233)
                        )
                    )
                }
            }
        }
    ) { padding ->
        content(padding)
    }
}

