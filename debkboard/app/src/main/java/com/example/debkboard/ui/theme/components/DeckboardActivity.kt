// DeckboardActivity.kt
package com.example.debkboard

import android.content.pm.ActivityInfo
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.example.debkboard.ui.DeckboardScreen
import com.example.debkboard.ui.theme.DebkboardTheme
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.net.HttpURLConnection
import java.net.URL

class DeckboardActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        WindowCompat.setDecorFitsSystemWindows(window, false)
        val controller = WindowInsetsControllerCompat(window, window.decorView)
        controller.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        controller.hide(WindowInsetsCompat.Type.systemBars())
        super.onCreate(savedInstanceState)

        // 👉 Forzamos modo horizontal
        requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE

        val ip = intent.getStringExtra("serverIp") ?: ""

        setContent {
            DebkboardTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    DeckboardScreen(serverIp = ip) { site, ip ->
                        openSite(site, ip)
                    }
                }
            }
        }
    }

    private fun openSite(site: String, ip: String) {
        val url = "http://$ip:3000/open/$site"
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val connection = URL(url).openConnection() as HttpURLConnection
                connection.requestMethod = "GET"
                val responseCode = connection.responseCode
                connection.disconnect()

                if (responseCode == 200) {
                    Log.d("Deckboard", "✅ $site abierto")
                } else {
                    Log.e("Deckboard", "❌ Código $responseCode al abrir $site")
                }
            } catch (e: Exception) {
                Log.e("Deckboard", "❌ Error de conexión: $e")
            }
        }
    }
}
