package com.example.debkboard.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun ConnectionScreen(onIpEntered: (String) -> Unit) {
    var ip by remember { mutableStateOf("") }
    var showError by remember { mutableStateOf(false) }

    val isValidIp: (String) -> Boolean = { input ->
        val ipRegex =
            Regex("^((25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)\\.){3}(25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)\$")
        input.matches(ipRegex)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Ingrese la IP del servidor", fontSize = 20.sp)

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = ip,
            onValueChange = {
                ip = it
                showError = false  // Oculta el error mientras escribe
            },
            label = { Text("IP del servidor") },
            placeholder = { Text("Ej: 127.0.0.1") },
            singleLine = true,
            isError = showError
        )

        if (showError) {
            Spacer(modifier = Modifier.height(8.dp))
            Text("Introduce una IP válida", color = Color.Red)
        }

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = {
                if (isValidIp(ip)) {
                    onIpEntered(ip)
                } else {
                    showError = true
                }
            }
        ) {
            Text("Conectar")
        }
    }
}
