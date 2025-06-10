package com.example.debkboard.ui.theme.components

import kotlinx.serialization.Serializable

@Serializable
data class DeckButton(
    val id: String,
    val label: String,
    val icon: String, // Aquí se recibe la URL completa del icono
    val url: String,
    val toggle: Boolean = false,
    val state: Boolean = false,
    val color: String = ""
)
