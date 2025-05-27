# SofkaBank - Asistente Virtual

## Descripción
SofkaBank es una aplicación bancaria que incluye un asistente virtual interactivo. El asistente utiliza la API de D-ID para generar un avatar animado que puede comunicarse con los usuarios a través de voz y texto.

## Características Principales

### Asistente Virtual
- Avatar animado con expresiones faciales realistas
- Reconocimiento de voz en tiempo real
- Respuestas en lenguaje natural
- Navegación contextual basada en la conversación
- Sistema de logging detallado para monitoreo y depuración

### Tecnologías Utilizadas
- **Frontend**: Next.js 14 con App Router
- **Estilos**: Tailwind CSS
- **Animaciones**: Framer Motion
- **Avatar**: D-ID API (Clips)
- **Voz**: Microsoft Azure (es-MX-DaliaNeural)
- **IA**: OpenAI GPT-4

## Configuración del Proyecto

### Requisitos Previos
- Node.js 18.17 o superior
- Cuenta en D-ID
- Cuenta en OpenAI
- Cuenta en Microsoft Azure (para voz)

### Variables de Entorno
Crear un archivo `.env.local` con las siguientes variables:
```env
# D-ID API
DID_API_KEY=tu_api_key_de_did
NEXT_PUBLIC_DID_API_URL=https://api.d-id.com

# OpenAI
OPENAI_API_KEY=tu_api_key_de_openai

# Microsoft Azure (opcional, para voz)
AZURE_SPEECH_KEY=tu_api_key_de_azure
AZURE_SPEECH_REGION=tu_region_de_azure
```

### Instalación
1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/novabank.git
cd novabank
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
- **StreamingAgent**: Logging de conexión y streaming
- **VoiceRecognition**: Logging de reconocimiento de voz

### Visualización de Logs
Los logs se pueden ver en la consola del navegador (F12) y están categorizados por componente:
```
[VirtualAgent] ℹ️ Mensaje de información
[StreamingAgent] ❌ Error en conexión
[VoiceRecognition] ✅ Voz reconocida
```

## API de D-ID (Clips)

El proyecto utiliza la API de Clips de D-ID para generar el avatar virtual:

### Características
- Streaming en tiempo real
- Expresiones faciales realistas
- Sincronización de labios
- Manejo de errores robusto
- Reconexión automática

### Configuración
```typescript
const PRESENTER_TYPE = 'clip'
const PRESENTER_ID = 'rian-pbMoTzs7an'
const DRIVER_ID = 'czarwf1D01'
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