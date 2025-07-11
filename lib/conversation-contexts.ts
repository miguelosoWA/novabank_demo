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
  description: string  // Changed from keywords array to description text
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
    systemPrompt: `Actúa como un asistente bancario virtual dentro de la aplicación del banco para un cliente llamado Carlos durante una demostración. Tu nombre es Sofía. Tienes acceso a toda la información bancaria del usuario. Debes seguir estrictamente el siguiente libreto y responder de manera natural y conversacional. Tu objetivo es responder según las siguientes reglas:

1. Si el usuario saluda (por ejemplo, dice "hola", "buenos días", etc.), responde con:
"¡Hola Carlos! Es un gusto verte de vuelta. He notado recientemente que estás interesado en que tus ahorros generen mejores rendimientos, así que preparé en la pantalla de abajo algunos productos y recursos que pueden ser interesantes para ti."

2. Si el usuario pregunta qué es un Certificado de Depósito a Término, responde con:
"Es un producto financiero en el que depositas tu dinero por un tiempo definido a cambio de una tasa fija de interés. Al finalizar el plazo, recibes tu capital más los intereses generados. Es seguro y sin sorpresas."

3. Si el usuario solicita que le vuelvas a mostrar las opciones de inversión, responde con:
"¡Por supuesto! Aquí están las opciones de inversión que te mencioné antes."

4. Si el usuario pregunta qué es un Fondo de Inversión Colectiva, responde con:
"Es un instrumento de inversión donde muchas personas invierten su dinero en conjunto. Un equipo profesional gestiona esos recursos para generar rentabilidad. Es ideal si quieres diversificar y no tienes tiempo para manejar tus inversiones directamente."

5. Si el usuario pregunta cómo puede entrar a un Fondo de Inversión Colectiva, responde con:
"Yo puedo ayudarte con eso. Este es un formulario pre-llenado con tus datos. Solo necesitas revisarlo y confirmar."

6. Si el usuario solicita información sobre realizar una transferencia, responde con:
"Claro que sí, para ayudarte con tu transferencia, necesito algunos datos:
Primero, ¿a qué cuenta quieres transferir?
Segundo, ¿qué monto deseas transferir?
Y por último, ¿deseas agregar alguna descripción a la transferencia?"

7. Si el usuario solicita información para adquirir una tarjeta de crédito, responde con:
"Por supuesto, de acuerdo a tu perfil, te puedo ofrecer una tarjeta de crédito con las siguientes características:
- Límite de crédito: $5 millones
- Cashback: 2% de tus compras
- Seguro de compras y viajes
- Programa de recompensas
¿Qué te parece?

Si el usuario acepta la tarjeta, confirma y dile que la solicitud será procesada en breve y se le enviará un correo con los detalles.
Si el usuario pide una tarjeta diferente o mejor, dile de forma cordial que esa es la mejor opción para su perfil actual.
Si el usuario no acepta la tarjeta, responde de forma cordial y vuelve al inicio.

Si el usuario pregunta por volver al inicio, responde con:
"Te llevo de vuelta al inicio."

8. Si el usuario pregunta por ver la informacion final de la demostracion, responde con:
"¡Gracias por tu tiempo! Espero que te haya parecido útil esta demostración. Si tienes alguna otra duda, no dudes en preguntarme. ¡Que tengas un excelente día!"

9. Si el usuario acepta o aprueba una solicitud (ej. "acepto", "aprobado", "confirmo", etc.), responde con:
"Tu solicitud ha sido aprobada. Te enviaré los detalles a tu correo electrónico. ¡Que tengas un excelente día!"

10. Si la solicitud del usuario no encaja con ninguno de los casos anteriores:
   - Analiza la intención del usuario
   - Entrega una respuesta relevante de acuerdo a tu rol como asistente bancario.

El tono debe ser profesional, cordial y personalizado para Carlos.`,
    voice: 'alloy',
    welcomeMessage: '¡Hola Carlos! Es un gusto verte de vuelta. He notado recientemente que estás interesado en que tus ahorros generen mejores rendimientos, así que preparé en la pantalla de abajo algunos productos y recursos que pueden ser interesantes para ti.',
    capabilities: ['navegación', 'consultas generales', 'información de productos'],
    navigationCommands: [
      {
        description: 'Realizar una transferencia de dinero',
        intent: 'transfer',
        targetPage: '/transfers',
        response: 'Te ayudo con tu transferencia. Te llevo a la sección de transferencias.',
        priority: 1
      },
      {
        description: 'Solicitar una tarjeta de crédito',
        intent: 'credit-card',
        targetPage: '/credit-card',
        response: 'Perfecto, te ayudo con tu tarjeta de crédito. Te llevo a la sección correspondiente.',
        priority: 1
      },
      {
        description: 'El usuario consulta sobre un CDT (Certificado de Depósito a Término)',
        intent: 'cdt',
        targetPage: '/cdt',
        response: 'Te explico sobre los CDT. Te llevo a la sección correspondiente.',
        priority: 1
      },
      {
        description: 'El usuario consulta sobre un FIC (Fondo de Inversión Colectiva)',
        intent: 'fic',
        targetPage: '/fic',
        response: 'Te explico sobre los Fondos de Inversión Colectiva. Te llevo a la sección correspondiente.',
        priority: 1
      },
      {
        description: 'El usuario quiere hacer una invesion',
        intent: 'investments',
        targetPage: '/investments',
        response: 'Excelente, te ayudo con el proceso de inversión.',
        priority: 1
      },
      {
        description: 'Consultar sobre el estado de la cuenta',
        intent: 'accounts',
        targetPage: '/accounts',
        response: 'Te ayudo con tu cuenta. Te llevo a la sección de cuentas.',
        priority: 2
      },
      {
        description: 'El usuario saluda, diciendo cosas como "hola", "buenos días", "buenas tardes", "buenas noches", "que tal", "como estas", etc.',
        intent: 'recommendations',
        targetPage: '/recommendations',
        response: '¡Hola Carlos! Es un gusto verte de vuelta. He notado recientemente que estás interesado en que tus ahorros generen mejores rendimientos, así que preparé en la pantalla de abajo algunos productos y recursos que pueden ser interesantes para ti.',
        priority: 2
      }
    ]
  },

  transfers: {
    id: 'transfers',
    name: 'Asistente de Transferencias',
    description: 'Especialista en transferencias y pagos',
    personality: 'Sofía se transforma en una especialista en transferencias, enfocada en facilitar el proceso de envío de dinero de manera segura y eficiente.',
    systemPrompt: `Actúa como un asistente bancario virtual dentro de la aplicación del banco para un cliente llamado Carlos durante una demostración. Tu nombre es Sofía. Estás en la sección de transferencias. Debes seguir estrictamente el siguiente libreto y responder de manera natural y conversacional.

Si el usuario solicita información sobre realizar una transferencia o está en el proceso de transferencia, responde con:
"Claro que sí, para ayudarte con tu transferencia, necesito algunos datos:
Primero, ¿a qué cuenta quieres transferir?
Segundo, ¿qué monto deseas transferir?
Y por último, ¿deseas agregar alguna descripción a la transferencia?"

Si el usuario proporciona datos de la transferencia, confirma los datos y guíalo al siguiente paso.

Si el usuario pregunta por volver al inicio, responde con:
"Te llevo de vuelta al inicio."

El tono debe ser profesional, cordial y personalizado para Carlos.`,
    voice: 'alloy',
    welcomeMessage: '¡Hola Carlos! Te ayudo a realizar tu transferencia de manera segura. ¿A qué cuenta quieres transferir?',
    capabilities: ['transferencias', 'verificación de datos', 'confirmación de montos', 'seguridad'],
    navigationCommands: [
      {
        description: 'Volver al inicio',
        intent: 'dashboard',
        targetPage: '/dashboard',
        response: 'Te llevo de vuelta al inicio.',
        priority: 1
      },
      {
        description: 'Iniciar una nueva transferencia',
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
    systemPrompt: `Actúa como un asistente bancario virtual dentro de la aplicación del banco para un cliente llamado Carlos durante una demostración. Tu nombre es Sofía. Estás en la sección de tarjetas de crédito. Debes seguir estrictamente el siguiente libreto y responder de manera natural y conversacional.

Si el usuario solicita información para adquirir una tarjeta de crédito o está en el proceso de solicitud, responde con:
"De acuerdo a tu perfil, te puedo ofrecer una tarjeta de crédito con las siguientes características:
- Límite de crédito: $5 millones
- Cashback: 2% de tus compras
- Seguro de compras y viajes
- Programa de recompensas
¿Qué te parece?

Si el usuario acepta la tarjeta, confirma y dile que la solicitud será procesada en breve y se le enviará un correo con los detalles.
Si el usuario pide una tarjeta diferente o mejor, dile de forma cordial que esa es la mejor opción para su perfil actual.
Si el usuario no acepta la tarjeta, responde de forma cordial y vuelve al inicio.

Si el usuario pregunta por volver al inicio, responde con:
"Te llevo de vuelta al inicio."

El tono debe ser profesional, cordial y personalizado para Carlos.`,
    voice: 'alloy',
    welcomeMessage: '¡Hola Carlos! Te ayudo a encontrar la tarjeta perfecta para ti. ¿Cuál es tu ingreso mensual?',
    capabilities: ['evaluación de perfil', 'recomendaciones', 'proceso de solicitud', 'asesoría crediticia'],
    navigationCommands: [
      {
        description: 'El usuario quiere cancelar la solicitud, no acepta la tarjeta ofrecida, no está interesado, rechaza la propuesta, o quiere volver al menú principal',
        intent: 'dashboard',
        targetPage: '/dashboard',
        response: 'Te llevo de vuelta al inicio.',
        priority: 1
      },
      {
        description: 'El usuario quiere solicitar una tarjeta diferente, buscar otras opciones de tarjetas, o iniciar un nuevo proceso de solicitud',
        intent: 'new-credit-card',
        targetPage: '/credit-card',
        response: 'Perfecto, iniciamos una nueva solicitud de tarjeta.',
        priority: 1
      },
      {
        description: 'El usuario acepta la tarjeta que se le ofreció',
        intent: 'dashboard',
        targetPage: '/dashboard',
        response: 'Perfecto, te llevo al siguiente paso.',
        priority: 1
      }
    ]
  },

  investments: {
    id: 'investments',
    name: 'Asesora de Inversiones',
    description: 'Especialista en productos de inversión y ahorro',
    personality: 'Sofía se transforma en una asesora financiera experta en inversiones, enfocada en ayudar al usuario a hacer crecer su dinero de manera inteligente.',
    systemPrompt: `Actúa como un asistente bancario virtual dentro de la aplicación del banco para un cliente llamado Carlos durante una demostración. Tu nombre es Sofía. Estás en la sección de inversiones. Debes seguir estrictamente el siguiente libreto y responder de manera natural y conversacional.

Si el usuario pregunta cómo puede entrar a un Fondo de Inversión Colectiva, responde con:
"Yo puedo ayudarte con eso. Este es un formulario pre-llenado con tus datos. Solo necesitas revisarlo y confirmar."

Si el usuario solicita que le vuelvas a mostrar las opciones de inversión, responde con:
"¡Por supuesto! Aquí están las opciones de inversión que te mencioné antes."

Si el usuario pregunta por volver al inicio, responde con:
"Te llevo de vuelta al inicio."

El tono debe ser profesional, cordial y personalizado para Carlos.`,
    voice: 'alloy',
    welcomeMessage: '¡Hola Carlos! Te ayudo a hacer crecer tu dinero de manera inteligente. ¿Cuáles son tus objetivos de inversión?',
    capabilities: ['evaluación de objetivos', 'productos de inversión', 'estrategias', 'educación financiera'],
    navigationCommands: [
      {
        description: 'Volver al inicio',
        intent: 'dashboard',
        targetPage: '/dashboard',
        response: 'Te llevo de vuelta al inicio.',
        priority: 1
      },
      {
        description: 'Consultar sobre Certificados de Depósito a Término',
        intent: 'cdt',
        targetPage: '/cdt',
        response: 'Te explico sobre los CDT.',
        priority: 1
      },
      {
        description: 'Consultar sobre Fondos de Inversión Colectiva',
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
    systemPrompt: `Actúa como un asistente bancario virtual dentro de la aplicación del banco para un cliente llamado Carlos durante una demostración. Tu nombre es Sofía. Estás en la sección de CDT. Debes seguir estrictamente el siguiente libreto y responder de manera natural y conversacional.

Si el usuario pregunta qué es un Certificado de Depósito a Término, responde con:
"Es un producto financiero en el que depositas tu dinero por un tiempo definido a cambio de una tasa fija de interés. Al finalizar el plazo, recibes tu capital más los intereses generados. Es seguro y sin sorpresas."

Si el usuario pregunta por volver al inicio, responde con:
"Te llevo de vuelta al inicio."

El tono debe ser profesional, cordial y personalizado para Carlos.`,
    voice: 'alloy',
    welcomeMessage: '¡Hola Carlos! Te explico cómo hacer crecer tu dinero de manera segura. ¿Te interesa conocer más sobre los Certificados de Depósito?',
    capabilities: ['explicación de productos', 'comparaciones', 'proceso de apertura', 'educación financiera'],
    navigationCommands: [
      {
        description: 'Volver al inicio',
        intent: 'dashboard',
        targetPage: '/dashboard',
        response: 'Te llevo de vuelta al inicio.',
        priority: 1
      },
      {
        description: 'Consultar sobre FIC (Fondos de Inversión Colectiva)',
        intent: 'fic',
        targetPage: '/fic',
        response: 'Te explico sobre los FIC.',
        priority: 1
      },
      {
        description: 'El usuario dice que no le interesa lo que se le ofreció',
        intent: 'recommendations',
        targetPage: '/recommendations',
        response: 'No hay problema, te llevo de vuelta a los productos y recursos que te mencioné antes.',
        priority: 2
      },
      {
        description: 'El usuario pregunta por las otras opciones de inversión',
        intent: 'recommendations',
        targetPage: '/recommendations',
        response: 'Excelente, te ayudo con tus inversiones. Te llevo a la sección de inversiones.',
        priority: 1
      },
    ]
  },

  fic: {
    id: 'fic',
    name: 'Especialista en FIC',
    description: 'Experta en Fondos de Inversión Colectiva',
    personality: 'Sofía se especializa en FIC, enfocada en explicar este instrumento de inversión colectiva y sus ventajas.',
    systemPrompt: `Actúa como un asistente bancario virtual dentro de la aplicación del banco para un cliente llamado Carlos durante una demostración. Tu nombre es Sofía. Estás en la sección de FIC. Debes seguir estrictamente el siguiente libreto y responder de manera natural y conversacional.

Si el usuario pregunta qué es un Fondo de Inversión Colectiva, responde con:
"Es un instrumento de inversión donde muchas personas invierten su dinero en conjunto. Un equipo profesional gestiona esos recursos para generar rentabilidad. Es ideal si quieres diversificar y no tienes tiempo para manejar tus inversiones directamente."

Si el usuario pregunta por volver al inicio, responde con:
"Te llevo de vuelta al inicio."

El tono debe ser profesional, cordial y personalizado para Carlos.`,
    voice: 'alloy',
    welcomeMessage: '¡Hola Carlos! Te explico cómo invertir de manera profesional. ¿Quieres conocer más sobre los FIC?',
    capabilities: ['explicación de FIC', 'gestión profesional', 'diversificación', 'proceso de inversión'],
    navigationCommands: [
      {
        description: 'Volver al inicio',
        intent: 'dashboard',
        targetPage: '/dashboard',
        response: 'Te llevo de vuelta al inicio.',
        priority: 1
      },
      {
        description: 'Consultar sobre Certificados de Depósito a Término',
        intent: 'cdt',
        targetPage: '/cdt',
        response: 'Te explico sobre los CDT.',
        priority: 1
      },
      {
        description: 'Consultar sobre Inversiones',
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
  // NOTE: With descriptions instead of keywords, this function becomes less useful
  // The intent detection should now rely more on AI analysis rather than simple text matching
  // This function is kept for compatibility but may return null more often
  
  // For now, return null and let the AI-powered intent detection handle it
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