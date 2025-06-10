package com.example.debkboard.ui.theme.components

import kotlinx.serialization.Serializable

@Serializable
data class ButtonInfo(
    val key: String,
    val label: String,
    val icon: String
)
