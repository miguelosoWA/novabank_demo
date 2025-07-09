# Insight Banking by Sofka - Asistente Virtual

## Descripción
Insight Banking by Sofka es una aplicación bancaria que incluye un asistente virtual interactivo. El asistente utiliza la API de OpenAI Realtime para generar un avatar virtual que puede comunicarse con los usuarios a través de voz y texto en tiempo real.

## Características Principales

### Asistente Virtual
- Avatar virtual con comunicación en tiempo real
- Reconocimiento de voz en tiempo real
- Respuestas en lenguaje natural usando OpenAI GPT-4
- Navegación contextual basada en la conversación
- Sistema de logging detallado para monitoreo y depuración
- Conexión WebRTC para comunicación de baja latencia

### Tecnologías Utilizadas
- **Frontend**: Next.js 14 con App Router
- **Estilos**: Tailwind CSS
- **Animaciones**: Framer Motion
- **Avatar**: OpenAI Realtime API
- **Voz**: OpenAI Realtime API
- **IA**: OpenAI GPT-4
- **Comunicación**: WebRTC

## Configuración del Proyecto

### Requisitos Previos
- Node.js 18.17 o superior
- Cuenta en OpenAI con acceso a Realtime API

### Variables de Entorno
Crear un archivo `.env.local` con las siguientes variables:
```env
# OpenAI
OPENAI_API_KEY=tu_api_key_de_openai
```

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
- **RealtimeAgent**: Logging de conexión WebRTC y streaming
- **VoiceRecognition**: Logging de reconocimiento de voz

### Visualización de Logs
Los logs se pueden ver en la consola del navegador (F12) y están categorizados por componente:
```
[VirtualAgent] ℹ️ Mensaje de información
[RealtimeAgent] ❌ Error en conexión
[VoiceRecognition] ✅ Voz reconocida
```

## API de OpenAI Realtime

El proyecto utiliza la API de OpenAI Realtime para generar el avatar virtual:

### Características
- Streaming en tiempo real con WebRTC
- Comunicación de voz bidireccional
- Respuestas en lenguaje natural
- Manejo de errores robusto
- Reconexión automática
- Tokens ephemeral para seguridad

### Configuración
```typescript
const model = "gpt-4o-realtime-preview-2025-06-03"
const voice = "alloy" // También disponible: 'echo', 'fable', 'onyx', 'nova', 'shimmer'
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