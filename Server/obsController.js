import OBSWebSocket from 'obs-websocket-js';

const obs = new OBSWebSocket();
export let isConnected = false;

export async function connectOBS(port, password) {
  try {
    await obs.connect(`ws://localhost:${port}`, password);
    isConnected = true;
    const { obsWebSocketVersion, rpcVersion } = await obs.call('GetVersion');
    console.log(`✅ Conectado a OBS WebSocket v${obsWebSocketVersion} (RPC v${rpcVersion})`);
    const inputs = await obs.call('GetInputList');
    console.log('Entradas disponibles:', inputs.inputs.map(i => i.inputName));
  } catch (error) {
    isConnected = false;
    console.error('❌ Error al conectar a OBS:', error.message);
  }
}

export async function connectOBSManually(port, password) {
  await connectOBS(port, password);
  return isConnected; 
}

export async function getOBSStatus() {
  return isConnected;
}


export async function changeScene(sceneName) {
    if (!isConnected) {
        console.warn('⚠️ No conectado a OBS. No se puede cambiar la escena.');
        return;
    }
    try {
        await obs.call('SetCurrentProgramScene', { sceneName });
        console.log(`🎬 Escena cambiada a: ${sceneName}`);
    } catch (error) {
        console.error('🔴 Error al cambiar la escena:', error.message);
    }
}

export async function getRecordStatus() {
    if (!isConnected) {
        console.warn('⚠️ No conectado a OBS. No se puede obtener el estado de grabación.');
        return null;
    }
    try {
        const { outputActive, outputPaused } = await obs.call('GetRecordStatus');
        return { isRecording: outputActive, isPaused: outputPaused };
    } catch (error) {
        console.error('🔴 Error al obtener el estado de grabación:', error.message);
        return null;
    }
}

export async function toggleRecording() {
    if (!isConnected) {
        console.warn('⚠️ No conectado a OBS. No se puede alternar la grabación.');
        return;
    }
    try {
        const { outputActive } = await obs.call('GetRecordStatus');
        await obs.call(outputActive ? 'StopRecord' : 'StartRecord');
        console.log(`🔴 Grabación ${outputActive ? 'detenida' : 'iniciada'}`);
    } catch (error) {
        console.error('🔴 Error al alternar la grabación:', error.message);
    }
}

export async function togglePauseRecording() {
    if (!isConnected) {
        console.warn('⚠️ No conectado a OBS. No se puede alternar la pausa de grabación.');
        return;
    }
    try {
        const { outputActive, outputPaused } = await obs.call('GetRecordStatus');
        if (outputActive) {
            await obs.call(outputPaused ? 'ResumeRecord' : 'PauseRecord');
            console.log(`⏸️ Grabación ${outputPaused ? 'reanudada' : 'pausada'}`);
        } else {
            console.log('⚠️ La grabación no está activa. No se puede pausar/reanudar.');
        }
    } catch (error) {
        console.error('🔴 Error al alternar la pausa de grabación:', error.message);
    }
}

export async function toggleStreaming() {
    if (!isConnected) {
        console.warn('⚠️ No conectado a OBS. No se puede alternar el streaming.');
        return;
    }
    try {
        const { outputActive } = await obs.call('GetStreamStatus');
        await obs.call(outputActive ? 'StopStream' : 'StartStream');
        console.log(`🔴 Streaming ${outputActive ? 'detenido' : 'iniciado'}`);
    } catch (error) {
        console.error('🔴 Error al alternar el streaming:', error.message);
    }
}

export async function toggleSource(sceneName, sourceName) {
    console.log(`ℹ️ toggleSource llamada con escena: "${sceneName}", fuente: "${sourceName}"`);
    if (!isConnected) {
        console.warn('⚠️ No conectado a OBS. No se puede alternar la visibilidad de la fuente.');
        return;
    }
    try {
        const { sceneItemId } = await obs.call('GetSceneItemId', {
            sceneName: sceneName,
            sceneItemName: sourceName
        });

        await obs.call('SetSceneItemEnabled', {
            sceneItemId: sceneItemId,
            sceneItemEnabled: ! (await obs.call('GetSceneItemEnabled', { sceneItemId: sceneItemId })).sceneItemEnabled
        });

        console.log(`👁️‍🗨️ Fuente "${sourceName}" (ID: ${sceneItemId}) en escena "${sceneName}" alternada`);

    } catch (error) {
        console.error(`🔴 Error al alternar la visibilidad de la fuente "${sourceName}" en la escena "${sceneName}":`, error);
    }
}

export async function takeScreenshot() {
    if (!isConnected) {
        console.warn('⚠️ No conectado a OBS. No se puede tomar una captura de pantalla.');
        return null;
    }
    try {
        const { imageData } = await obs.call('TakeSourceScreenshot', { sourceName: 'Program Output', imageFormat: 'png', imageCompressionQuality: -1 });
        console.log('📸 Captura de pantalla tomada.');
        return imageData;
    } catch (error) {
        console.error('🔴 Error al tomar la captura de pantalla:', error.message);
        return null;
    }
}

export async function toggleOverlay(overlayName) {
    if (!isConnected) {
        console.warn('⚠️ No conectado a OBS. No se puede alternar el overlay.');
        return;
    }
    try {
        const currentSceneInfo = await obs.call('GetCurrentProgramScene');
        if (currentSceneInfo && currentSceneInfo.sceneName) {
            try {
                const { sceneItemId } = await obs.call('GetSceneItemId', {
                    sceneName: currentSceneInfo.sceneName,
                    sceneItemName: overlayName
                });

                const { sceneItemEnabled } = await obs.call('GetSceneItemEnabled', {
                    sceneItemId: sceneItemId,
                    sceneName: currentSceneInfo.sceneName
                });

                await obs.call('SetSceneItemEnabled', {
                    sceneItemId: sceneItemId,
                    sceneName: currentSceneInfo.sceneName,
                    sceneItemEnabled: !sceneItemEnabled
                });

                console.log(`🖼️ Overlay "${overlayName}" en escena "${currentSceneInfo.sceneName}" ${!sceneItemEnabled ? 'mostrado' : 'oculto'}`);

            } catch (error) {
                console.error(`🔴 Error al obtener o establecer el estado del overlay "${overlayName}":`, error);
            }
        } else {
            console.warn('⚠️ No se pudo obtener la escena actual para alternar el overlay.');
        }
    } catch (error) {
        console.error(`🔴 Error al intentar alternar el overlay "${overlayName}":`, error);
    }
}

export async function setVolume(sourceName, volumeLevel) {
    if (!isConnected) {
        console.warn('⚠️ No conectado a OBS. No se puede ajustar el volumen.');
        return;
    }
    try {
        await obs.call('SetInputVolume', { inputName: sourceName, inputVolumeMul: volumeLevel });
        console.log(`🔊 Volumen de "${sourceName}" ajustado a: ${volumeLevel}`);
    } catch (error) {
        console.error(`🔴 Error al ajustar el volumen de "${sourceName}":`, error.message);
    }
}

export async function volumeUp() {
    if (!isConnected) {
        console.warn('⚠️ No conectado a OBS. No se puede subir el volumen.');
        return;
    }
    try {
        const { inputVolumeMul } = await obs.call('GetInputVolume', { inputName: 'Mic/Aux' });
        const newVolume = Math.min(1.0, inputVolumeMul + 0.05); 
        await obs.call('SetInputVolume', { inputName: 'Mic/Aux', inputVolumeMul: newVolume });
        console.log(`🔊 Volumen de "Mic/Aux" subido a: ${newVolume}`);
    } catch (error) {
        console.error('🔴 Error al subir el volumen:', error.message);
    }
}

export async function volumeDown() {
    if (!isConnected) {
        console.warn('⚠️ No conectado a OBS. No se puede bajar el volumen.');
        return;
    }
    try {
        const { inputVolumeMul } = await obs.call('GetInputVolume', { inputName: 'Mic/Aux' });
        const newVolume = Math.max(0.0, inputVolumeMul - 0.05); 
        await obs.call('SetInputVolume', { inputName: 'Mic/Aux', inputVolumeMul: newVolume });
        console.log(`🔊 Volumen de "Mic/Aux" bajado a: ${newVolume}`);
    } catch (error) {
        console.error('🔴 Error al bajar el volumen:', error.message);
    }
}

export async function toggleMute(sourceName = 'Mic/Aux') {
    if (!isConnected) {
        console.warn('⚠️ No conectado a OBS. No se puede alternar el muteo de la entrada.');
        return;
    }
    try {
        const { inputMuted } = await obs.call('GetInputMute', { inputName: sourceName });
        await obs.call('SetInputMute', { inputName: sourceName, inputMuted: !inputMuted });
        console.log(`🔇 "${sourceName}" ${inputMuted ? 'desmuteado' : 'muteado'}`);
    } catch (error) {
        console.error(`🔴 Error al alternar el muteo de "${sourceName}":`, error.message);
    }
}

export async function toggleMuteDesktop() {

    const possibleDesktopSources = ['Desktop Audio', 'Audio del escritorio'];

    if (!isConnected) {
        console.warn('⚠️ No conectado a OBS. No se puede alternar el muteo del escritorio.');
        return;
    }

    for (const sourceName of possibleDesktopSources) {
        try {
            const { inputMuted } = await obs.call('GetInputMute', { inputName: sourceName });
            await obs.call('SetInputMute', { inputName: sourceName, inputMuted: !inputMuted });
            console.log(`🔇 "${sourceName}" (Escritorio) ${inputMuted ? 'desmuteado' : 'muteado'}`);
            return; 
        } catch (error) {
            
            if (error.code !== '404') {
                console.error(`🔴 Error al alternar el muteo de "${sourceName}" (Escritorio):`, error.message);
            }
        }
    }
    console.warn('⚠️ No se encontró una fuente de audio de escritorio común para mutear/desmutear.');
}

obs.on('ConnectionClosed', () => {
  isConnected = false;
  console.log('🔌 Conexión a OBS cerrada. Intentando reconectar en 5 segundos...');
  setTimeout(() => {

  }, 5000);
});

obs.on('error', err => {
  console.error('⚠️ WebSocket error:', err);
});

export default obs;
