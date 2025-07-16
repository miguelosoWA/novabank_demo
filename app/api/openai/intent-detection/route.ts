import { NextRequest, NextResponse } from 'next/server'
import { getContextById, conversationContexts } from '@/lib/conversation-contexts'

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
      enum: ["/dashboard", "/transfers", "/transfers_form", "/transfers_success", "/credit-card", "/credit_card_form", "/credit_card_success", "/cdt", "/cdt_form", "/cdt_success", "/fic", "/fic_form", "/fic_success", "/accounts", "/recommendations", null]
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
const generateSystemPrompt = (currentContext: any) => `Analiza el texto del agente bancario y determina si quiere navegar a alguna sección del banco.

CONTEXTO ACTUAL: ${currentContext.name}
DESCRIPCIÓN DEL CONTEXTO: ${currentContext.description}

COMANDOS DE NAVEGACIÓN DISPONIBLES EN ESTE CONTEXTO:
${currentContext.navigationCommands.map((cmd: any) => 
  `{ "description": "${cmd.description}", "targetPage": "${cmd.targetPage}", "priority": ${cmd.priority} }`
).join('\n')}

INSTRUCCIONES:
1. Analiza la intención del agente bancario considerando el contexto actual: ${currentContext.name}
2. Si la intención coincide con alguna descripción, determina la navegación apropiada
3. Prioriza siempre los comandos con mayor prioridad
4. Prioriza comandos en el contexto actual sobre las otras secciones generales
5. Ten en cuenta que el agente bancario está en "${currentContext.name}" - esto afecta cómo interpretar sus palabras

Tu respuesta debe seguir exactamente el formato JSON especificado.`

// Generate user prompt based on current context and user text
const generateUserPrompt = (currentContext: any, text: string) => `ANÁLISIS DE INTENCIÓN DE NAVEGACIÓN:

Sección actual: ${currentContext.name}
Texto del agente bancario: "${text}"

Evalúa si el agente bancario quiere navegar a otra sección considerando:
- Su ubicación actual en ${currentContext.name}
- Las descripciones de navegación disponibles en el contexto

Proporciona tu análisis en el formato JSON especificado.`

export async function POST(request: NextRequest) {
  try {
    const { text, contextId } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'Texto requerido' }, { status: 400 })
    }

    // Load context information to get navigation descriptions
    const currentContext = getContextById(contextId || 'general')

    // DEBUG: Add detailed logging about context resolution
    console.log('=== CONTEXT DEBUG INFO ===')
    console.log('Received contextId:', contextId)
    console.log('Fallback to general:', contextId || 'general')
    console.log('Loaded context ID:', currentContext.id)
    console.log('Loaded context name:', currentContext.name)
    console.log('Context keys available:', Object.keys(conversationContexts))
    console.log('========================')

    // Build context-aware prompt with descriptions instead of keywords
    const systemPrompt = generateSystemPrompt(currentContext)
    const userPrompt = generateUserPrompt(currentContext, text)

    console.log('System prompt:', systemPrompt)
    console.log('User prompt:', userPrompt)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini-2025-04-14',
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

      console.log('Intent result:', intentResult)
      
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