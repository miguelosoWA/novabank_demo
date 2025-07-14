import { NextRequest, NextResponse } from 'next/server'
import { getContextById } from '@/lib/conversation-contexts'

// Define the response schema for structured output
const responseSchema = {
  type: "object",
  properties: {
    hasNavigationIntent: {
      type: "boolean",
      description: "Whether the user wants to navigate to a different page"
    },
    targetPage: {
      type: ["string", "null"],
      description: "The target page to navigate to (only if hasNavigationIntent is true, null otherwise)",
      enum: ["/dashboard", "/transfers", "/credit-card", "/investments", "/cdt", "/fic", "/accounts", "/recommendations", null]
    },
    confidence: {
      type: "number",
      minimum: 0.0,
      maximum: 1.0,
      description: "Confidence level of the intent detection (0.0 to 1.0)"
    },
    reasoning: {
      type: "string",
      description: "Explanation of why this intent was detected, including context and matching description"
    }
  },
  required: ["hasNavigationIntent", "targetPage", "confidence", "reasoning"],
  additionalProperties: false
}

// Generate system prompt based on current context
const generateSystemPrompt = (currentContext: any) => `Analiza el texto del usuario y determina si quiere navegar a alguna sección del banco.

CONTEXTO ACTUAL: ${currentContext.name}
DESCRIPCIÓN DEL CONTEXTO: ${currentContext.description}

COMANDOS DE NAVEGACIÓN DISPONIBLES EN ESTE CONTEXTO:
${currentContext.navigationCommands.map((cmd: any) => 
  `- ${cmd.description} → Navegar a ${cmd.targetPage} (Prioridad: ${cmd.priority})`
).join('\n')}

OTRAS SECCIONES GENERALES DISPONIBLES:
- Realizar transferencias → /transfers
- Solicitar tarjeta de crédito → /credit-card  
- Consultar inversiones → /recommendations
- Hacer una inversión → /investments
- Ver información de CDT → /cdt
- Ver información de FIC → /fic
- Ver estado de cuentas → /accounts
- Ver recomendaciones → /recommendations
- Volver al inicio → /dashboard

INSTRUCCIONES:
1. Analiza la intención del usuario considerando el contexto actual: ${currentContext.name}
2. Si la intención coincide con alguna descripción, determina la navegación apropiada
3. Prioriza comandos con mayor prioridad cuando hay ambigüedad
4. Ten en cuenta que el usuario está en "${currentContext.name}" - esto afecta cómo interpretar sus palabras

Tu respuesta debe seguir exactamente el formato JSON especificado.`

// Generate user prompt based on current context and user text
const generateUserPrompt = (currentContext: any, text: string) => `ANÁLISIS DE INTENCIÓN DE NAVEGACIÓN:

Sección actual: ${currentContext.name}
Texto del usuario: "${text}"

Evalúa si el usuario quiere navegar a otra sección considerando:
- Su ubicación actual en ${currentContext.name}
- Las descripciones de navegación específicas del contexto

Proporciona tu análisis en el formato JSON especificado.`

export async function POST(request: NextRequest) {
  try {
    const { text, contextId } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'Texto requerido' }, { status: 400 })
    }

    // Load context information to get navigation descriptions
    const currentContext = getContextById(contextId || 'general')

    // Build context-aware prompt with descriptions instead of keywords
    const systemPrompt = generateSystemPrompt(currentContext)
    const userPrompt = generateUserPrompt(currentContext, text)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-nano-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "intent_detection_response",
            description: "Response for navigation intent detection",
            schema: responseSchema,
            strict: true
          }
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error en OpenAI API:', errorText)
      return NextResponse.json({ error: 'Error al procesar con OpenAI' }, { status: 500 })
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: 'Respuesta vacía de OpenAI' }, { status: 500 })
    }

    // Parse JSON response - now guaranteed to be well-formatted
    try {
      const intentResult = JSON.parse(content)
      
      // Additional validation (though structured output should guarantee this)
      if (typeof intentResult.hasNavigationIntent !== 'boolean') {
        throw new Error('hasNavigationIntent debe ser un booleano')
      }

      // Ensure targetPage logic is correct
      if (intentResult.hasNavigationIntent && !intentResult.targetPage) {
        intentResult.targetPage = '/dashboard' // Default fallback
      } else if (!intentResult.hasNavigationIntent && intentResult.targetPage) {
        intentResult.targetPage = null // Clear targetPage if no navigation intent
      }

      return NextResponse.json({
        success: true,
        intent: intentResult
      })

    } catch (parseError) {
      console.error('Error al parsear respuesta de OpenAI:', content, parseError)
      
      // Fallback with structured format
      return NextResponse.json({
        success: true,
        intent: {
          hasNavigationIntent: false,
          confidence: 0.0,
          reasoning: "Error al procesar la respuesta de IA - formato inválido"
        }
      })
    }

  } catch (error) {
    console.error('Error en intent detection:', error)
    
    // Structured error response
    return NextResponse.json({
      success: true,
      intent: {
        hasNavigationIntent: false,
        confidence: 0.0,
        reasoning: "Error del sistema al procesar la solicitud"
      }
    })
  }
} 