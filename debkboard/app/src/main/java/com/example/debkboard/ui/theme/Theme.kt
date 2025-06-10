package com.example.debkboard.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

// Define tus colores personalizados
val BlackGround = Color(0x66000000)
val Zinc900 = Color(0xFF18181b)
val Zinc950 = Color(0xFF0b0b0d)
val White90 = Color(0xFFE5E7EB)
val White60 = Color(0xFFD1D5DB)
val White40 = Color(0xFF9CA3AF)
val Zinc800_50 = Color(0x80333333)
val Zinc700_50 = Color(0x80525252)
val Red500 = Color(0xFFF44336)
val Red600 = Color(0xFFE53935)
val Blue500 = Color(0xFF2196F3)
val Blue600 = Color(0xFF1E88E5)
val Rose500 = Color(0xFFE91E63)
val Rose600 = Color(0xFFD81B60)
val Amber400 = Color(0xFFFFCA28)
val Amber500 = Color(0xFFFFC107)
val Cyan400 = Color(0xFF26A69A)
val Cyan500 = Color(0xFF00BCD4)
val Purple500 = Color(0xFF9C27B0)
val Purple600 = Color(0xFF8E24AA)
val SemiGray = Color(0x80333333)

private val DarkColorScheme = darkColorScheme(
    primary = White90,
    secondary = White60,
    tertiary = White40,
    background = Zinc900,
    surface = Zinc800_50,
    onPrimary = Zinc900,
    onSecondary = Zinc900,
    onTertiary = Blue600,
    onBackground = White90,
    onSurface = White90,
    // Añade tus colores personalizados aquí si quieres usarlos semánticamente
    primaryContainer = Zinc700_50, // Ejemplo de uso
    secondaryContainer = Zinc800_50 // Otro ejemplo
)

private val LightColorScheme = lightColorScheme(
    primary = Purple40,
    secondary = PurpleGrey40,
    tertiary = Pink40,
    background = SemiGray,
    onSurface = White90,
    onBackground = BlackGround
    /* Other default colors to override
    background = Color(0xFFFFFBFE),
    surface = Color(0xFFFFFBFE),
    onPrimary = Color.White,
    onSecondary = Color.White,
    onTertiary = Color.White,
    onBackground = Color(0xFF1C1B1F),
    onSurface = Color(0xFF1C1B1F),
    */
)

@Composable
fun DebkboardTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
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
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.background.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}