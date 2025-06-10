// ObsRemoteController.kt
package com.example.debkboard.network

import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody

object ObsRemoteController {
    private val client = OkHttpClient()

    private fun getRequest(url: String, onResult: (Boolean, String?) -> Unit) {
        val request = Request.Builder().url(url).build()
        CoroutineScope(Dispatchers.IO).launch {
            try {
                client.newCall(request).execute().use { response ->
                    if (response.isSuccessful) {
                        onResult(true, response.body?.string())
                    } else {
                        onResult(false, "Código: ${response.code}")
                    }
                }
            } catch (e: Exception) {
                Log.e("ObsRemote", "Error en GET: ${e.message}")
                onResult(false, e.message)
            }
        }
    }

    private fun postRequest(url: String, jsonBody: String, onResult: (Boolean, String?) -> Unit) {
        val mediaType = "application/json".toMediaType()
        val body = jsonBody.toRequestBody(mediaType)
        val request = Request.Builder().url(url).post(body).build()
        CoroutineScope(Dispatchers.IO).launch {
            try {
                client.newCall(request).execute().use { response ->
                    if (response.isSuccessful) {
                        onResult(true, response.body?.string())
                    } else {
                        onResult(false, "Código: ${response.code}")
                    }
                }
            } catch (e: Exception) {
                Log.e("ObsRemote", "Error en POST: ${e.message}")
                onResult(false, e.message)
            }
        }
    }

    // Cambiar escena
    fun changeScene(serverIp: String, sceneName: String) {
        val url = "http://$serverIp:3000/obs/scene/$sceneName"
        getRequest(url) { success, result ->
            if (success) Log.d("ObsRemote", "Escena cambiada a $sceneName: $result")
            else Log.e("ObsRemote", "Error al cambiar escena: $result")
        }
    }

    // Toggle grabación
    fun toggleRecording(serverIp: String) {
        val url = "http://$serverIp:3000/obs/toggle-record"
        getRequest(url) { success, result ->
            if (success) Log.d("ObsRemote", "Grabación toggled: $result")
            else Log.e("ObsRemote", "Error en toggle grabación: $result")
        }
    }

    // Toggle streaming
    fun toggleStreaming(serverIp: String) {
        val url = "http://$serverIp:3000/obs/toggle-stream"
        getRequest(url) { success, result ->
            if (success) Log.d("ObsRemote", "Streaming toggled: $result")
            else Log.e("ObsRemote", "Error en toggle streaming: $result")
        }
    }

    // Toggle fuente
    fun toggleSource(serverIp: String, sceneName: String, sourceName: String) {
        val url = "http://$serverIp:3000/obs/toggle-source/$sceneName/$sourceName"
        getRequest(url) { success, result ->
            if (success) Log.d("ObsRemote", "Fuente '$sourceName' en '$sceneName' toggled: $result")
            else Log.e("ObsRemote", "Error toggling source: $result")
        }
    }

    // Toggle overlay
    fun toggleOverlay(serverIp: String, overlayName: String) {
        val url = "http://$serverIp:3000/obs/toggle-overlay/$overlayName"
        getRequest(url) { success, result ->
            if (success) Log.d("ObsRemote", "Overlay '$overlayName' toggled: $result")
            else Log.e("ObsRemote", "Error toggling overlay: $result")
        }
    }

    // Ajustar volumen (0.0 a 1.0)
    fun setVolume(serverIp: String, source: String, level: Double) {
        val url = "http://$serverIp:3000/obs/volume"
        val jsonBody = """
            {
              "source": "$source",
              "level": $level
            }
        """.trimIndent()
        postRequest(url, jsonBody) { success, result ->
            if (success) Log.d("ObsRemote", "Volumen ajustado en '$source': $result")
            else Log.e("ObsRemote", "Error ajustando volumen: $result")
        }
    }

    // Tomar screenshot
    fun takeScreenshot(serverIp: String) {
        val url = "http://$serverIp:3000/obs/screenshot"
        getRequest(url) { success, result ->
            if (success) {
                Log.d("ObsRemote", "Screenshot obtenido: $result")
                // Aquí podrías convertir el base64 a una imagen y mostrarla
            } else Log.e("ObsRemote", "Error obteniendo screenshot: $result")
        }
    }
}
