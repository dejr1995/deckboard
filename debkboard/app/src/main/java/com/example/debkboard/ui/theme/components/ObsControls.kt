// ObsControls.kt
package com.example.debkboard.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.debkboard.network.ObsRemoteController

@Composable
fun ObsControls(serverIp: String) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Button(onClick = { ObsRemoteController.changeScene(serverIp, "Escena1") }) {
            Text("Cambiar a Escena1")
        }
        Spacer(modifier = Modifier.height(8.dp))
        Button(onClick = { ObsRemoteController.toggleRecording(serverIp) }) {
            Text("Toggle Grabación")
        }
        Spacer(modifier = Modifier.height(8.dp))
        Button(onClick = { ObsRemoteController.toggleStreaming(serverIp) }) {
            Text("Toggle Streaming")
        }
        Spacer(modifier = Modifier.height(8.dp))
        Button(onClick = { ObsRemoteController.toggleSource(serverIp, "Escena1", "Mic") }) {
            Text("Toggle Fuente Mic")
        }
        Spacer(modifier = Modifier.height(8.dp))
        Button(onClick = { ObsRemoteController.toggleOverlay(serverIp, "Overlay1") }) {
            Text("Toggle Overlay")
        }
        Spacer(modifier = Modifier.height(8.dp))
        Button(onClick = { ObsRemoteController.setVolume(serverIp, "Mic", 0.5) }) {
            Text("Volumen Mic 50%")
        }
        Spacer(modifier = Modifier.height(8.dp))
        Button(onClick = { ObsRemoteController.takeScreenshot(serverIp) }) {
            Text("Tomar Screenshot")
        }
    }
}
