## README para Deckboard

Aquí tienes un README completo basado en la arquitectura y componentes del sistema:

```markdown
# Deckboard

Sistema de control remoto multi-plataforma para OBS Studio con interfaz de botones personalizable.

## Descripción

Deckboard es una solución completa que permite controlar OBS Studio y otras aplicaciones a través de una
interfaz de botones personalizable. El sistema consta de tres componentes principales:

- **Cliente Android**: Interfaz principal para activar acciones
- **Interfaz Web de Administración**: Panel de configuración y gestión
- **Servidor Node.js**: Backend que coordina la comunicación y se integra con OBS Studio

## Características

### Control de OBS Studio
- Iniciar/detener grabación y streaming
- Cambio de escenas
- Control de fuentes y overlays
- Gestión de audio y volumen

### Interfaz Personalizable
- Grillas de botones configurables (hasta 4x8)
- Botones con iconos personalizados
- Múltiples perfiles (trabajo, streaming, gaming)
- Colores y temas personalizables

### Tipos de Acciones
- **URLs**: Abrir páginas web
- **Archivos**: Ejecutar aplicaciones locales  
- **OBS**: Controles específicos de OBS Studio

## Arquitectura del Sistema

```
![image](https://github.com/user-attachments/assets/638e6ace-6480-4668-9ed2-cc45df769a54)

```

## Instalación

### Requisitos
- Node.js 16+
- Android Studio (para el cliente móvil)
- OBS Studio con WebSocket habilitado

### Servidor
```bash
cd Server
npm install
npm start
```

### Interfaz Web
```bash
cd deckboard-shadcnl
npm install
npm run dev
```

### Cliente Android
1. Abrir el proyecto `debkboard` en Android Studio
2. Compilar e instalar en dispositivo Android

## Configuración

### Perfiles del Sistema
El sistema soporta múltiples perfiles de configuración

- `work-profile.json`: Configuración para trabajo
- `streaming-profile.json`: Configuración para streaming  
- `gaming-profile.json`: Configuración para gaming

### Gestión de Botones
Los botones se configuran a través de la interfaz web y se almacenan en `buttons.json`. Cada botón puede tener:

- Etiqueta personalizada
- Icono (imagen PNG)
- Color de borde
- Tipo de acción (URL, archivo, OBS)
- Estado toggle para acciones que requieren activación/desactivación

## API del Servidor

### Endpoints Principales
- `GET /deck` - Obtener configuración activa
- `POST /deck` - Actualizar configuración
- `GET /buttons` - Obtener catálogo de botones
- `POST /buttons/add` - Agregar nuevo botón
- `GET /open/:id` - Ejecutar acción de botón

### Comunicación en Tiempo Real
El sistema utiliza Socket.IO para sincronización en tiempo real entre clientes y servidor.

## Tecnologías Utilizadas

### Frontend
- **Android**: Kotlin + Jetpack Compose
- **Web**: React + Vite + Tailwind CSS + shadcn/ui

### Backend  
- **Servidor**: Node.js + Express + Socket.IO
- **Integración OBS**: obs-websocket-js
- **Procesamiento de Imágenes**: Sharp

## Contribuir

1. Fork el repositorio
2. Crear rama para nueva característica
3. Commit de cambios
4. Push a la rama
5. Crear Pull Request


```

## Notes

Este README está basado en la arquitectura real del sistema según se observa en los archivos de código. El sistema
implementa una arquitectura de tres capas con comunicación en tiempo real a través de Socket.IO y una API REST para la
gestión de configuraciones. La estructura de perfiles y la gestión de botones están implementadas según se muestra en
los componentes de administración web.
