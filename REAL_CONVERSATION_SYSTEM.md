# 🎤 Sistema de Conversación Real con Detección de Intención

## Descripción General

El sistema de conversación real permite que el usuario hable naturalmente con Sofía, y un modelo de IA detecte automáticamente las intenciones de navegación en tiempo real.

## Características Principales

### 🎤 **Grabación de Audio en Tiempo Real**
- Captura de audio del usuario usando MediaRecorder API
- Grabación continua mientras el micrófono está activo
- Procesamiento de audio cada segundo
- Transcripción usando OpenAI Whisper

### 🧠 **Detección de Intención Inteligente**
- Análisis del texto transcrito usando GPT-4o-mini
- Detección de intenciones implícitas y explícitas
- Navegación automática basada en la conversación
- Sistema de fallback robusto

### 🎨 **Experiencia de Usuario Fluida**
- Conversación natural sin comandos específicos
- Indicadores visuales de estado de grabación
- Feedback inmediato de transcripción
- Navegación automática y contextual

## Flujo de Funcionamiento

1. **Usuario Activa Micrófono**: Hace clic en el botón verde del micrófono
2. **Grabación Inicia**: AudioRecorder comienza a capturar audio
3. **Procesamiento Continuo**: Audio se procesa cada segundo
4. **Transcripción**: OpenAI Whisper convierte audio a texto
5. **Detección de Intención**: Modelo de IA analiza el texto
6. **Navegación Automática**: Si detecta intención, navega automáticamente

## Componentes del Sistema

### AudioRecorder
- **Función**: Captura y procesa audio del usuario
- **Tecnología**: MediaRecorder API + OpenAI Whisper
- **Características**: 
  - Grabación continua
  - Procesamiento en tiempo real
  - Transcripción automática
  - Indicadores de estado

### API de Transcripción
- **Endpoint**: `/api/openai/transcribe`
- **Función**: Convierte audio a texto usando Whisper
- **Parámetros**: Audio en formato WebM
- **Respuesta**: Texto transcrito en español

### API de Detección de Intención
- **Endpoint**: `/api/openai/intent-detection`
- **Función**: Analiza texto y detecta intenciones
- **Modelo**: GPT-4o-mini
- **Respuesta**: Intención detectada con confianza

## Configuración Técnica

### AudioRecorder
```typescript
const mediaRecorder = new MediaRecorder(stream, {
  mimeType: 'audio/webm;codecs=opus'
})

// Configuración de audio
{
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  sampleRate: 16000
}
```

### Transcripción
```typescript
// OpenAI Whisper
{
  model: 'whisper-1',
  language: 'es'
}
```

### Detección de Intención
```typescript
// GPT-4o-mini
{
  temperature: 0.1,
  max_tokens: 200
}
```

## Estados del Sistema

### Micrófono
- **Inactivo**: Botón verde, micrófono desactivado
- **Activo**: Botón rojo, micrófono activado
- **Grabando**: Indicador rojo pulsante, grabación en curso
- **Procesando**: Indicador amarillo, transcripción en curso

### Navegación
- **Sin Intención**: Conversación normal
- **Intención Detectada**: Indicador verde, navegación automática
- **Error**: Indicador de error, fallback activado

## Ejemplos de Uso

### Conversación Natural
```
Usuario: "Hola Sofía, me gustaría hacer una transferencia a mi mamá"
→ Sistema transcribe: "Hola Sofía, me gustaría hacer una transferencia a mi mamá"
→ IA detecta: Intención de transferencia (confianza: 95%)
→ Navega automáticamente a /transfers
```

### Intención Implícita
```
Usuario: "Necesito enviar dinero urgente"
→ Sistema transcribe: "Necesito enviar dinero urgente"
→ IA detecta: Intención de transferencia (confianza: 90%)
→ Navega automáticamente a /transfers
```

### Sin Intención
```
Usuario: "¿Cómo estás hoy?"
→ Sistema transcribe: "¿Cómo estás hoy?"
→ IA detecta: Sin intención de navegación
→ Continúa conversación normal
```

## Ventajas del Sistema

### 🎯 **Precisión**
- Transcripción de alta calidad con Whisper
- Detección contextual avanzada
- Análisis de intenciones implícitas
- Sistema de confianza medible

### ⚡ **Velocidad**
- Procesamiento en tiempo real
- Respuesta inmediata
- Navegación automática
- Sin latencia perceptible

### 🎨 **Experiencia**
- Conversación completamente natural
- Sin necesidad de comandos
- Feedback visual claro
- Flujo intuitivo

## Logging y Debugging

### Logs de AudioRecorder
```
[AudioRecorder] ℹ️ Iniciando grabación de audio
[AudioRecorder] ✅ Grabación iniciada
[AudioRecorder] ℹ️ Procesando audio...
[AudioRecorder] ✅ Transcripción completada
```

### Logs de VirtualAgent
```
[VirtualAgent] ℹ️ Transcripción del usuario recibida
[VirtualAgent] 🔍 Detectando intención de navegación...
[VirtualAgent] ℹ️ Intención de navegación detectada
[VirtualAgent] ✅ Navegación por intención ejecutada
```

## Consideraciones Técnicas

### Rendimiento
- Grabación optimizada para voz
- Procesamiento eficiente de audio
- Transcripción rápida con Whisper
- Detección de intención en tiempo real

### Compatibilidad
- Funciona en navegadores modernos
- Soporte para MediaRecorder API
- Compatible con OpenAI APIs
- Fallback robusto

### Privacidad
- Audio procesado localmente
- No se almacena audio
- Transcripción temporal
- Datos seguros

## Próximas Mejoras

1. **Mejora de Transcripción**: Ajustes de calidad de audio
2. **Detección Avanzada**: Análisis de contexto histórico
3. **Personalización**: Adaptación a patrones del usuario
4. **Múltiples Idiomas**: Soporte para otros idiomas
5. **Confirmación**: Preguntar antes de navegar en casos ambiguos 