import express from 'express';
import open from 'open';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { exec } from 'child_process';
import os from 'os';
import obs, { connectOBS,
    getOBSStatus,
    isConnected,
    connectOBSManually,
    changeScene,
    toggleRecording,
    toggleStreaming,
    toggleSource,
    takeScreenshot,
    toggleOverlay,
    setVolume,
    volumeUp,
    volumeDown,
    toggleMute,
    toggleMuteDesktop,
    togglePauseRecording  } from './obsController.js';
import multer from 'multer';
import sharp from 'sharp';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  }
});

connectOBS();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const buttonsFilePath = path.join(__dirname,'data', 'buttons.json');
const CONFIG_PATH = path.join(__dirname,'data', "deck-config.json");
const DEFAULT_CONFIG_PATH = path.join(__dirname,'data', "default-deck-config.json");
const PROFILES_PATH = path.join(__dirname,'data');
const getProfilePath = (profileName) => path.join(PROFILES_PATH, `${profileName}-profile.json`);
const getDefaultProfilePath = (profileName) => path.join(PROFILES_PATH, `default-${profileName}-profile.json`);

app.use('/icons', express.static(path.join(__dirname, 'public/icons')));

const getIPAddress = () => {
    const interfaces = os.networkInterfaces();
    for (const key in interfaces) {
        for (const iface of interfaces[key]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
};

app.get('/ip', (req, res) => {
    const ipAddress = getIPAddress();
    console.log(`\uD83D\uDCDA Dirección IP del sistema: ${ipAddress}`);
    res.send(`${ipAddress}`);
});

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.png') {
            return cb(new Error('Solo se permiten imágenes PNG'));
        }
        cb(null, true);
    }
});

app.post("/buttons/add", upload.single('icon'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No se subió ninguna imagen.");
        }

        const { label, url, toggle, color } = req.body;
        if (!label || !url) {
            return res.status(400).send("Faltan campos requeridos: label o url.");
        }

        const image = sharp(req.file.buffer);
        const metadata = await image.metadata();

        if (metadata.width !== 96 || metadata.height !== 96) {
            return res.status(400).send("La imagen debe ser exactamente de 96x96 píxeles.");
        }

        const filename = `${Date.now()}.png`;
        const outputPath = path.join(__dirname, 'public', 'icons', filename);

        await image.toFile(outputPath);

        const newButton = {
            id: Date.now().toString(),
            label,
            icon: `/icons/${filename}`,
            url,
            toggle: toggle === 'true',
            state: false,
            color: color
        };

        try {
            const data = await fs.readFile(buttonsFilePath, "utf-8");
            let buttons = [];
            try {
                buttons = JSON.parse(data);
            } catch (parseErr) {
                console.warn("Archivo JSON corrupto. Inicializando nuevo array.");
            }
            buttons.push(newButton);
            await fs.writeFile(buttonsFilePath, JSON.stringify(buttons, null, 2), "utf-8");
            res.status(200).json({ message: "Botón creado correctamente", button: newButton });
        } catch (writeErr) {
            console.error("Error guardando buttons.json:", writeErr);
            return res.status(500).send("Error al guardar el botón");
        }

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message || 'Error al procesar la imagen.');
    }
});

app.get('/open/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const data = await fs.readFile(CONFIG_PATH, 'utf8');
        const config = JSON.parse(data);
        const button = config.botones.find(b => b.id === id);

        if (!button) {
            return res.status(404).send('Botón no encontrado');
        }

        const url = button.url;

        if (url.startsWith('obs/')) {
            const parts = url.split('/');
            const obsAction = parts[1];
            const param1 = parts[2];
            const param2 = parts[3];

            switch (obsAction) {
                case 'scene':
                    await changeScene(param1);
                    return res.send('\uD83D\uDD3E Escena cambiada');
                case 'toggle-record':
                    return res.status(400).send('Esta acción ahora se maneja por Socket.IO');
                case 'pause-record':
                    await togglePauseRecording();
                    return res.send('\uD83D\uDD34 Grabación pausada');
                case 'toggle-stream':
                    await toggleStreaming();
                    return res.send('\uD83D\uDCF9 Streaming cambiado');
                case 'toggle-source':
                    if (parts.length === 4) {
                        await toggleSource(parts[2], parts[3]);
                        return res.send('\uD83D\uDCA1 Fuente activada/desactivada');
                    } else {
                        console.error(`Error: URL de toggle-source con formato incorrecto: ${url}`);
                        return res.status(400).send('URL de toggle-source con formato incorrecto');
                    }
                case 'screenshot':
                    const image = await takeScreenshot();
                    return res.send(`<img src="data:image/png;base64,${image}" />`);
                    case 'toggle-overlay':
                        if (urlParts.length === 3) {
                            const overlayName = urlParts[2];
                            await obsController.toggleOverlay(overlayName);
                            return res.send(`🖼️ Overlay "${overlayName}" alternado`);
                        } else {
                            console.error(`Error: URL de toggle-overlay con formato incorrecto: ${buttonConfig.url}`);
                            return res.status(400).send('URL de toggle-overlay con formato incorrecto');
                        }
                case 'volume':
                    await setVolume('Mic/Aux', parseFloat(param1));
                    return res.send('\uD83D\uDD0A Volumen actualizado');
                case 'volume-up':
                    await volumeUp();
                    return res.send('\uD83D\uDD09 Volumen subido');
                case 'volume-down':
                    await volumeDown();
                    return res.send('\uD83D\uDD08 Volumen bajado');
                case 'toggle-mute':
                    await toggleMute();
                    return res.send('\uD83D\uDEAB Micrófono muteado/desmuteado');
                case 'toggle-mute-desktop':
                    await toggleMuteDesktop();
                    return res.send('\uD83D\uDEAB Escritorio muteado/desmuteado');
                case 'transition':
                    return res.send(`\uD83C\uDFAB Transición cambiada a ${param1}`);
                case 'transition-duration':
                    return res.send(`\uD83D\uDD34 Duración de transición cambiada a ${param1}ms`);
                default:
                    return res.status(400).send('Acción OBS no reconocida');
            }
        } else if (url.startsWith('http')) {
            exec(`start ${url}`);
            return res.send(`\uD83D\uDCC2 Abriendo ${url}`);
        } else {
            exec(`start "" "${url}"`);
            return res.send(`\uD83D\uDCEE Ejecutando ${url}`);
        }

    } catch (error) {
        console.error(error);
        res.status(500).send('Error procesando la solicitud');
    }
});

app.get('/buttons', async (req, res) => {
    try {
        const data = await fs.readFile(buttonsFilePath, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        return res.status(500).send('Error al leer el archivo de botones');
    }
});

app.get('/deck', async (req, res) => {
    try {
        const data = await fs.readFile(CONFIG_PATH, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        return res.status(500).send('Error al leer deck-config.json');
    }
});

async function updateDeckConfig(updatedConfig) {
    try {
        await fs.writeFile(CONFIG_PATH, JSON.stringify(updatedConfig, null, 2), 'utf8');
        io.emit('deckConfigChanged', updatedConfig);
        console.log('\uD83D\uDCCB deck-config.json actualizado y emitido.');
    } catch (error) {
        console.error('\uD83D\uDCA5 Error al actualizar deck-config.json:', error);
    }
}

app.post('/deck', async (req, res) => {
    const { filas, columnas, botones } = req.body;

    if (!Array.isArray(botones)) {
        return res.status(400).json({ message: 'Los botones deben ser un arreglo' });
    }

    const deckConfig = {
        filas,
        columnas,
        botones
    };

    await updateDeckConfig(deckConfig);
    res.status(200).json({ message: 'Deck guardado correctamente' });
});

app.post('/deck/reset', async (req, res) => {
  try {
    const defaultConfigFile = await fs.readFile(DEFAULT_CONFIG_PATH, 'utf8');
    await fs.writeFile(CONFIG_PATH, defaultConfigFile, 'utf8');
    const defaultConfig = JSON.parse(defaultConfigFile);
    io.emit('deckConfigChanged', defaultConfig);
    console.log('\uD83D\uDD04 deck-config.json restablecido a los valores predeterminados y emitido.');

    const profileFiles = await fs.readdir(PROFILES_PATH);

    for (const file of profileFiles) {
      if (file.endsWith('-profile.json')) {
        const profileName = file.replace('-profile.json', '');
        const profileFile = path.join(PROFILES_PATH, file);
        const defaultProfileFile = getDefaultProfilePath(profileName);

        try {
          const defaultProfileContent = await fs.readFile(defaultProfileFile, 'utf8');
          await fs.writeFile(profileFile, defaultProfileContent, 'utf8');
          console.log(`\uD83D\uDD04 Perfil "${profileName}" restablecido a sus valores predeterminados.`);
        } catch (error) {
          if (error.code === 'ENOENT') {
            console.warn(`\uD83D\uDCA5 No se encontró el respaldo predeterminado para el perfil "${profileName}".`);
          } else {
            console.error(`\uD83D\uDCA5 Error al restablecer el perfil "${profileName}":`, error);
          }
        }
      }
    }

    res.json({ message: 'Configuración del deck y todos los perfiles restablecidos a los valores predeterminados' });

  } catch (error) {
    console.error('\uD83D\uDCA5 Error al restablecer la configuración general o los perfiles:', error);
    res.status(500).json({ message: 'Error al restablecer la configuración' });
  }
});

app.post('/reset/:profileName', async (req, res) => {
  const { profileName } = req.params;
  const profileFile = getProfilePath(profileName);
  const defaultProfileFile = getDefaultProfilePath(profileName);

  try {
    const defaultProfileContent = await fs.readFile(defaultProfileFile, 'utf8');

    await fs.writeFile(profileFile, defaultProfileContent, 'utf8');

    const profileConfig = JSON.parse(defaultProfileContent);
    io.emit('deckConfigChanged', profileConfig); 

    res.json({ message: `El perfil "${profileName}" ha sido restablecido a sus valores predeterminados.` });

  } catch (error) {
    console.error(`Error al restablecer el perfil "${profileName}":`, error);
    res.status(500).json({ message: `Error al restablecer el perfil "${profileName}".` });
  }
});

app.post('/deck/profiles/save/:profileName', async (req, res) => {
    const { profileName } = req.params;
    const profilePath = getProfilePath(profileName);
    const currentConfig = req.body;

    console.log('Ruta de guardado activada para el perfil:', profileName);
    console.log('Ruta de guardado - Configuración recibida:', currentConfig);

    try {
        await fs.writeFile(profilePath, JSON.stringify(currentConfig, null, 2), 'utf8');
        console.log(`\uD83D\uDCCB Configuración actual guardada en el perfil ${profileName}.`);
        res.json({ message: `Configuración guardada en el perfil ${profileName}` });
    } catch (error) {
        console.error(`\uD83D\uDCA5 Error al guardar la configuración en el perfil ${profileName}:`, error);
        res.status(500).json({ message: `Error al guardar la configuración en el perfil ${profileName}` });
    }
});

app.post('/deck/profiles/load/:profileName', async (req, res) => {
    const { profileName } = req.params;
    const profilePath = getProfilePath(profileName);

    try {
        const profileConfigFile = await fs.readFile(profilePath, 'utf8');
        await fs.writeFile(CONFIG_PATH, profileConfigFile, 'utf8');
        const profileConfig = JSON.parse(profileConfigFile);
        io.emit('deckConfigChanged', profileConfig);
        console.log(`\uD83D\uDD04 deck-config.json cargado con el perfil ${profileName} y emitido.`);
        res.json({ message: `Configuración cargada desde el perfil ${profileName}` });
    } catch (error) {
        console.error(`\uD83D\uDCA5 Error al cargar el perfil ${profileName}:`, error);
        res.status(500).json({ message: `Error al cargar el perfil ${profileName}` });
    }
});

app.delete('/buttons/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const data = await fs.readFile(buttonsFilePath, 'utf-8');
        let buttons;
        try {
            buttons = JSON.parse(data);
        } catch (parseErr) {
            console.error('\uD83D\uDCCB Error parseando buttons.json:', parseErr);
            return res.status(500).json({ message: 'Error procesando datos' });
        }

        const buttonToDelete = buttons.find(b => b.id === id);

        if (!buttonToDelete) {
            return res.status(404).json({ message: 'Botón no encontrado' });
        }

        if (!/^\d+$/.test(buttonToDelete.id)) {
            return res.status(400).json({ message: 'Solo se pueden eliminar botones con ID tipo timestamp' });
        }

        if (buttonToDelete.icon) {
            const iconPath = path.join(__dirname, 'public', buttonToDelete.icon);
            try {
                await fs.unlink(iconPath);
            } catch (unlinkErr) {
                if (unlinkErr.code !== 'ENOENT') {
                    console.warn('\uD83D\uDCA1 No se pudo borrar el icono:', unlinkErr);
                }
            }
        }

        const filtered = buttons.filter(b => b.id !== id);
        await fs.writeFile(buttonsFilePath, JSON.stringify(filtered, null, 2), 'utf-8');
        res.json({ message: 'Botón con ID tipo timestamp eliminado correctamente' });

    } catch (err) {
        console.error('\uD83D\uDCCB Error al leer/escribir buttons.json:', err);
        return res.status(500).json({ message: 'Error al procesar la eliminación del botón' });
    }
});

async function readDeckConfigAndEmit(socket) {
    try {
        const data = await fs.readFile(CONFIG_PATH, 'utf-8');
        socket.emit('deckConfigChanged', JSON.parse(data));
    } catch (error) {
        console.error('Error al leer deck-config.json:', error);
    }
}

fs.watch(CONFIG_PATH, async (eventType, filename) => {
    if (filename) {
        console.log(`\uD83D\uDD04 El archivo ${filename} ha cambiado (${eventType})`);
        try {
            const data = await fs.readFile(CONFIG_PATH, 'utf-8');
            io.emit('deckConfigChanged', JSON.parse(data));
        } catch (err) {
            console.error('Error al leer y emitir deck-config.json:', err);
        }
    }
});

io.on('connection', (socket) => {
    console.log('\uD83D\uDD34 Cliente conectado');
    readDeckConfigAndEmit(socket);

    socket.on('disconnect', () => {
        console.log('\uD83D\uDD34 Cliente desconectado');
    });

    socket.on('buttonStateChanged', async (data) => {
        const { id, state } = data;
        console.log(`\uD83D\uDD04 Recibido cambio de estado para el botón ${id}: ${state}`);

        try {
            const configData = await fs.readFile(CONFIG_PATH, 'utf-8');
            const config = JSON.parse(configData);
            const buttonIndex = config.botones.findIndex(button => button.id === id);

            if (buttonIndex !== -1 && config.botones[buttonIndex].toggle) {
                config.botones[buttonIndex].state = state;
                await updateDeckConfig(config);
            } else {
                console.warn(`\uD83D\uDCCB Botón con ID ${id} no encontrado o no es un toggle.`);
            }
        } catch (error) {
            console.error('\uD83D\uDCA5 Error al actualizar el estado del botón en deck-config.json:', error);
        }
    });

    socket.on('obs-toggle-record', async () => {
        console.log('\uD83D\uDCFA Solicitud de toggle de grabación recibida vía Socket.IO');
        try {
            await toggleRecording();
            const recordingStatus = { recording: obs.isRecording };
            console.log('Emitiendo recordingStatus:', recordingStatus);
            io.emit('recordingStatus', recordingStatus);
        } catch (error) {
            console.error('Error al togglear la grabación:', error);
            socket.emit('obsError', { message: 'Error al togglear la grabación' });
        }
    });
    
});

app.get('/obs/status', async (req, res) => {
  res.json({ connected: isConnected });
});

app.post('/obs/connect', async (req, res) => {
  const { port, password } = req.body;
  const connected = await connectOBSManually(port, password);
  res.json({ connected });
});

httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});