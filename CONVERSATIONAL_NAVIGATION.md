# 🗣️ Sistema de Navegación Conversacional

## Descripción General

El sistema de navegación conversacional permite que Sofía, la asistente virtual, detecte automáticamente las intenciones del usuario a través de conversaciones naturales y navegue a las páginas correspondientes sin necesidad de comandos específicos.

## Características Principales

### 🧠 **Detección de Intención con IA**
- Análisis conversacional natural usando GPT-4o-mini
- Detección de intenciones implícitas y explícitas
- Consideración del contexto de la conversación
- Nivel de confianza en la detección

### 🎯 **Navegación Inteligente**
- Navegación automática basada en intención detectada
- Indicadores visuales de navegación
- Pausa natural antes de navegar
- Logging detallado del proceso

### 🎨 **Experiencia de Usuario**
- Conversación fluida y natural
- Sin necesidad de comandos específicos
- Feedback visual inmediato
- Navegación contextual

## Flujo de Funcionamiento

1. **Conversación Natural**: El usuario habla con Sofía de manera natural
2. **Transcripción**: OpenAI Realtime API convierte audio a texto
3. **Análisis de Intención**: Modelo de IA analiza el texto y detecta intenciones
4. **Evaluación de Confianza**: Sistema evalúa qué tan segura está la detención
5. **Navegación Automática**: Si se detecta intención clara, navega automáticamente
6. **Feedback Visual**: Muestra indicador de navegación

## API de Detección de Intención

### Endpoint: `/api/openai/intent-detection`

**Request:**
```json
{
  "text": "Quiero hacer una transferencia",
  "contextId": "general"
}
```

**Response:**
```json
{
  "success": true,
  "intent": {
    "hasNavigationIntent": true,
    "targetPage": "/transfers",
    "confidence": 0.95,
    "reasoning": "Usuario menciona explícitamente querer hacer una transferencia"
  }
}
```

## Secciones Detectables

| Intención | Página Destino | Ejemplos de Frases |
|-----------|----------------|-------------------|
| Transferencias | `/transfers` | "Quiero hacer una transferencia", "Necesito enviar dinero" |
| Tarjetas de Crédito | `/credit-card` | "Necesito una tarjeta", "Quiero solicitar crédito" |
| Inversiones | `/investments` | "Me gustaría invertir", "Quiero hacer crecer mi dinero" |
| CDT | `/cdt` | "Información sobre CDT", "Certificados de depósito" |
| FIC | `/fic` | "Fondos de inversión", "FIC" |
| Cuentas | `/accounts` | "Ver mi cuenta", "Estado de cuenta" |
| Recomendaciones | `/recommendations` | "Recomendaciones", "Sugerencias" |
| Dashboard | `/dashboard` | "Volver al inicio", "Página principal" |

## Configuración del Modelo

### Prompt del Sistema
El modelo utiliza un prompt especializado que:
- Analiza conversaciones bancarias
- Detecta intenciones implícitas y explícitas
- Considera el contexto actual
- Proporciona razonamiento para sus decisiones

### Parámetros del Modelo
- **Modelo**: GPT-4o-mini
- **Temperatura**: 0.1 (baja para consistencia)
- **Max Tokens**: 200
- **Formato de Respuesta**: JSON estructurado

## Ventajas del Sistema

### 🎯 **Precisión**
- Análisis contextual avanzado
- Detección de intenciones implícitas
- Nivel de confianza medible
- Razonamiento transparente

### 🚀 **Velocidad**
- Respuesta inmediata del modelo
- Navegación automática
- Sin procesamiento adicional
- Flujo optimizado

### 🎨 **Experiencia**
- Conversación natural
- Sin comandos específicos
- Feedback visual claro
- Navegación fluida

## Componente de Prueba

El sistema incluye un componente de prueba (`NavigationTest`) que permite:

- **Probar Detección**: Envía texto a la API y muestra resultados
- **Simular Evento**: Dispara el evento como si viniera del agente
- **Ver Detalles**: Muestra confianza, razón y página objetivo
- **Debug**: Útil para desarrollo y testing

### Uso del Componente de Prueba
```typescript
// Solo aparece en desarrollo
{process.env.NODE_ENV === 'development' && (
  <NavigationTest />
)}
```

## Logging y Debugging

El sistema incluye logging detallado:

```javascript
// Logs de detección
[VirtualAgent] 🔍 Detectando intención de navegación...
[VirtualAgent] 🔍 Respuesta de detección de intención
[VirtualAgent] ℹ️ Intención de navegación detectada
[VirtualAgent] ✅ Navegación por intención ejecutada
```

## Consideraciones Técnicas

### Rendimiento
- Modelo optimizado para velocidad
- Respuesta en menos de 1 segundo
- Caché de respuestas frecuentes
- Manejo de errores robusto

### Escalabilidad
- API independiente y modular
- Fácil agregar nuevas intenciones
- Configuración flexible
- Monitoreo de rendimiento

### Seguridad
- Validación de entrada
- Sanitización de texto
- Manejo de errores seguro
- Logs sin información sensible

## Ejemplos de Uso

### Conversación Natural
```
Usuario: "Hola Sofía, me gustaría hacer una transferencia a mi mamá"
Sofía: [Analiza intención] → Navega a /transfers
```

### Intención Implícita
```
Usuario: "Necesito enviar dinero urgente"
Sofía: [Detecta intención de transferencia] → Navega a /transfers
```

### Sin Intención de Navegación
```
Usuario: "¿Cómo estás hoy?"
Sofía: [No detecta intención] → Continúa conversación normal
```

## Próximas Mejoras

1. **Aprendizaje Continuo**: Mejorar detección basada en uso
2. **Contexto Histórico**: Considerar conversaciones previas
3. **Personalización**: Adaptar a preferencias del usuario
4. **Múltiples Intenciones**: Detectar múltiples intenciones en una frase
5. **Confirmación**: Preguntar antes de navegar en casos ambiguos 