package com.example.debkboard

import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.example.debkboard.ui.theme.DebkboardTheme
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.net.HttpURLConnection
import java.net.URL

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        WindowCompat.setDecorFitsSystemWindows(window, false)
        val controller = WindowInsetsControllerCompat(window, window.decorView)
        controller.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        controller.hide(WindowInsetsCompat.Type.systemBars())
        super.onCreate(savedInstanceState)
        setContent {
            DebkboardTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    var ipInput by remember { mutableStateOf("") }
                    var errorMessage by remember { mutableStateOf<String?>(null) }
                    var isLoading by remember { mutableStateOf(false) }

                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(32.dp),
                        verticalArrangement = Arrangement.Center,
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text("🔌 Ingrese la IP del servidor", style = MaterialTheme.typography.headlineMedium)
                        Spacer(modifier = Modifier.height(24.dp))

                        OutlinedTextField(
                            value = ipInput,
                            onValueChange = { ipInput = it },
                            label = { Text("Ejemplo: 192.168.1.100") },
                            singleLine = true,
                            isError = errorMessage != null,
                            modifier = Modifier.fillMaxWidth()
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        Button(
                            onClick = {
                                errorMessage = null
                                isLoading = true
                                CoroutineScope(Dispatchers.IO).launch {
                                    try {
                                        val url = URL("http://$ipInput:3000/deck")
                                        val connection = url.openConnection() as HttpURLConnection
                                        connection.requestMethod = "GET"
                                        connection.connectTimeout = 3000
                                        connection.readTimeout = 3000

                                        val responseCode = connection.responseCode
                                        connection.disconnect()

                                        if (responseCode == 200) {
                                            // IP válida, navegar al DeckboardActivity
                                            startActivity(
                                                Intent(this@MainActivity, DeckboardActivity::class.java)
                                                    .putExtra("serverIp", ipInput)
                                            )
                                        } else {
                                            errorMessage = "Introduce una IP válida"
                                        }
                                    } catch (e: Exception) {
                                        Log.e("MainActivity", "❌ Error de conexión: $e")
                                        errorMessage = "Introduce una IP válida"
                                    }
                                    isLoading = false
                                }
                            },
                            enabled = !isLoading
                        ) {
                            Text("Conectar")
                        }

                        if (errorMessage != null) {
                            Spacer(modifier = Modifier.height(12.dp))
                            Text(errorMessage!!, color = Color.Red)
                        }

                        if (isLoading) {
                            Spacer(modifier = Modifier.height(12.dp))
                            CircularProgressIndicator()
                        }
                    }
                }
            }
        }
    }
}
