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

// Presenter Alyssa
const PRESENTER_ID = 'v2_public_fiona_black_jacket_green_screen@477B7MX1Vf'
const DRIVER_ID = 'o1UQHkgCxv'

// Presenter Fiona
// const PRESENTER_ID = 'v2_public_alyssa_red_suite_green_screen@46XonMxLFm'
// const DRIVER_ID = 'LRjggU94ze'

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
    const [isVideoPlaying, setIsVideoPlaying] = useState(false)
    const [retryCount, setRetryCount] = useState(0)

    
    const videoRef = useRef<HTMLVideoElement>(null)
    const wsRef = useRef<WebSocket | null>(null)
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
    const dataChannelRef = useRef<RTCDataChannel | null>(null)
    const statsIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const lastBytesReceivedRef = useRef<number>(0)
    const videoIsPlayingRef = useRef<boolean>(false)
    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    
    // Add connection state management
    const isConnectingRef = useRef<boolean>(false)
    const isMountedRef = useRef<boolean>(true)

    const webSocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL
    const MAX_RETRIES = 3
    const RETRY_DELAY = 2000 // 2 segundos
    const stream_warmup = true

    // Función para obtener datos con reintentos
    const fetchWithRetries = async (url: string, options: RequestInit, retries = MAX_RETRIES): Promise<Response> => {
      try {
        Logger.debug('Iniciando fetch request', { url, options: { ...options, headers: { ...options.headers, Authorization: '***' } } })
        const response = await fetch(url, options)
        Logger.debug('Fetch response recibida', { status: response.status, statusText: response.statusText })
        return response
      } catch (error) {
        if (retries > 0) {
          Logger.warn(`Reintentando fetch (${retries} intentos restantes)`, { url, error })
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
          return fetchWithRetries(url, options, retries - 1)
        }
        Logger.error('Error en fetch request', { 
          url, 
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        })
        throw error
      }
    }

    // Exponer el método sendMessage a través de la referencia
    useImperativeHandle(ref, () => ({
      sendMessage: async (text: string) => {
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
                ssml: true,
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
          } else {
            // Message sent successfully, prepare video for playback
            Logger.info('Mensaje enviado exitosamente, preparando video para reproducción')
            
            // Try to play the video if it's ready
            if (videoRef.current && videoRef.current.readyState >= 3) {
              try {
                // Ensure video is muted first for autoplay compliance
                videoRef.current.muted = true
                await videoRef.current.play()
                Logger.info('Video iniciado tras envío de mensaje')
                
                // Unmute after a short delay
                setTimeout(() => {
                  if (videoRef.current && !videoRef.current.paused) {
                    videoRef.current.muted = false
                    Logger.info('Video desmutado tras envío de mensaje')
                  }
                }, 500)
              } catch (playError) {
                Logger.warn('No se pudo iniciar video automáticamente tras envío:', playError)
              }
            }
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
      
      isConnectingRef.current = false
      
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = null
      }

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
      setIsVideoPlaying(false)
      
      Logger.success('Limpieza completada')
    }

    // Inicializar conexión
    const initializeConnection = async () => {
      if (isConnectingRef.current) {
        Logger.warn('Conexión ya en progreso, ignorando nueva solicitud')
        return
      }

      if (!isMountedRef.current) {
        Logger.warn('Componente desmontado, cancelando conexión')
        return
      }

      isConnectingRef.current = true
      
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

        // Crear stream usando la API REST con reintentos
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
            error: errorText
          })
          throw new Error(`Error al crear stream: ${sessionResponse.status} - ${errorText}`)
        }

        const responseData = await sessionResponse.json()
        Logger.debug('Respuesta del servidor', responseData)

        const { id: newStreamId, offer, ice_servers: iceServers, session_id: newSessionId } = responseData
        Logger.success('Stream creado exitosamente', { streamId: newStreamId, sessionId: newSessionId })
        
        if (!isMountedRef.current) {
          Logger.warn('Componente desmontado durante la conexión, cancelando')
          return
        }
        
        setStreamId(newStreamId)
        setSessionId(newSessionId)

        // Crear PeerConnection
        const answer = await createPeerConnection(offer, iceServers)
        
        if (!isMountedRef.current) {
          Logger.warn('Componente desmontado durante la conexión, cancelando')
          return
        }

        // Enviar respuesta SDP con reintentos
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
            error: errorText
          })
          throw new Error(`Error al enviar SDP: ${sdpResponse.status} - ${errorText}`)
        }

        Logger.success('Conexión establecida exitosamente')
        isConnectingRef.current = false

        // Send initial welcome message to make avatar appear
        sendInitialWelcomeMessage(newStreamId, newSessionId)

      } catch (err) {
        isConnectingRef.current = false
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

    // Función para enviar mensaje inicial de bienvenida
    const sendInitialWelcomeMessage = async (streamId: string, sessionId: string) => {
      // Wait a short delay to ensure the stream is fully ready
      setTimeout(async () => {
        console.log(`streamId: ${streamId}, sessionId: ${sessionId}, isMountedRef.current: ${isMountedRef.current}`)
        if (!streamId || !sessionId || !isMountedRef.current) {
          Logger.warn('Stream no está listo para mensaje inicial')
          return
        }

        try {
          Logger.info('Stream listo - no enviando mensaje inicial automático')
          // Don't send automatic welcome message to prevent immediate video playback
          // The avatar will only start when the user actually sends a message
          
          // Just mark the stream as ready without triggering video playback
          setIsStreamReady(true)
          onStreamReady?.()
          
        } catch (err) {
          Logger.warn('Error al preparar stream inicial', err)
        }
      }, 100) // Wait 100ms to ensure connection is stable
    }

    // Crear PeerConnection
    const createPeerConnection = async (offer: RTCSessionDescriptionInit, iceServers: RTCIceServer[]) => {
      try {
        // Clean up any existing connection first
        if (peerConnectionRef.current) {
          peerConnectionRef.current.close()
          peerConnectionRef.current = null
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
            if (isMountedRef.current) {
              restartConnection()
            }
          }
        })
        
        peerConnectionRef.current.addEventListener('connectionstatechange', () => {
          Logger.info('Connection state changed', { state: peerConnectionRef.current?.connectionState })
          if (peerConnectionRef.current?.connectionState === 'connected') {
            setIsStreaming(true)
            setConnectionState('connected')
            // Start monitoring stats when connection is established
            // startStatsMonitoring()
            onStreamReady?.()
          }
        })
        
        peerConnectionRef.current.addEventListener('track', handleTrack)
        dataChannelRef.current.addEventListener('message', handleDataChannelMessage)
        // Limpia cualquier conexión previa antes de crear una nueva
        //if (peerConnectionRef.current) {
        // Logger.info('Cerrando PeerConnection previa antes de crear una nueva', { signalingState: peerConnectionRef.current.signalingState })
        //peerConnectionRef.current.close()
        //peerConnectionRef.current = null
        //}
        //if (dataChannelRef.current) {
         // dataChannelRef.current.close()
         // dataChannelRef.current = null
        //}

        await peerConnectionRef.current.setRemoteDescription(offer)
        Logger.debug('Remote description establecida')
        
        const answer = await peerConnectionRef.current.createAnswer()
        await peerConnectionRef.current.setLocalDescription(answer)
        Logger.debug('Local description establecida')
        
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
              Authorization: `Basic ${btoa(apiKey)}`,
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
              const videoStatusChanged = videoIsPlayingRef.current !== (report.bytesReceived > lastBytesReceivedRef.current)
              if (videoStatusChanged) {
                videoIsPlayingRef.current = report.bytesReceived > lastBytesReceivedRef.current
                Logger.debug('Video status changed', { 
                  isPlaying: videoIsPlayingRef.current,
                  bytesReceived: report.bytesReceived 
                })
                
                // Keep video visible when receiving data
                if (videoRef.current && videoIsPlayingRef.current) {
                  // Video is receiving data - content will show over background
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
        // Esperar a que el video esté listo
        if (video.readyState < 3) {
          await new Promise((resolve) => {
            video.addEventListener('canplay', resolve, { once: true })
          })
        }

        // Start muted to comply with autoplay policies
        video.muted = true
        
        // Intentar reproducir
        await video.play()
        Logger.info('Video reproduciendo correctamente')
        
        // Unmute after successful playback starts
        setTimeout(() => {
          if (video && !video.paused) {
            video.muted = false
            Logger.info('Video desmutado tras inicio exitoso')
          }
        }, 1000)
        
      } catch (error) {
        Logger.warn('No se pudo iniciar video automáticamente (comportamiento esperado):', error)
        // This is expected behavior in many browsers when there's no user interaction
        // The video will start when the user interacts or when content is actually sent
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
          
          // Don't make video visible immediately, wait for actual content
          
          // Configurar eventos del video
          videoRef.current.onloadedmetadata = async () => {
            Logger.info('Video metadata cargada')
            // Don't auto-play, wait for actual conten
               }

          videoRef.current.oncanplay = () => {
            Logger.info('Video listo para reproducir')
            // Don't show video yet, wait for playing event
          }

          videoRef.current.onplaying = () => {
            Logger.info('Video reproduciendo')
            // Mark that video content is playing (background will be hidden by video content)
            setIsVideoPlaying(true)
          }

          videoRef.current.onwaiting = () => {
            Logger.debug('Video buffering')
            // Keep video visible when buffering
          }

          videoRef.current.onstalled = () => {
            Logger.debug('Video stalled')
            // Keep video visible when stalled
          }

          videoRef.current.onseeking = () => {
            Logger.debug('Video seeking')
            // Keep video visible when seeking
          }

          videoRef.current.onerror = (e) => {
            Logger.error('Error en video', e)
            if (e && typeof e === 'object' && 'target' in e) {
              const videoElement = e.target as HTMLVideoElement
              console.error('Video error details:', videoElement.error)
            }
            restartConnection()
          }

          // Configurar audio
          videoRef.current.volume = 1.0
          videoRef.current.muted = false

          // Add event listener to detect when actual video content starts
          event.track.addEventListener('unmute', () => {
            Logger.info('Track unmuted - content available')
            if (videoRef.current && videoRef.current.readyState >= 3) {
              videoRef.current.play().catch(err => {
                Logger.warn('Could not auto-play video:', err)
              })
            }
          })

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
      isMountedRef.current = true
      
      // Only initialize if we're not already connecting and no existing connection
      if (!isConnectingRef.current && !streamId) {
        initializeConnection()
      }
      
      return () => {
        Logger.info('Componente desmontándose')
        isMountedRef.current = false
        cleanup()
      }
    }, [])

    // Reset retry count when component remounts
    useEffect(() => {
      if (isMountedRef.current && connectionState === 'disconnected' && !isConnectingRef.current) {
        setRetryCount(0)
      }
    }, [connectionState])
  

    // Manejar el evento de error del v

    return (
      <div className="relative h-full w-full">
        {/* {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg max-w-[80%] z-10"
          >
            <p className="text-sm">{error}</p>
          </motion.div>
        )} */}

        {/* Estado de conexión */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm z-50">
          {connectionState}
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "tween", duration: 0.6, ease: "easeOut" }}
          className="relative h-[96%] flex items-center justify-center"
        >
          {/* Video with background image that shows when no video content is playing */}
          <video
            ref={videoRef}
            className="video-no-controls video-smooth-transition h-[96%] w-auto object-contain object-bottom mt-auto"
            playsInline
            muted={true}
            preload="metadata"
            autoPlay
            style={{ 
              opacity: 1, // Always visible
              visibility: 'visible',
              display: 'block',
              background: 'transparent',
              marginTop: '43px', // Move video down by 2 pixels
            }}
            // Hide all default video controls and indicators
            controls={false}
            disablePictureInPicture={true}
            onError={(e) => {
              Logger.error('Error en video', e)
              if (e && typeof e === 'object' && 'target' in e) {
                const videoElement = e.target as HTMLVideoElement
                console.error('Video error details:', videoElement.error)
              }
            }}
            onLoadedMetadata={() => {
              Logger.info('Video metadata cargada')
              console.log('Video dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight)
            }}
            onCanPlay={async () => {
              Logger.info('Video listo para reproducir')
              console.log('Video can play - duration:', videoRef.current?.duration)
              
              // Try to play the video automatically when it's ready
              if (videoRef.current) {
                try {
                  await videoRef.current.play()
                  Logger.info('Video iniciado automáticamente')
                  
                  // Unmute after a short delay if playback is successful
                  setTimeout(() => {
                    if (videoRef.current && !videoRef.current.paused) {
                      videoRef.current.muted = false
                      Logger.info('Video desmutado tras inicio exitoso')
                    }
                  }, 1000)
                } catch (playError) {
                  Logger.warn('No se pudo iniciar video automáticamente (esperado en algunos navegadores):', playError)
                  // This is expected behavior in many browsers, not a real error
                }
              }
            }}
            onPlaying={() => {
              Logger.info('Video reproduciendo')
              console.log('Video is now playing')
              setIsVideoPlaying(true)
            }}
            onPause={() => Logger.info('Video pausado')}
            onEnded={() => Logger.info('Video finalizado')}
            onLoadStart={() => {
              Logger.info('Video load started')
              console.log('Video load started')
            }}
            onProgress={() => {
              Logger.debug('Video loading progress')
            }}
            onWaiting={() => {
              Logger.debug('Video waiting/buffering')
              // Don't change opacity when buffering
            }}
          />
        </motion.div>
      </div>
    )
  }
) 
