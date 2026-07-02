package com.medsolution.admin.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext

val Teal700 = Color(0xFF0D9488)
val Teal600 = Color(0xFF0EA5A5)
val Teal500 = Color(0xFF14B8A6)
val Teal100 = Color(0xFFCCFBF1)
val Teal50 = Color(0xFFF0FDFA)

val DarkTeal700 = Color(0xFF0D9488)
val DarkSurface = Color(0xFF1C1C1E)
val DarkSurfaceVariant = Color(0xFF2C2C2E)
val DarkOnSurface = Color(0xFFF5F5F5)

private val LightColorScheme = lightColorScheme(
    primary = Teal700,
    onPrimary = Color.White,
    primaryContainer = Teal100,
    onPrimaryContainer = Color(0xFF0F3E3A),
    secondary = Color(0xFF6B7280),
    onSecondary = Color.White,
    secondaryContainer = Color(0xFFF3F4F6),
    onSecondaryContainer = Color(0xFF1F2937),
    tertiary = Color(0xFF7C3AED),
    onTertiary = Color.White,
    background = Color(0xFFF9FAFB),
    onBackground = Color(0xFF111827),
    surface = Color.White,
    onSurface = Color(0xFF111827),
    surfaceVariant = Color(0xFFF3F4F6),
    onSurfaceVariant = Color(0xFF6B7280),
    outline = Color(0xFFD1D5DB),
    error = Color(0xFFEF4444),
    onError = Color.White,
    errorContainer = Color(0xFFFEE2E2),
)

private val DarkColorScheme = darkColorScheme(
    primary = Teal500,
    onPrimary = Color(0xFF0F3E3A),
    primaryContainer = Color(0xFF134E4A),
    onPrimaryContainer = Teal100,
    secondary = Color(0xFF9CA3AF),
    onSecondary = Color(0xFF1F2937),
    secondaryContainer = Color(0xFF374151),
    onSecondaryContainer = Color(0xFFD1D5DB),
    tertiary = Color(0xFFA78BFA),
    onTertiary = Color(0xFF1E1B4B),
    background = DarkSurface,
    onBackground = DarkOnSurface,
    surface = DarkSurfaceVariant,
    onSurface = DarkOnSurface,
    surfaceVariant = Color(0xFF2C2C2E),
    onSurfaceVariant = Color(0xFF9CA3AF),
    outline = Color(0xFF4B5563),
    error = Color(0xFFF87171),
    onError = Color(0xFF450A0A),
    errorContainer = Color(0xFF7F1D1D),
)

@Composable
fun MedSolutionAdminTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
