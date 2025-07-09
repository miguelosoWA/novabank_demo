import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text, contextId } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'Texto requerido' }, { status: 400 })
    }

    // Detección local simple como fallback
    const lowerText = text.toLowerCase()
    
    const intentMap = {
      '/transfers': ['transferencia', 'transferir', 'enviar dinero', 'pagar', 'pago', 'mandar dinero'],
      '/credit-card': ['tarjeta', 'crédito', 'tarjeta de crédito', 'tarjeta crédito'],
      '/investments': ['inversión', 'invertir', 'ahorro', 'crecer dinero', 'inversiones'],
      '/cdt': ['cdt', 'certificado', 'depósito'],
      '/fic': ['fic', 'fondo', 'inversión colectiva'],
      '/accounts': ['cuenta', 'saldo', 'movimientos'],
      '/recommendations': ['recomendaciones', 'sugerencias'],
      '/dashboard': ['inicio', 'principal', 'volver', 'dashboard']
    }

    // Buscar coincidencias
    for (const [page, keywords] of Object.entries(intentMap)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          return NextResponse.json({
            success: true,
            intent: {
              hasNavigationIntent: true,
              targetPage: page,
              confidence: 0.8,
              reasoning: `Detectado: "${keyword}" en el texto`
            }
          })
        }
      }
    }

    // Si no hay coincidencias, usar OpenAI

    // Prompt simplificado para detectar intención
    const systemPrompt = `Analiza el texto del usuario y determina si quiere navegar a alguna sección del banco.

SECCIONES:
- /transfers: transferencia, transferir, enviar dinero, pagar, pago
- /credit-card: tarjeta, crédito, tarjeta de crédito
- /investments: inversión, invertir, ahorro, crecer dinero
- /cdt: cdt, certificado, depósito
- /fic: fic, fondo, inversión colectiva
- /accounts: cuenta, saldo, movimientos
- /recommendations: recomendaciones, sugerencias
- /dashboard: inicio, principal, volver

Responde SOLO con JSON:
{
  "hasNavigationIntent": true/false,
  "targetPage": "/ruta" (solo si true),
  "confidence": 0.0-1.0,
  "reasoning": "explicación breve"
}`

    const userPrompt = `Texto: "${text}"

Responde con JSON:`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1,
        max_tokens: 200
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

    // Intentar parsear el JSON de la respuesta
    try {
      const intentResult = JSON.parse(content)
      
      // Validar la estructura de la respuesta
      if (typeof intentResult.hasNavigationIntent !== 'boolean') {
        throw new Error('hasNavigationIntent debe ser un booleano')
      }

      return NextResponse.json({
        success: true,
        intent: intentResult
      })

    } catch (parseError) {
      console.error('Error al parsear respuesta de OpenAI:', content, parseError)
      
      // Fallback: intentar detección local
      const lowerText = text.toLowerCase()
      const intentMap = {
        '/transfers': ['transferencia', 'transferir', 'enviar dinero', 'pagar', 'pago'],
        '/credit-card': ['tarjeta', 'crédito', 'tarjeta de crédito'],
        '/investments': ['inversión', 'invertir', 'ahorro', 'crecer dinero'],
        '/cdt': ['cdt', 'certificado', 'depósito'],
        '/fic': ['fic', 'fondo', 'inversión colectiva'],
        '/accounts': ['cuenta', 'saldo', 'movimientos'],
        '/recommendations': ['recomendaciones', 'sugerencias'],
        '/dashboard': ['inicio', 'principal', 'volver']
      }

      for (const [page, keywords] of Object.entries(intentMap)) {
        for (const keyword of keywords) {
          if (lowerText.includes(keyword)) {
            return NextResponse.json({
              success: true,
              intent: {
                hasNavigationIntent: true,
                targetPage: page,
                confidence: 0.7,
                reasoning: `Fallback detectado: "${keyword}"`
              }
            })
          }
        }
      }

      // Si no hay coincidencias, retornar sin intención
      return NextResponse.json({
        success: true,
        intent: {
          hasNavigationIntent: false,
          confidence: 0.0,
          reasoning: "No se detectó intención de navegación"
        }
      })
    }

  } catch (error) {
    console.error('Error en intent detection:', error)
    
    // Fallback final en caso de error completo
    return NextResponse.json({
      success: true,
      intent: {
        hasNavigationIntent: false,
        confidence: 0.0,
        reasoning: "Error en el sistema"
      }
    })
  }
} 