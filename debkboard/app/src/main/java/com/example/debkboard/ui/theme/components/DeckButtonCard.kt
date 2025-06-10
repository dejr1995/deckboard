@file:OptIn(ExperimentalFoundationApi::class)
package com.example.debkboard.ui

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.runtime.getValue
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.geometry.Offset
@Composable
fun DeckButtonCard(
    label: String,
    iconUrl: String,
    isToggle: Boolean,
    isToggleOn: Boolean,
    borderColorId: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val defaultBorderColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f)
    val onToggleOnColor = colorPaletteMap[borderColorId] ?: defaultBorderColor

    val borderColor by animateColorAsState(
        targetValue = if (isToggle && isToggleOn) onToggleOnColor else defaultBorderColor,
        label = "BorderColorAnimation"
    )

    val iconScale by animateFloatAsState(
        targetValue = if (isToggle && isToggleOn) 1.2f else 1f,
        label = "IconScaleAnimation"
    )

    val gradientBrush = Brush.linearGradient(
        colors = listOf(
            Color(0x1A64B5F6), // azul con 10% opacidad
            Color(0x3364B5F6)  // azul con 20% opacidad
        ),
        start = Offset.Zero,
        end = Offset.Infinite
    )

    Card(
        modifier = modifier
            .clickable(onClick = onClick)
            .clip(RoundedCornerShape(24.dp)),
        shape = MaterialTheme.shapes.medium,
        colors = CardDefaults.cardColors(
            containerColor = Color.Transparent // Fondo transparente
        ),
        border = BorderStroke(2.dp, borderColor),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier
                .fillMaxSize()
                .background(gradientBrush) // Aquí aplicas el degradado
                .padding(8.dp)
        ) {
            AsyncImage(
                model = iconUrl,
                contentDescription = label,
                modifier = Modifier
                    .size(48.dp)
                    .scale(iconScale)
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = label,
                style = MaterialTheme.typography.bodyMedium,
                textAlign = TextAlign.Center,
                color = MaterialTheme.colorScheme.onSurface
            )
        }
    }
}
