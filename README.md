# Insight Banking by Sofka - Asistente Virtual

## Descripción
Insight Banking by Sofka es una aplicación bancaria que incluye un asistente virtual interactivo. El asistente puede utilizar tanto Google Gemini Live Audio como OpenAI Realtime API para generar respuestas de voz en tiempo real que pueden comunicarse con los usuarios a través de voz y texto.

## Características Principales

### Asistente Virtual
- **Doble Implementación**: Google Gemini Live Audio y OpenAI Realtime API
- Respuestas de voz en tiempo real
- Reconocimiento de voz integrado
- Respuestas en lenguaje natural
- Navegación contextual basada en la conversación
- Sistema de logging detallado para monitoreo y depuración
- Selector de agente virtual en tiempo real

### Tecnologías Utilizadas
- **Frontend**: Next.js 14 con App Router
- **Estilos**: Tailwind CSS
- **Animaciones**: Framer Motion
- **Voz y IA**: Google Gemini Live Audio + OpenAI Realtime API
- **Procesamiento**: OpenAI GPT-4
- **WebRTC**: Para conexión en tiempo real con OpenAI

## Configuración del Proyecto

### Requisitos Previos
- Node.js 18.17 o superior
- Cuenta en Google AI Studio (Gemini)
- Cuenta en OpenAI

### Variables de Entorno
Crear un archivo `.env.local` con las siguientes variables:
```env
# Google Gemini API (para Gemini Live Audio)
GEMINI_API_KEY=tu_api_key_de_gemini

# OpenAI API (para Realtime API y GPT-4)
OPENAI_API_KEY=tu_api_key_de_openai
```

**Nota**: Para usar OpenAI Realtime API, necesitas acceso al modelo `gpt-4o-realtime-preview-2025-06-03`.

### Instalación
1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/Insight Banking by Sofka.git
cd Insight Banking by Sofka
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

## Estructura del Proyecto

```
novabank/
├── app/                    # Rutas y páginas principales
├── components/            # Componentes reutilizables
│   ├── presentation/     # Componentes de UI
│   └── ui/              # Componentes de UI básicos
├── lib/                  # Utilidades y configuraciones
├── public/              # Archivos estáticos
└── styles/              # Estilos globales
```

## Sistema de Logging

El proyecto implementa un sistema de logging detallado para facilitar el monitoreo y la depuración:

### Niveles de Log
- **INFO** (ℹ️): Información general del sistema
- **ERROR** (❌): Errores y excepciones
- **WARN** (⚠️): Advertencias y situaciones inesperadas
- **DEBUG** (🔍): Información detallada para depuración
- **SUCCESS** (✅): Operaciones exitosas

### Componentes con Logging
- **VirtualAgent**: Logging de interacciones y estado
- **GeminiVirtualAgent**: Logging de conexión y streaming
- **OpenAIVirtualAgent**: Logging de WebRTC y eventos en tiempo real
- **VoiceRecognition**: Logging de reconocimiento de voz (integrado en Gemini)

### Visualización de Logs
Los logs se pueden ver en la consola del navegador (F12) y están categorizados por componente:
```
[VirtualAgent] ℹ️ Mensaje de información
[GeminiVirtualAgent] ❌ Error en conexión
[VoiceRecognition] ✅ Voz reconocida
```

## Implementaciones de Asistente Virtual

### 1. Google Gemini Live Audio

El proyecto utiliza Google Gemini Live Audio para generar respuestas de voz en tiempo real:

#### Características
- Streaming de audio en tiempo real
- Reconocimiento de voz integrado
- Respuestas de voz naturales
- Manejo de errores robusto
- Reconexión automática
- Sistema de cola de respuestas

#### Configuración
```typescript
const model = 'gemini-2.5-flash-preview-native-audio-dialog'
const voiceConfig = { prebuiltVoiceConfig: { voiceName: 'Orus' } }
const languageCode = 'es-ES'
```

### 2. OpenAI Realtime API

Implementación alternativa usando OpenAI Realtime API con WebRTC:

#### Características
- Conexión WebRTC para baja latencia
- Tokens efímeros para seguridad
- Audio en tiempo real bidireccional
- Manejo de eventos en tiempo real
- Integración con GPT-4o Realtime

#### Configuración
```typescript
const model = 'gpt-4o-realtime-preview-2025-06-03'
const voice = 'alloy'
```

#### Endpoints
- `/api/openai/realtime-session`: Genera tokens efímeros
- WebRTC directo con OpenAI Realtime API

### Selector de Agente

El componente `VirtualAgentSelector` permite cambiar entre ambas implementaciones en tiempo real:

```typescript
<VirtualAgentSelector
  apiKey={process.env.GEMINI_API_KEY}
  onStreamReady={handleStreamReady}
  onStreamError={handleStreamError}
/>
```

## Contribución
1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## Contacto
Tu Nombre - [@tutwitter](https://twitter.com/tutwitter) - email@ejemplo.com

Link del Proyecto: [https://github.com/tu-usuario/novabank](https://github.com/tu-usuario/novabank) 