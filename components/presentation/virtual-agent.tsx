"use client"

import { useState, useRef, useEffect } from "react"
import { RealtimeAgent, RealtimeAgentRef } from "./realtime-agent"
import { useRouter, usePathname } from "next/navigation"
import { useTransferStore } from '@/lib/store/transfer-store'
import { useCreditCardStore } from '@/lib/store/credit-card-store'

// Logger utility
const Logger = {
  info: (message: string, data?: any) => {
    console.log(`[VirtualAgent] ℹ️ ${message}`, data || '')
  },
  error: (message: string, error?: any) => {
    console.error(`[VirtualAgent] ❌ ${message}`, error || '')
  },
  warn: (message: string, data?: any) => {
    console.warn(`[VirtualAgent] ⚠️ ${message}`, data || '')
  },
  debug: (message: string, data?: any) => {
    console.debug(`[VirtualAgent] 🔍 ${message}`, data || '')
  },
  success: (message: string, data?: any) => {
    console.log(`[VirtualAgent] ✅ ${message}`, data || '')
  }
}

export function VirtualAgent() {
  const [isStreamReady, setIsStreamReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'error' | 'disconnected'>('disconnected')
  const [isMicrophoneActive, setIsMicrophoneActive] = useState(false)
  const streamingAgentRef = useRef<RealtimeAgentRef>(null)
  const router = useRouter()
  const pathname = usePathname()
  const isMountedRef = useRef(true)
  const isTransfersPage = pathname === '/transfers' || pathname === '/transfers/confirmation'
  const isCreditCardPage = pathname === '/credit-card' || pathname === '/credit-card/confirmation'
  const setTransferData = useTransferStore((state) => state.setTransferData)
  const setCreditCardData = useCreditCardStore((state) => state.setCreditCardData)

  const handleStreamReady = () => {
    if (!isMountedRef.current) return
    Logger.info('Conexión de voz establecida')
    setIsStreamReady(true)
    setConnectionState('connected')
    setError(null) // Clear any previous errors when connection is successful
    Logger.success('Sistema de voz directa listo')
  }

  const handleStreamError = (error: string) => {
    if (!isMountedRef.current) return
    
    // In development, WebRTC errors during strict mode are expected
    if (process.env.NODE_ENV === 'development' && 
        (error.includes('setRemoteDescription') || error.includes('m-lines') || error.includes('inicializar'))) {
      Logger.warn('Error de desarrollo detectado (React Strict Mode), ignorando', { error })
      return
    }
    
    Logger.error('Error en el stream', { error })
    setError(error)
    setConnectionState('error')
  }

  const handleMicrophoneToggle = () => {
    if (streamingAgentRef.current) {
      const newState = streamingAgentRef.current.toggleMicrophone()
      setIsMicrophoneActive(newState)
    }
  }

  const handleAgentTextResponse = async (text: string) => {
    if (!isMountedRef.current) return
    
    try {
      Logger.info('Texto recibido del agente Realtime', text)

      const {nombreDestinatario, amount, description} = useTransferStore.getState();
      const {monthlyIncome, employmentStatus, timeEmployed} = useCreditCardStore.getState();

      let body: any = {
        text: text
      }

      if (isTransfersPage) {
        body = {
          text: text,
          nombreDestinatario: nombreDestinatario,
          amount: amount,
          description: description
        }
      }

      if (isCreditCardPage) {
        body = {
          text: text,
          monthlyIncome: monthlyIncome,
          employmentStatus: employmentStatus,
          timeEmployed: timeEmployed
        }
      }

      // Enviar el texto del agente a OpenAI para procesamiento
      Logger.debug('Enviando texto del agente a OpenAI para procesamiento')
      const openaiResponse = await fetch(
        isTransfersPage ? '/api/openai/transfers' : 
        isCreditCardPage ? '/api/openai/credit-card' : 
        '/api/openai', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        }
      )

      if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text()
        Logger.error('Error al procesar con OpenAI', {
          status: openaiResponse.status,
          error: errorText
        })
        throw new Error(`Error al procesar con OpenAI: ${openaiResponse.status} - ${errorText}`)
      }

      const result = await openaiResponse.json()
      Logger.info('Respuesta de OpenAI recibida', result)

      // Procesar la respuesta para navegación
      if (result.response && isMountedRef.current) {
        if (isTransfersPage) {
          // Guardar los datos de la transferencia en el store
          setTransferData(result.response)
          if (result.response.page){
            router.push(`/${result.response.page}`)
          } else {
            router.push('/transfers/confirmation')
          }
        } else if (isCreditCardPage) {
          // Guardar los datos de la tarjeta de crédito en el store
          setCreditCardData(result.response)
          if (result.response.page){
            router.push(`/${result.response.page}`)
          } else {
            router.push('/credit-card/confirmation')
          }
        } else {
          const { page } = result.response
          if (page) {
            router.push(`/${page}`)
          }
        }
        Logger.success('Navegación procesada')
      } else {
        Logger.warn('Respuesta de OpenAI sin datos esperados', { result })
      }
    } catch (err) {
      if (isMountedRef.current) {
        Logger.error('Error al procesar el texto del agente', err)
        setError("Error al procesar la solicitud")
      }
    }
  }

  // Log cuando el componente se monta
  useEffect(() => {
    Logger.info('Componente VirtualAgent montado')
    isMountedRef.current = true
    
    // Escuchar eventos de texto del agente Realtime
    const handleAgentTextEvent = (event: CustomEvent) => {
      if (event.detail && event.detail.text) {
        handleAgentTextResponse(event.detail.text)
      }
    }
    
    window.addEventListener('agentTextResponse', handleAgentTextEvent as EventListener)
    
    return () => {
      Logger.info('Componente VirtualAgent desmontado')
      isMountedRef.current = false
      window.removeEventListener('agentTextResponse', handleAgentTextEvent as EventListener)
    }
  }, [])

  // Log cuando cambia el estado de error (solo en development con errores reales)
  useEffect(() => {
    if (error && isMountedRef.current) {
      // Only log real errors, not development-related ones
      if (!(process.env.NODE_ENV === 'development' && 
            (error.includes('setRemoteDescription') || error.includes('m-lines')))) {
        Logger.error('Error actualizado', { error })
      }
    }
  }, [error])

  // Log cuando cambia el estado de stream
  useEffect(() => {
    if (isMountedRef.current) {
      Logger.debug('Estado del stream actualizado', { isStreamReady })
    }
  }, [isStreamReady])

  return (
    <div className="h-full w-full flex items-end justify-center bg-white relative">
      {/* Show errors only in production or for real errors */}
      {error && process.env.NODE_ENV === 'production' && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg max-w-[80%] z-10">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <RealtimeAgent
        ref={streamingAgentRef}
        onStreamReady={handleStreamReady}
        onStreamError={handleStreamError}
      />

      {/* Botón de micrófono */}
      {isStreamReady && (
        <div className="absolute bottom-6 right-6">
          <button
            onClick={handleMicrophoneToggle}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
              isMicrophoneActive 
                ? 'bg-red-500 hover:bg-red-600 shadow-lg' 
                : 'bg-green-500 hover:bg-green-600 shadow-lg'
            }`}
            title={isMicrophoneActive ? 'Desactivar micrófono' : 'Activar micrófono'}
          >
            {isMicrophoneActive ? (
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse mb-1"></div>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
