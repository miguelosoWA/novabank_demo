"use client"

import { useState } from "react"
import { getContextForPath } from "@/lib/conversation-contexts"
import { usePathname } from "next/navigation"

export function NavigationTest() {
  const [testText, setTestText] = useState("")
  const [result, setResult] = useState<any>(null)
  const pathname = usePathname()
  const currentContext = getContextForPath(pathname)

  const testNavigation = async () => {
    if (!testText.trim()) return
    
    try {
      const intentResponse = await fetch('/api/openai/intent-detection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: testText,
          contextId: currentContext.id
        })
      })

      if (intentResponse.ok) {
        const intentData = await intentResponse.json()
        setResult({
          text: testText,
          context: currentContext.name,
          intentData: intentData,
          success: true
        })
      } else {
        setResult({
          text: testText,
          context: currentContext.name,
          error: 'Error al detectar intención',
          success: false
        })
      }
    } catch (error) {
      setResult({
        text: testText,
        context: currentContext.name,
        error: 'Error de conexión',
        success: false
      })
    }
  }

  const simulateEvent = () => {
    if (!testText.trim()) return
    
    const textEvent = new CustomEvent('agentTextResponse', { 
      detail: { text: testText } 
    })
    window.dispatchEvent(textEvent)
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border z-50 max-w-md">
      <h3 className="font-bold mb-2">🧭 Prueba de Navegación</h3>
      
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Texto a probar:</label>
        <input
          type="text"
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          placeholder="Ej: quiero hacer una transferencia"
          className="w-full p-2 border rounded text-sm"
        />
      </div>
      
      <div className="flex gap-2 mb-3">
        <button
          onClick={testNavigation}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          Probar Detección
        </button>
        <button
          onClick={simulateEvent}
          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
        >
          Simular Evento
        </button>
      </div>

      <div className="text-xs">
        <div className="mb-2">
          <strong>Contexto actual:</strong> {currentContext.name}
        </div>
        
        {result && (
          <div className="space-y-2">
            <div>
              <strong>Texto probado:</strong> {result.text}
            </div>
            {result.success ? (
              <>
                <div>
                  <strong>Intención detectada:</strong> {result.intentData.intent.hasNavigationIntent ? 'Sí' : 'No'}
                </div>
                {result.intentData.intent.hasNavigationIntent && (
                  <>
                    <div>
                      <strong>Página objetivo:</strong> {result.intentData.intent.targetPage}
                    </div>
                    <div>
                      <strong>Confianza:</strong> {(result.intentData.intent.confidence * 100).toFixed(1)}%
                    </div>
                    <div>
                      <strong>Razón:</strong> {result.intentData.intent.reasoning}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-red-500">
                <strong>Error:</strong> {result.error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 