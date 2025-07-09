"use client"

import { useState, useRef, useEffect } from "react"
import { RealtimeAgent, RealtimeAgentRef } from "./realtime-agent"
import { useRouter, usePathname } from "next/navigation"
import { useTransferStore } from '@/lib/store/transfer-store'
import { useCreditCardStore } from '@/lib/store/credit-card-store'
import { getContextForPath } from '@/lib/conversation-contexts'
import { AudioRecorder } from './audio-recorder'

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
  const [isMicrophoneActive, setIsMicrophoneActive] = useState(() => {
    // Recuperar estado del micrófono del localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('microphoneActive')
      return saved === 'true'
    }
    return false
  })
  const [isRecording, setIsRecording] = useState(false)
  const [navigationDetected, setNavigationDetected] = useState<string | null>(null)
  const streamingAgentRef = useRef<RealtimeAgentRef>(null)
  const router = useRouter()
  const pathname = usePathname()
  const currentContext = getContextForPath(pathname)
  const isMountedRef = useRef(true)
  const setTransferData = useTransferStore((state) => state.setTransferData)
  const setCreditCardData = useCreditCardStore((state) => state.setCreditCardData)
  
  // Ref para evitar procesar el mismo texto múltiples veces
  const lastProcessedTextRef = useRef<string>('')
  const isProcessingRef = useRef(false)

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
    Logger.info('handleMicrophoneToggle llamado', { 
      currentState: isMicrophoneActive,
      hasRef: !!streamingAgentRef.current 
    })
    
    if (streamingAgentRef.current) {
      const newState = streamingAgentRef.current.toggleMicrophone()
      Logger.info('Estado del micrófono cambiado', { 
        oldState: isMicrophoneActive, 
        newState 
      })
      setIsMicrophoneActive(newState)
      
      // Guardar estado en localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('microphoneActive', newState.toString())
        Logger.info('Estado del micrófono guardado en localStorage', { newState })
      }
    } else {
      Logger.warn('streamingAgentRef.current no disponible')
    }
  }

  const handleUserTranscription = (text: string) => {
    Logger.info('Transcripción del usuario recibida para detección de intención', { text })
    // Solo usar la transcripción para detectar intención de navegación
    handleIntentDetection(text)
  }

  const handleIntentDetection = async (text: string) => {
    if (!isMountedRef.current) {
      Logger.warn('Componente no montado, ignorando detección de intención')
      return
    }
    
    Logger.info('Iniciando detección de intención', { 
      text, 
      isProcessing: isProcessingRef.current,
      lastProcessed: lastProcessedTextRef.current,
      isMounted: isMountedRef.current 
    })
    
    // Evitar procesar el mismo texto múltiples veces para intención
    if (lastProcessedTextRef.current === text || isProcessingRef.current) {
      Logger.debug('Texto ya procesado para intención, ignorando', { 
        text, 
        lastProcessed: lastProcessedTextRef.current,
        isProcessing: isProcessingRef.current 
      })
      return
    }
    
    isProcessingRef.current = true
    lastProcessedTextRef.current = text
    
    Logger.info('Estado de procesamiento actualizado', { 
      isProcessing: isProcessingRef.current,
      lastProcessed: lastProcessedTextRef.current 
    })
    
    try {
      Logger.debug('Detectando intención de navegación...', { text })
      const intentResponse = await fetch('/api/openai/intent-detection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          contextId: currentContext.id
        })
      })

      if (intentResponse.ok) {
        const intentData = await intentResponse.json()
        Logger.debug('Respuesta de detección de intención', intentData)

        if (intentData.success && intentData.intent.hasNavigationIntent && intentData.intent.targetPage) {
          Logger.info('Intención de navegación detectada', {
            targetPage: intentData.intent.targetPage,
            confidence: intentData.intent.confidence,
            reasoning: intentData.intent.reasoning,
            text: text
          })
          
          // Mostrar indicador de navegación
          setNavigationDetected(intentData.intent.targetPage)
          
          // Navegar automáticamente después de una breve pausa
          setTimeout(() => {
            if (isMountedRef.current) {
              router.push(intentData.intent.targetPage)
              setNavigationDetected(null)
              Logger.success('Navegación por intención ejecutada')
            }
          }, 1500) // Pausa para mostrar el indicador
        } else {
          Logger.debug('No se detectó intención de navegación', { 
            intent: intentData.intent,
            text: text 
          })
        }
      } else {
        Logger.warn('Error al detectar intención', { 
          status: intentResponse.status,
          text: text 
        })
      }
    } catch (err) {
      if (isMountedRef.current) {
        Logger.error('Error al detectar intención', err)
      }
    } finally {
      Logger.info('Finalizando detección de intención, programando limpieza')
      // Limpiar el estado de procesamiento después de un delay
      setTimeout(() => {
        if (isMountedRef.current) {
          isProcessingRef.current = false
          lastProcessedTextRef.current = ''
          Logger.info('Estado de procesamiento limpiado')
        } else {
          Logger.warn('Componente desmontado durante limpieza')
        }
      }, 2000) // 2 segundos de delay para evitar procesamiento inmediato
    }
  }

  const handleRecordingStateChange = (isRecording: boolean) => {
    setIsRecording(isRecording)
    Logger.info('Estado de grabación cambiado', { isRecording })
  }

  // Log cuando el componente se monta
  useEffect(() => {
    Logger.info('Componente VirtualAgent montado')
    isMountedRef.current = true
    
    Logger.info('Sistema configurado para solo detección de intención')
    
    return () => {
      Logger.info('Componente VirtualAgent desmontado')
      isMountedRef.current = false
      isProcessingRef.current = false
      lastProcessedTextRef.current = ''
      Logger.info('Estado limpiado')
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

  // Mantener el estado del micrófono después de la navegación
  useEffect(() => {
    if (isStreamReady && isMountedRef.current) {
      Logger.debug('Stream listo, verificando estado del micrófono', { 
        isMicrophoneActive, 
        pathname 
      })
      
      // Recuperar estado del localStorage
      if (typeof window !== 'undefined') {
        const savedState = localStorage.getItem('microphoneActive') === 'true'
        
        Logger.debug('Estado del micrófono en localStorage', { 
          savedState, 
          currentState: isMicrophoneActive 
        })
        
        // Si el estado guardado es diferente al actual, sincronizar
        if (savedState !== isMicrophoneActive) {
          Logger.info('Sincronizando estado del micrófono con localStorage', { 
            savedState, 
            currentState: isMicrophoneActive 
          })
          setIsMicrophoneActive(savedState)
        }
        
        // Si el micrófono debería estar activo pero no lo está en el RealtimeAgent
        if (savedState && streamingAgentRef.current) {
          const currentState = streamingAgentRef.current.isMicrophoneActive()
          Logger.debug('Verificando estado del micrófono en RealtimeAgent', { 
            savedState, 
            currentState 
          })
          if (!currentState) {
            Logger.info('Reactivar micrófono después de navegación')
            streamingAgentRef.current.toggleMicrophone()
          }
        }
      }
    }
  }, [isStreamReady, pathname, isMicrophoneActive])

  return (
    <div className="h-full w-full flex items-end justify-center bg-white relative">
      {/* Show errors only in production or for real errors */}
      {error && process.env.NODE_ENV === 'production' && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg max-w-[80%] z-10">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Indicador de contexto */}
      <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm z-50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-white rounded-full"></span>
          <span>{currentContext.name}</span>
        </div>
      </div>

      {/* Indicador de navegación */}
      {navigationDetected && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg text-sm z-50 animate-pulse">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <div>
              <div>Navegando a {navigationDetected.replace('/', '')}</div>
              <div className="text-xs opacity-90">Intención detectada</div>
            </div>
          </div>
        </div>
      )}

      <RealtimeAgent
        ref={streamingAgentRef}
        contextId={currentContext.id}
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
                <div className={`w-2 h-2 bg-white rounded-full mb-1 ${
                  isRecording ? 'animate-pulse' : ''
                }`}></div>
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
          
          {/* Indicador de estado de grabación */}
          {isRecording && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
              Grabando
            </div>
          )}
        </div>
      )}

      {/* Grabador de audio para capturar voz del usuario */}
      <AudioRecorder
        onTranscription={handleUserTranscription}
        isActive={isMicrophoneActive}
        onRecordingStateChange={handleRecordingStateChange}
      />
    </div>
  )
}
