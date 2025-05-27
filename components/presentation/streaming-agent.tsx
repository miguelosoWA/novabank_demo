"use client"

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react"
import { motion } from "framer-motion"

// Logger utility
const Logger = {
  info: (message: string, data?: any) => {
    console.log(`[StreamingAgent] ℹ️ ${message}`, data || '')
  },
  error: (message: string, error?: any) => {
    console.error(`[StreamingAgent] ❌ ${message}`, error || '')
  },
  warn: (message: string, data?: any) => {
    console.warn(`[StreamingAgent] ⚠️ ${message}`, data || '')
  },
  debug: (message: string, data?: any) => {
    console.debug(`[StreamingAgent] 🔍 ${message}`, data || '')
  },
  success: (message: string, data?: any) => {
    console.log(`[StreamingAgent] ✅ ${message}`, data || '')
  }
}

interface StreamingAgentProps {
  apiKey: string
  onStreamReady?: () => void
  onStreamError?: (error: string) => void
}

export interface StreamingAgentRef {
  sendMessage: (text: string) => void
}

const PRESENTER_TYPE = 'clip'
const PRESENTER_ID = 'v2_public_alyssa_red_suite_green_screen@46XonMxLFm'
const DRIVER_ID = 'LRjggU94ze'

// const PRESENTER_ID = 'rian-pbMoTzs7an'
// const DRIVER_ID = 'czarwf1D01'

export const StreamingAgent = forwardRef<StreamingAgentRef, StreamingAgentProps>(
  ({ apiKey, onStreamReady, onStreamError }, ref) => {
    const [isStreaming, setIsStreaming] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [streamId, setStreamId] = useState<string | null>(null)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [connectionState, setConnectionState] = useState<string>('disconnected')
    const [isWebSocketReady, setIsWebSocketReady] = useState(false)
    const [isStreamReady, setIsStreamReady] = useState(false)
    const [hasUserInteracted, setHasUserInteracted] = useState(false)
    
    const videoRef = useRef<HTMLVideoElement>(null)
    const wsRef = useRef<WebSocket | null>(null)
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
    const dataChannelRef = useRef<RTCDataChannel | null>(null)
    const statsIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const lastBytesReceivedRef = useRef<number>(0)
    const videoIsPlayingRef = useRef<boolean>(false)

    const webSocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL
    const stream_warmup = true

    // Exponer el método sendMessage a través de la referencia
    useImperativeHandle(ref, () => ({
      sendMessage: async (text: string) => {
        if (!hasUserInteracted) {
          setHasUserInteracted(true)
          await initializeConnection()
        }

        if (!streamId || !sessionId) {
          Logger.error('No hay stream o sesión activa')
          setError("No hay stream o sesión activa")
          return
        }

        try {
          Logger.info('Enviando mensaje al agente', { text })

          const apiUrl = process.env.NEXT_PUBLIC_DID_API_URL || 'https://api.d-id.com'
          const endpoint = `${apiUrl}/clips/streams/${streamId}`


          // Mock response for development
          // return {
          //   ok: true,
          //   json: () => Promise.resolve({
          //     id: 'mock-response-id',
          //     status: 'created',
          //     created_at: new Date().toISOString()
          //   })
          // } as Response;
          
          const response = await fetchWithRetries(endpoint, {
            method: 'POST',
            headers: {
              Authorization: `Basic ${btoa(apiKey)}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              script: {
                type: 'text',
                subtitles: 'false',
                provider: {
                  type: 'microsoft',
                  voice_id: 'es-MX-DaliaNeural',
                },
                ssml: false,
                input: text,
              },
              config: {
                stitch: true,
                fluent: true,
              },
              audio_optimization: 5,
              background: {
                color: '#FFFFFF',
              },
              session_id: sessionId,
            }),
          })

          if (!response.ok) {
            const errorText = await response.text()
            Logger.error('Error al enviar mensaje', {
              status: response.status,
              statusText: response.statusText,
              error: errorText,
              text
            })
            // throw new Error(`Error al enviar mensaje: ${response.status} - ${errorText}`)
          }

          const result = await response.json()
          Logger.debug('Respuesta del servidor', result)

          Logger.success('Mensaje enviado al stream', { text })
        } catch (err) {
          Logger.error('Error al enviar mensaje', err)
          // setError("Error al comunicarse con el agente virtual")
          // onStreamError?.("Error al comunicarse con el agente virtual")
        }
      }
    }))

    // Función para reiniciar la conexión
    const restartConnection = () => {
      Logger.error('Error en la conexión')
      setError("No se pudo establecer la conexión")
      setConnectionState('error')
      onStreamError?.("No se pudo establecer la conexión")
      cleanup()
    }

    // Limpiar recursos
    const cleanup = () => {
      Logger.info('Limpiando recursos')
      
      if (statsIntervalRef.current) {
        clearInterval(statsIntervalRef.current)
        statsIntervalRef.current = null
      }

      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
      
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
        peerConnectionRef.current = null
      }
      
      if (dataChannelRef.current) {
        dataChannelRef.current.close()
        dataChannelRef.current = null
      }
      
      setStreamId(null)
      setSessionId(null)
      setIsStreaming(false)
      setConnectionState('disconnected')
      setIsWebSocketReady(false)
      setIsStreamReady(false)
      
      Logger.success('Limpieza completada')
    }

    // Función para hacer fetch sin reintentos
    const fetchWithRetries = async (url: string, options: RequestInit): Promise<Response> => {
      try {
        Logger.debug('Iniciando fetch request', { url, options: { ...options, headers: { ...options.headers, Authorization: '***' } } })
        const response = await fetch(url, options)
        Logger.debug('Fetch response recibida', { status: response.status, statusText: response.statusText })
        return response
      } catch (error) {
        Logger.error('Error en fetch request', { 
          url, 
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        })
        throw error
      }
    }

    // Inicializar la conexión
    const initializeConnection = async () => {
      try {
        Logger.info('Iniciando conexión')
        
        const apiUrl = process.env.NEXT_PUBLIC_DID_API_URL || 'https://api.d-id.com'
        const endpoint = `${apiUrl}/clips/streams`
        
        Logger.debug('Configuración de conexión', {
          apiUrl,
          endpoint,
          hasApiKey: !!apiKey,
          presenterId: PRESENTER_ID,
          driverId: DRIVER_ID
        })

        if (!apiKey) {
          throw new Error('API key no proporcionada')
        }
        
        // Crear stream usando la API REST
        const sessionResponse = await fetchWithRetries(
          endpoint,
          {
            method: 'POST',
            headers: {
              Authorization: `Basic ${btoa(apiKey)}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              presenter_id: PRESENTER_ID,
              driver_id: DRIVER_ID,
              stream_warmup
            }),
          }
        )

        if (!sessionResponse.ok) {
          const errorText = await sessionResponse.text()
          Logger.error('Error en respuesta del servidor', {
            status: sessionResponse.status,
            statusText: sessionResponse.statusText,
            error: errorText,
            headers: Object.fromEntries(sessionResponse.headers.entries())
          })
          throw new Error(`Error al crear stream: ${sessionResponse.status} - ${errorText}`)
        }

        const responseData = await sessionResponse.json()
        Logger.debug('Respuesta del servidor', responseData)

        const { id: newStreamId, offer, ice_servers: iceServers, session_id: newSessionId } = responseData
        Logger.success('Stream creado exitosamente', { streamId: newStreamId, sessionId: newSessionId })
        
        setStreamId(newStreamId)
        setSessionId(newSessionId)

        // Crear PeerConnection
        const answer = await createPeerConnection(offer, iceServers)
        
        // Enviar respuesta SDP
        const sdpResponse = await fetchWithRetries(
          `${apiUrl}/clips/streams/${newStreamId}/sdp`,
          {
            method: 'POST',
            headers: {
              Authorization: `Basic ${btoa(apiKey)}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              answer,
              session_id: newSessionId,
            }),
          }
        )

        if (!sdpResponse.ok) {
          const errorText = await sdpResponse.text()
          Logger.error('Error en respuesta SDP', {
            status: sdpResponse.status,
            statusText: sdpResponse.statusText,
            error: errorText,
            headers: Object.fromEntries(sdpResponse.headers.entries())
          })
          throw new Error(`Error al enviar SDP: ${sdpResponse.status} - ${errorText}`)
        }

        Logger.success('Conexión establecida exitosamente')

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
        Logger.error('Error al inicializar conexión', { 
          error: errorMessage,
          stack: err instanceof Error ? err.stack : undefined
        })
        setError(`Error al inicializar la conexión: ${errorMessage}`)
        setConnectionState('error')
        onStreamError?.(`Error al inicializar la conexión: ${errorMessage}`)
        restartConnection()
      }
    }

    // Crear PeerConnection
    const createPeerConnection = async (offer: RTCSessionDescriptionInit, iceServers: RTCIceServer[]) => {
      try {
        // Limpia cualquier conexión previa antes de crear una nueva
        if (peerConnectionRef.current) {
          Logger.info('Cerrando PeerConnection previa antes de crear una nueva', { signalingState: peerConnectionRef.current.signalingState })
          peerConnectionRef.current.close()
          peerConnectionRef.current = null
        }
        if (dataChannelRef.current) {
          dataChannelRef.current.close()
          dataChannelRef.current = null
        }

        peerConnectionRef.current = new RTCPeerConnection({ iceServers })
        dataChannelRef.current = peerConnectionRef.current.createDataChannel('JanusDataChannel')

        peerConnectionRef.current.addEventListener('icegatheringstatechange', () => {
          Logger.debug('ICE gathering state changed', { state: peerConnectionRef.current?.iceGatheringState })
        })
        peerConnectionRef.current.addEventListener('icecandidate', handleICECandidate)
        peerConnectionRef.current.addEventListener('iceconnectionstatechange', () => {
          Logger.info('ICE connection state changed', { state: peerConnectionRef.current?.iceConnectionState })
          if (peerConnectionRef.current?.iceConnectionState === 'failed' || 
              peerConnectionRef.current?.iceConnectionState === 'closed') {
            restartConnection()
          }
        })
        peerConnectionRef.current.addEventListener('connectionstatechange', () => {
          Logger.info('Connection state changed', { state: peerConnectionRef.current?.connectionState })
          if (peerConnectionRef.current?.connectionState === 'connected') {
            setIsStreaming(true)
            setConnectionState('connected')
            onStreamReady?.()
          }
        })
        peerConnectionRef.current.addEventListener('track', handleTrack)
        dataChannelRef.current.addEventListener('message', handleDataChannelMessage)

        const pc = peerConnectionRef.current
        Logger.debug('Signaling state before setRemoteDescription:', pc.signalingState)
        await pc.setRemoteDescription(offer)
        Logger.debug('Signaling state after setRemoteDescription:', pc.signalingState)

        const answer = await pc.createAnswer()
        Logger.debug('Signaling state before setLocalDescription:', pc.signalingState)
        await pc.setLocalDescription(answer)
        Logger.debug('Signaling state after setLocalDescription:', pc.signalingState)

        return answer
      } catch (err) {
        Logger.error('Error al crear PeerConnection', err)
        throw err
      }
    }

    // Manejar candidatos ICE
    const handleICECandidate = async (event: RTCPeerConnectionIceEvent) => {
      if (!event.candidate || !streamId || !sessionId) return

      try {
        const { candidate, sdpMid, sdpMLineIndex } = event.candidate
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DID_API_URL}/clips/streams/${streamId}/ice`,
          {
            method: 'POST',
            headers: {
              Authorization: `Basic ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              candidate,
              sdpMid,
              sdpMLineIndex,
              session_id: sessionId,
            }),
          }
        )

        if (!response.ok) {
          throw new Error(`Error al enviar ICE candidate: ${response.status}`)
        }

        Logger.debug('ICE candidate enviado')
      } catch (err) {
        Logger.error('Error al enviar ICE candidate', err)
      }
    }

    // Monitoreo de estadísticas
    const startStatsMonitoring = () => {
      if (statsIntervalRef.current) {
        clearInterval(statsIntervalRef.current)
      }

      statsIntervalRef.current = setInterval(async () => {
        if (peerConnectionRef.current) {
          const stats = await peerConnectionRef.current.getStats()
          stats.forEach((report) => {
            if (report.type === 'inbound-rtp' && report.kind === 'video') {
              const videoStatusChanged = videoIsPlayingRef.current !== report.bytesReceived > lastBytesReceivedRef.current
              if (videoStatusChanged) {
                videoIsPlayingRef.current = report.bytesReceived > lastBytesReceivedRef.current
                if (videoRef.current && videoIsPlayingRef.current) {
                  videoRef.current.style.opacity = isStreamReady ? '1' : '0'
                }
              }
              lastBytesReceivedRef.current = report.bytesReceived
            }
          })
        }
      }, 500)
    }

    // Manejar SDP
    const handleSDP = async (message: any) => {
      try {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(message.payload)
          Logger.debug('SDP procesado exitosamente')
        }
      } catch (err) {
        Logger.error('Error en SDP', err)
      }
    }

    // Manejar ICE
    const handleICE = async (message: any) => {
      try {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.addIceCandidate(message.payload)
          Logger.debug('ICE candidate agregado')
        }
      } catch (err) {
        Logger.error('Error en ICE', err)
      }
    }

    // Función para manejar la reproducción del video de manera segura
    const safePlayVideo = async (video: HTMLVideoElement) => {
      if (!video) return

      try {
        // Configurar el video como muted por defecto para permitir autoplay
        video.muted = true
        
        // Esperar a que el video esté listo
        if (video.readyState < 3) {
          await new Promise((resolve) => {
            video.addEventListener('canplay', resolve, { once: true })
          })
        }

        // Intentar reproducir
        await video.play()
        Logger.info('Video reproduciendo correctamente (muted)')
        
        // Intentar desmutear después de un tiempo
        setTimeout(() => {
          if (video) {
            video.muted = false
            Logger.info('Video desmutado')
          }
        }, 1000)
      } catch (error) {
        Logger.error('Error al reproducir video', error)
      }
    }

    // Manejar tracks
    const handleTrack = async (event: RTCTrackEvent) => {
      if (!event.track || !event.streams[0]) {
        Logger.error('Track inválido recibido')
        return
      }

      Logger.info('Track recibido', { 
        kind: event.track.kind,
        readyState: event.track.readyState,
        enabled: event.track.enabled
      })
      
      if (videoRef.current) {
        try {
          // Asegurarse de que el video esté configurado correctamente
          videoRef.current.srcObject = event.streams[0]
          
          // Configurar eventos del video
          videoRef.current.onloadedmetadata = async () => {
            Logger.info('Video metadata cargada')
            if (videoRef.current) {
              await safePlayVideo(videoRef.current)
            }
          }

          videoRef.current.oncanplay = () => {
            Logger.info('Video listo para reproducir')
            setIsStreamReady(true)
          }

          videoRef.current.onplaying = () => {
            Logger.info('Video reproduciendo')
          }

          videoRef.current.onerror = (e) => {
            Logger.error('Error en video', e)
            restartConnection()
          }

          // Configurar audio
          videoRef.current.volume = 1.0

        } catch (err) {
          Logger.error('Error al configurar video', err)
          restartConnection()
        }
      }
    }

    // Manejar mensajes del data channel
    const handleDataChannelMessage = async (event: MessageEvent) => {
      try {
        const data = event.data
        Logger.debug('Mensaje recibido en data channel', { data })

        // Si es un string simple, manejarlo como mensaje de estado
        if (typeof data === 'string') {
          if (data === 'stream/started') {
            Logger.info('Stream iniciado')
            return
          }
          if (data === 'stream/ended') {
            Logger.info('Stream finalizado')
            return
          }
        }

        // Intentar parsear como JSON solo si parece ser un objeto JSON
        if (typeof data === 'string' && (data.startsWith('{') || data.startsWith('['))) {
          try {
            const message = JSON.parse(data)
            Logger.debug('Mensaje JSON procesado', { message })
          } catch (parseError) {
            Logger.warn('Error al parsear mensaje JSON', { data, error: parseError })
          }
        }
      } catch (err) {
        Logger.error('Error al procesar mensaje', err)
        setError("Error al procesar la solicitud")
      }
    }

    // Inicializar al montar
    useEffect(() => {
      Logger.info('Componente montado, iniciando conexión')
      initializeConnection()
      return () => {
        cleanup()
      }
    }, [])

    return (
      <div className="relative h-full w-full">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg max-w-[80%] z-10"
          >
            <p className="text-sm">{error}</p>
          </motion.div>
        )}

        {/* Estado de conexión */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm z-50">
          {connectionState}
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.7 }}
          className="relative h-[95%] flex items-center justify-center"
        >
          {/* Imagen por defecto antes de que el usuario interactúe */}
          {!hasUserInteracted && (
            <img
              src="/avatar-did.png"
              alt="Avatar por defecto"
              className="h-[80%] w-auto object-contain transition-opacity duration-300"
              style={{ position: 'absolute', left: 0, right: 0, margin: 'auto' }}
            />
          )}
          
          {/* Video solo se muestra después de la interacción del usuario */}
          {hasUserInteracted && (
            <video
              ref={videoRef}
              className={`h-[80%] w-auto object-contain transition-opacity duration-300 ${!isStreamReady ? "opacity-0 absolute" : "opacity-100 relative"}`}
              autoPlay
              playsInline
              muted={false}
              onError={(e) => Logger.error('Error en video', e)}
              onLoadedMetadata={() => Logger.info('Video metadata cargada')}
              onCanPlay={() => Logger.info('Video listo para reproducir')}
              onPlaying={() => Logger.info('Video reproduciendo')}
              onPause={() => Logger.info('Video pausado')}
              onEnded={() => Logger.info('Video finalizado')}
            />
          )}
        </motion.div>
      </div>
    )
  }
) 