@file:OptIn(ExperimentalFoundationApi::class)
package com.example.debkboard.ui

import android.util.Log
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.example.debkboard.ui.theme.components.DeckButton
import io.socket.client.IO
import io.socket.client.Socket
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.URL

// Mapeo de IDs de color a objetos Color de Compose
val colorPaletteMap = mapOf(
    "red" to Color(0xFFF44336),
    "green" to Color(0xFF198754),
    "blue" to Color(0xFF2196F3),
    "yellow" to Color(0xFFFFCA28),
    "purple" to Color(0xFF6f42c1),
    "lightBlue" to Color(0xFF03A9F4),
    "orange" to Color(0xFFFF9800),
)

@Composable
fun DeckboardScreen(
    serverIp: String,
    onOpenSite: (String, String) -> Unit
) {
    var buttons by remember { mutableStateOf(listOf<DeckButton>()) }
    var columnas by remember { mutableStateOf(1) }
    var filas by remember { mutableStateOf(1) }
    var error by remember { mutableStateOf<String?>(null) }

    val socket = remember { mutableStateOf<Socket?>(null) }
    val coroutineScope = rememberCoroutineScope()

    // Conectar al socket al iniciar la pantalla o cuando cambia la IP del servidor
    LaunchedEffect(serverIp) {
        try {
            socket.value?.disconnect()
            socket.value = IO.socket("http://$serverIp:3000").apply {
                on(Socket.EVENT_CONNECT) {
                    Log.d("SocketIO", "Conectado al servidor")
                }
                on(Socket.EVENT_DISCONNECT) { args ->
                    Log.d("SocketIO", "Desconectado del servidor: ${args.contentToString()}")
                }
                on("deckConfigChanged") { args ->
                    val data = args[0] as JSONObject
                    Log.d("SocketIO", "Cambio en deckConfig recibido: $data")
                    try {
                        val newColumnas = data.getInt("columnas")
                        val newFilas = data.getInt("filas")
                        val jsonArray = data.getJSONArray("botones")
                        val newButtons = (0 until jsonArray.length()).mapNotNull { i ->
                            val obj = jsonArray.getJSONObject(i)
                            val label = obj.getString("label")
                            val icon = obj.getString("icon")
                            val url = obj.getString("url")
                            val toggle = obj.optBoolean("toggle", false)
                            val state = obj.optBoolean("state", false) // Obtener el estado del toggle
                            val colorId = obj.optString("color", "")
                            if (label.isNotEmpty() && icon.isNotEmpty() && url.isNotEmpty()) {
                                DeckButton(
                                    id = obj.getString("id"),
                                    label = label,
                                    icon = "http://$serverIp:3000$icon",
                                    url = url,
                                    toggle = toggle,
                                    state = state,
                                    color = colorId
                                )
                            } else null
                        }
                        coroutineScope.launch(Dispatchers.Main) {
                            columnas = newColumnas
                            filas = newFilas
                            buttons = newButtons
                        }
                    } catch (e: Exception) {
                        Log.e("SocketIO", "Error al parsear datos de deckConfig: ${e.message}")
                    }
                }
                socket.value?.on("recordingStatus") { args ->
                    val data = args[0] as JSONObject
                    if (data.has("recording")) {
                        val isRecording = data.getBoolean("recording")
                        Log.d("SocketIO", "Estado de grabación actualizado: $isRecording")
                        val updatedButtons = buttons.map {
                            if (it.id == "toggle-recording") {
                                it.copy(state = isRecording)
                            } else {
                                it
                            }
                        }
                        coroutineScope.launch(Dispatchers.Main) {
                            buttons = updatedButtons
                        }
                    } else {
                        Log.w("SocketIO", "Evento recordingStatus recibido sin la clave 'recording': $data")
                        // Aquí podrías manejar el caso en que la clave no está presente
                    }
                }
                on("obsError") { args ->
                    val data = args[0] as JSONObject
                    val message = data.getString("message")
                    Log.e("SocketIO", "Error de OBS recibido: $message")
                    // Aquí podrías mostrar un mensaje de error en la UI
                }
                connect()
            }
        } catch (e: Exception) {
            Log.e("SocketIO", "Error al conectar al socket: ${e.message}")
            error = "Error al conectar al servidor Socket.IO: ${e.message}"
        }
    }

    // Cargar la configuración inicial al iniciar la pantalla
    LaunchedEffect(serverIp) {
        try {
            val jsonString = withContext(Dispatchers.IO) {
                URL("http://$serverIp:3000/deck").readText()
            }

            val jsonObject = JSONObject(jsonString)
            columnas = jsonObject.getInt("columnas")
            filas = jsonObject.getInt("filas")

            val jsonArray = jsonObject.getJSONArray("botones")
            buttons = (0 until jsonArray.length()).mapNotNull { i ->
                val obj = jsonArray.getJSONObject(i)
                val label = obj.getString("label")
                val icon = obj.getString("icon")
                val url = obj.getString("url")
                val toggle = obj.optBoolean("toggle", false)
                val state = obj.optBoolean("state", false) // Obtener el estado inicial del toggle
                val colorId = obj.optString("color", "")
                if (label.isNotEmpty() && icon.isNotEmpty() && url.isNotEmpty()) {
                    DeckButton(
                        id = obj.getString("id"),
                        label = label,
                        icon = "http://$serverIp:3000$icon",
                        url = url,
                        toggle = toggle,
                        state = state,
                        color = colorId
                    )
                } else null
            }
        } catch (e: Exception) {
            error = "Error al cargar datos iniciales: ${e.message}"
        }
    }

    // Desconectar el socket al dejar de mostrar la pantalla
    DisposableEffect(Unit) {
        onDispose {
            socket.value?.disconnect()
        }
    }

    if (error != null) {
        Text("Error: $error", color = Color.Red)
    } else {
        BoxWithConstraints(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(Color(0xFF18181b), Color(0xFF0b0b0d))
                    )
                )
                .padding(16.dp)
        ) {
            val buttonSpacing = 12.dp
            val totalHorizontalPadding = buttonSpacing * (columnas - 1)
            val totalVerticalPadding = buttonSpacing * (filas - 1)

            val buttonWidth = (maxWidth - totalHorizontalPadding) / columnas
            val buttonHeight = (maxHeight - totalVerticalPadding) / filas

            val buttonsPerPage = filas * columnas
            val pageCount = (buttons.size + buttonsPerPage - 1) / buttonsPerPage

            val pagerState = rememberPagerState { pageCount }

            HorizontalPager(
                state = pagerState,
                modifier = Modifier.fillMaxSize()
            ) { pageIndex ->
                val startIndex = pageIndex * buttonsPerPage
                val endIndex = (startIndex + buttonsPerPage).coerceAtMost(buttons.size)
                val pageButtons = buttons.subList(startIndex, endIndex)

                Column(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.Center,
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    for (row in 0 until filas) {
                        Row(
                            horizontalArrangement = Arrangement.Center,
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            for (col in 0 until columnas) {
                                val index = row * columnas + col
                                if (index < pageButtons.size) {
                                    val button = pageButtons[index]
                                    DeckButtonCard(
                                        label = button.label,
                                        iconUrl = button.icon,
                                        isToggle = button.toggle,
                                        isToggleOn = button.toggle && button.state == true,
                                        borderColorId = button.color,
                                        onClick = {
                                            if (button.toggle) {
                                                val newState = !(button.state ?: false)
                                                val updatedButtons = buttons.map {
                                                    if (it.id == button.id) {
                                                        it.copy(state = newState)
                                                    } else {
                                                        it
                                                    }
                                                }
                                                buttons = updatedButtons

                                                coroutineScope.launch {
                                                    try {
                                                        socket.value?.emit(
                                                            "buttonStateChanged",
                                                            JSONObject().apply {
                                                                put("id", button.id)
                                                                put("state", newState)
                                                            }
                                                        )
                                                        // Emitir evento Socket.IO para toggle-record
                                                        if (button.url == "obs/toggle-record") {
                                                            socket.value?.emit("obs-toggle-record")
                                                        } else if (button.url.startsWith("obs/")) {
                                                            // Para otras acciones OBS que aún usan HTTP GET
                                                            val openUrl = "open/${button.id}"
                                                            withContext(Dispatchers.IO) {
                                                                try {
                                                                    val url = URL("http://$serverIp:3000/$openUrl")
                                                                    url.readText()
                                                                    Log.d("HTTP", "Solicitud GET a /$openUrl completada")
                                                                } catch (e: Exception) {
                                                                    Log.e("HTTP", "Error al llamar a /$openUrl: ${e.message}")
                                                                }
                                                            }
                                                        } else {
                                                            onOpenSite(button.id, serverIp)
                                                        }
                                                    } catch (e: Exception) {
                                                        Log.e("SocketIO", "Error al emitir buttonStateChanged: ${e.message}")
                                                    }
                                                }
                                            } else {
                                                onOpenSite(button.id, serverIp)
                                            }
                                        },
                                        modifier = Modifier
                                            .size(width = buttonWidth, height = buttonHeight)
                                            .padding(buttonSpacing / 2)
                                    )
                                } else {
                                    Spacer(
                                        modifier = Modifier
                                            .size(width = buttonWidth, height = buttonHeight)
                                            .padding(buttonSpacing / 2)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}