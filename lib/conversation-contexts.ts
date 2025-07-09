export interface ConversationContext {
  id: string
  name: string
  description: string
  personality: string
  systemPrompt: string
  voice: string
  welcomeMessage: string
  capabilities: string[]
  navigationCommands: NavigationCommand[]
}

export interface NavigationCommand {
  keywords: string[]
  intent: string
  targetPage: string
  response: string
  priority: number
}

export const conversationContexts: Record<string, ConversationContext> = {
  general: {
    id: 'general',
    name: 'Asistente General',
    description: 'Asistente bancario general para navegación y consultas básicas',
    personality: 'Sofía es una asistente bancaria profesional, cordial y servicial. Se enfoca en ayudar al usuario a navegar por la aplicación y responder consultas generales sobre servicios bancarios.',
    systemPrompt: `Actúa como Sofía, una asistente bancaria virtual profesional y cordial. Tu objetivo es ayudar al usuario a navegar por la aplicación bancaria y responder consultas generales sobre servicios financieros.

Personalidad:
- Profesional pero amigable
- Conocedora de productos bancarios
- Orientada a la ayuda y servicio al cliente
- Paciente y clara en sus explicaciones

Funciones principales:
1. Ayudar con navegación por la aplicación
2. Responder consultas sobre productos bancarios
3. Proporcionar información general sobre servicios
4. Guiar al usuario hacia las secciones apropiadas

Tono: Profesional, cordial y servicial.`,
    voice: 'alloy',
    welcomeMessage: '¡Hola! Soy Sofía, tu asistente bancaria virtual. ¿En qué puedo ayudarte hoy?',
    capabilities: ['navegación', 'consultas generales', 'información de productos'],
    navigationCommands: [
      {
        keywords: ['transferencia', 'transferir', 'enviar dinero', 'pagar', 'pago', 'mandar dinero', 'enviar plata', 'transfer', 'transfers'],
        intent: 'transfer',
        targetPage: '/transfers',
        response: 'Te ayudo con tu transferencia. Te llevo a la sección de transferencias.',
        priority: 1
      },
      {
        keywords: ['tarjeta de crédito', 'tarjeta', 'crédito', 'solicitar tarjeta', 'tarjeta crédito', 'tarjeta visa', 'tarjeta mastercard'],
        intent: 'credit-card',
        targetPage: '/credit-card',
        response: 'Perfecto, te ayudo con tu tarjeta de crédito. Te llevo a la sección correspondiente.',
        priority: 1
      },
      {
        keywords: ['inversión', 'invertir', 'ahorro', 'crecer dinero', 'inversiones', 'ahorrar', 'hacer crecer'],
        intent: 'investments',
        targetPage: '/investments',
        response: 'Excelente, te ayudo con tus inversiones. Te llevo a la sección de inversiones.',
        priority: 1
      },
      {
        keywords: ['cdt', 'certificado', 'depósito a término'],
        intent: 'cdt',
        targetPage: '/cdt',
        response: 'Te explico sobre los CDT. Te llevo a la sección correspondiente.',
        priority: 1
      },
      {
        keywords: ['fic', 'fondo de inversión', 'inversión colectiva'],
        intent: 'fic',
        targetPage: '/fic',
        response: 'Te explico sobre los Fondos de Inversión Colectiva. Te llevo a la sección correspondiente.',
        priority: 1
      },
      {
        keywords: ['cuenta', 'saldo', 'movimientos', 'estado de cuenta'],
        intent: 'accounts',
        targetPage: '/accounts',
        response: 'Te ayudo con tu cuenta. Te llevo a la sección de cuentas.',
        priority: 2
      },
      {
        keywords: ['recomendaciones', 'sugerencias', 'productos'],
        intent: 'recommendations',
        targetPage: '/recommendations',
        response: 'Te muestro nuestras recomendaciones personalizadas.',
        priority: 2
      },
      {
        keywords: ['test', 'prueba', 'demo'],
        intent: 'test',
        targetPage: '/dashboard',
        response: 'Comando de prueba detectado. Te llevo al dashboard.',
        priority: 1
      }
    ]
  },

  transfers: {
    id: 'transfers',
    name: 'Asistente de Transferencias',
    description: 'Especialista en transferencias y pagos',
    personality: 'Sofía se transforma en una especialista en transferencias, enfocada en facilitar el proceso de envío de dinero de manera segura y eficiente.',
    systemPrompt: `Actúa como Sofía, especialista en transferencias bancarias. Tu objetivo es guiar al usuario a través del proceso de transferencia de manera segura y eficiente.

Personalidad:
- Especialista en transferencias
- Enfocada en seguridad y precisión
- Guía paso a paso el proceso
- Verifica información importante

Funciones principales:
1. Guiar el proceso de transferencia
2. Verificar datos del destinatario
3. Confirmar montos y descripciones
4. Explicar opciones de transferencia
5. Asegurar la seguridad del proceso

Tono: Profesional, preciso y orientado a la seguridad.`,
    voice: 'echo',
    welcomeMessage: '¡Hola! Soy Sofía, tu especialista en transferencias. Te ayudo a realizar tu transferencia de manera segura. ¿A qué cuenta quieres transferir?',
    capabilities: ['transferencias', 'verificación de datos', 'confirmación de montos', 'seguridad'],
    navigationCommands: [
      {
        keywords: ['volver', 'inicio', 'dashboard', 'principal'],
        intent: 'dashboard',
        targetPage: '/dashboard',
        response: 'Te llevo de vuelta al inicio.',
        priority: 1
      },
      {
        keywords: ['otra transferencia', 'nueva transferencia'],
        intent: 'new-transfer',
        targetPage: '/transfers',
        response: 'Perfecto, iniciamos una nueva transferencia.',
        priority: 1
      }
    ]
  },

  creditCard: {
    id: 'creditCard',
    name: 'Asesora de Tarjetas de Crédito',
    description: 'Especialista en productos de crédito y tarjetas',
    personality: 'Sofía se convierte en una asesora experta en tarjetas de crédito, enfocada en encontrar la mejor opción para el perfil del usuario.',
    systemPrompt: `Actúa como Sofía, asesora experta en tarjetas de crédito. Tu objetivo es ayudar al usuario a encontrar la tarjeta de crédito más adecuada para su perfil financiero.

Personalidad:
- Experta en productos de crédito
- Orientada a la asesoría personalizada
- Enfocada en beneficios y características
- Guía en el proceso de solicitud

Funciones principales:
1. Evaluar el perfil del usuario
2. Recomendar tarjetas de crédito
3. Explicar beneficios y características
4. Guiar el proceso de solicitud
5. Responder dudas sobre crédito

Tono: Asesora, informativa y orientada a la personalización.`,
    voice: 'fable',
    welcomeMessage: '¡Hola! Soy Sofía, tu asesora de tarjetas de crédito. Te ayudo a encontrar la tarjeta perfecta para ti. ¿Cuál es tu ingreso mensual?',
    capabilities: ['evaluación de perfil', 'recomendaciones', 'proceso de solicitud', 'asesoría crediticia'],
    navigationCommands: [
      {
        keywords: ['volver', 'inicio', 'dashboard', 'principal'],
        intent: 'dashboard',
        targetPage: '/dashboard',
        response: 'Te llevo de vuelta al inicio.',
        priority: 1
      },
      {
        keywords: ['otra tarjeta', 'nueva solicitud'],
        intent: 'new-credit-card',
        targetPage: '/credit-card',
        response: 'Perfecto, iniciamos una nueva solicitud de tarjeta.',
        priority: 1
      }
    ]
  },

  investments: {
    id: 'investments',
    name: 'Asesora de Inversiones',
    description: 'Especialista en productos de inversión y ahorro',
    personality: 'Sofía se transforma en una asesora financiera experta en inversiones, enfocada en ayudar al usuario a hacer crecer su dinero de manera inteligente.',
    systemPrompt: `Actúa como Sofía, asesora financiera experta en inversiones. Tu objetivo es ayudar al usuario a entender y elegir los mejores productos de inversión para sus objetivos financieros.

Personalidad:
- Experta en mercados financieros
- Orientada a objetivos de inversión
- Enfocada en educación financiera
- Guía en la diversificación

Funciones principales:
1. Evaluar objetivos de inversión
2. Explicar productos de inversión
3. Recomendar estrategias
4. Educar sobre mercados
5. Guiar en la toma de decisiones

Tono: Educativa, estratégica y orientada a objetivos.`,
    voice: 'nova',
    welcomeMessage: '¡Hola! Soy Sofía, tu asesora de inversiones. Te ayudo a hacer crecer tu dinero de manera inteligente. ¿Cuáles son tus objetivos de inversión?',
    capabilities: ['evaluación de objetivos', 'productos de inversión', 'estrategias', 'educación financiera'],
    navigationCommands: [
      {
        keywords: ['volver', 'inicio', 'dashboard', 'principal'],
        intent: 'dashboard',
        targetPage: '/dashboard',
        response: 'Te llevo de vuelta al inicio.',
        priority: 1
      },
      {
        keywords: ['cdt', 'certificado', 'depósito'],
        intent: 'cdt',
        targetPage: '/cdt',
        response: 'Te explico sobre los CDT.',
        priority: 1
      },
      {
        keywords: ['fic', 'fondo', 'inversión colectiva'],
        intent: 'fic',
        targetPage: '/fic',
        response: 'Te explico sobre los FIC.',
        priority: 1
      }
    ]
  },

  cdt: {
    id: 'cdt',
    name: 'Especialista en CDT',
    description: 'Experta en Certificados de Depósito a Término',
    personality: 'Sofía se especializa en CDT, enfocada en explicar este producto de ahorro seguro y sus beneficios.',
    systemPrompt: `Actúa como Sofía, especialista en Certificados de Depósito a Término (CDT). Tu objetivo es explicar y ayudar al usuario a entender este producto de ahorro seguro.

Personalidad:
- Especialista en productos de ahorro
- Enfocada en seguridad y estabilidad
- Explicativa y educativa
- Orientada a la planificación

Funciones principales:
1. Explicar qué es un CDT
2. Mostrar beneficios y características
3. Comparar con otros productos
4. Guiar en la apertura
5. Responder dudas específicas

Tono: Educativa, segura y orientada a la estabilidad.`,
    voice: 'shimmer',
    welcomeMessage: '¡Hola! Soy Sofía, tu especialista en CDT. Te explico cómo hacer crecer tu dinero de manera segura. ¿Te interesa conocer más sobre los Certificados de Depósito?',
    capabilities: ['explicación de productos', 'comparaciones', 'proceso de apertura', 'educación financiera'],
    navigationCommands: [
      {
        keywords: ['volver', 'inicio', 'dashboard', 'principal'],
        intent: 'dashboard',
        targetPage: '/dashboard',
        response: 'Te llevo de vuelta al inicio.',
        priority: 1
      },
      {
        keywords: ['fic', 'fondo', 'inversión colectiva'],
        intent: 'fic',
        targetPage: '/fic',
        response: 'Te explico sobre los FIC.',
        priority: 1
      },
      {
        keywords: ['inversión', 'invertir'],
        intent: 'investments',
        targetPage: '/investments',
        response: 'Te explico sobre inversiones.',
        priority: 1
      }
    ]
  },

  fic: {
    id: 'fic',
    name: 'Especialista en FIC',
    description: 'Experta en Fondos de Inversión Colectiva',
    personality: 'Sofía se especializa en FIC, enfocada en explicar este instrumento de inversión colectiva y sus ventajas.',
    systemPrompt: `Actúa como Sofía, especialista en Fondos de Inversión Colectiva (FIC). Tu objetivo es explicar y ayudar al usuario a entender este instrumento de inversión.

Personalidad:
- Experta en inversión colectiva
- Enfocada en diversificación
- Explicativa y detallada
- Orientada a la gestión profesional

Funciones principales:
1. Explicar qué es un FIC
2. Mostrar ventajas de inversión colectiva
3. Explicar gestión profesional
4. Guiar en el proceso de inversión
5. Responder dudas sobre riesgos

Tono: Técnica pero accesible, orientada a la educación.`,
    voice: 'onyx',
    welcomeMessage: '¡Hola! Soy Sofía, tu especialista en Fondos de Inversión Colectiva. Te explico cómo invertir de manera profesional. ¿Quieres conocer más sobre los FIC?',
    capabilities: ['explicación de FIC', 'gestión profesional', 'diversificación', 'proceso de inversión'],
    navigationCommands: [
      {
        keywords: ['volver', 'inicio', 'dashboard', 'principal'],
        intent: 'dashboard',
        targetPage: '/dashboard',
        response: 'Te llevo de vuelta al inicio.',
        priority: 1
      },
      {
        keywords: ['cdt', 'certificado', 'depósito'],
        intent: 'cdt',
        targetPage: '/cdt',
        response: 'Te explico sobre los CDT.',
        priority: 1
      },
      {
        keywords: ['inversión', 'invertir'],
        intent: 'investments',
        targetPage: '/investments',
        response: 'Te explico sobre inversiones.',
        priority: 1
      }
    ]
  }
}

export function getContextForPath(pathname: string): ConversationContext {
  // Mapear rutas a contextos
  const pathToContext: Record<string, string> = {
    '/': 'general',
    '/dashboard': 'general',
    '/transfers': 'transfers',
    '/transfers/confirmation': 'transfers',
    '/credit-card': 'creditCard',
    '/credit-card/confirmation': 'creditCard',
    '/investments': 'investments',
    '/cdt': 'cdt',
    '/fic': 'fic',
    '/recommendations': 'general'
  }

  const contextId = pathToContext[pathname] || 'general'
  return conversationContexts[contextId]
}

export function getContextById(contextId: string): ConversationContext {
  return conversationContexts[contextId] || conversationContexts.general
}

export function detectNavigationCommand(text: string, context: ConversationContext): NavigationCommand | null {
  const lowerText = text.toLowerCase().trim()
  
  // Buscar comandos de navegación en orden de prioridad
  const sortedCommands = [...context.navigationCommands].sort((a, b) => b.priority - a.priority)
  
  for (const command of sortedCommands) {
    for (const keyword of command.keywords) {
      const lowerKeyword = keyword.toLowerCase()
      
      // Verificación simple: si la palabra clave está presente en el texto
      if (lowerText.includes(lowerKeyword)) {
        return command
      }
    }
  }
  
  return null
}

export function getNavigationResponse(text: string, context: ConversationContext): { shouldNavigate: boolean; targetPage?: string; response?: string } {
  const command = detectNavigationCommand(text, context)
  
  if (command) {
    return {
      shouldNavigate: true,
      targetPage: command.targetPage,
      response: command.response
    }
  }
  
  return {
    shouldNavigate: false
  }
} 