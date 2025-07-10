"use client"

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react"
import { motion } from "framer-motion"
import { getContextById, type ConversationContext } from "@/lib/conversation-contexts"
import { SphereVisualization } from "./sphere-visualization"
import { SphereVisual } from "./sphere-visual"

// Declarar CustomEvent para TypeScript
declare global {
  interface WindowEventMap {
    'agentTextResponse': CustomEvent<{ text: string }>
    'userTextResponse': CustomEvent<{ text: string }>
  }
  interface Window {
    webkitAudioContext: typeof AudioContext
  }
}

// Tipos para el sistema de navegación

// Logger utility
const Logger = {
  info: (message: string, data?: any) => {
    console.log(`[RealtimeAgent] ℹ️ ${message}`, data || '')
  },
  error: (message: string, error?: any) => {
    console.error(`[RealtimeAgent] ❌ ${message}`, error || '')
  },
  warn: (message: string, data?: any) => {
    console.warn(`[RealtimeAgent] ⚠️ ${message}`, data || '')
  },
  debug: (message: string, data?: any) => {
    console.debug(`[RealtimeAgent] 🔍 ${message}`, data || '')
  },
  success: (message: string, data?: any) => {
    console.log(`[RealtimeAgent] ✅ ${message}`, data || '')
  }
}

interface RealtimeAgentProps {
  onStreamReady?: () => void
  onStreamError?: (error: string) => void
  contextId?: string
}

export interface RealtimeAgentRef {
  sendMessage: (text: string) => void
  toggleMicrophone: () => boolean
  isMicrophoneActive: () => boolean
}

export const RealtimeAgent = forwardRef<RealtimeAgentRef, RealtimeAgentProps>(
  ({ onStreamReady, onStreamError, contextId = 'general' }, ref) => {
    const [isConnected, setIsConnected] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'error' | 'disconnected'>('disconnected')
    const [isInitializing, setIsInitializing] = useState(false)
    const [isDataChannelAvailable, setIsDataChannelAvailable] = useState(false)
    const [isMicrophoneActive, setIsMicrophoneActive] = useState(false)
    const [currentContext, setCurrentContext] = useState<ConversationContext>(getContextById(contextId))
    
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
    const dataChannelRef = useRef<RTCDataChannel | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const audioTrackRef = useRef<MediaStreamTrack | null>(null)
    const isMountedRef = useRef(true)
    const userTextRef = useRef<string>('')
    
    // Audio nodes for visualization - these are gain nodes connected to destination
    const inputAudioNodeRef = useRef<AudioNode | null>(null)
    const outputAudioNodeRef = useRef<AudioNode | null>(null)
    const audioContextRef = useRef<AudioContext | null>(null)
    
    // Source nodes for actual audio input/output
    const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
    const outputSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set())

    // Expose connection status and microphone control through ref
    useImperativeHandle(ref, () => ({
      sendMessage: async (text: string) => {
        // This method is kept for compatibility but not used in voice-only mode
        Logger.warn('sendMessage llamado pero no usado en modo voz directa', { text })
      },
      toggleMicrophone: () => {
        if (audioTrackRef.current) {
          const newState = !audioTrackRef.current.enabled
          audioTrackRef.current.enabled = newState
          setIsMicrophoneActive(newState)
          
          // Control input gain for visualization based on microphone state
          if (inputAudioNodeRef.current && 'gain' in inputAudioNodeRef.current) {
            const gainNode = inputAudioNodeRef.current as GainNode
            gainNode.gain.value = newState ? 1.0 : 0.0
            Logger.info(`Input gain set to ${gainNode.gain.value}`)
          }
          
          Logger.info(`Micrófono ${newState ? 'activado' : 'desactivado'}`)
          return newState
        }
        return false
      },
      isMicrophoneActive: () => {
        return audioTrackRef.current?.enabled || false
      }
    }))

    // Initialize WebRTC connection
    const initializeConnection = async () => {
      if (isInitializing || isConnected) {
        Logger.warn('Conexión ya en progreso o establecida')
        return
      }

      if (!isMountedRef.current) {
        Logger.warn('Componente desmontado, cancelando conexión')
        return
      }

      setIsInitializing(true)
      setConnectionState('connecting')
      setError(null)
      
      try {
        Logger.info('Iniciando conexión WebRTC')

        // Get ephemeral token from server
        const tokenResponse = await fetch('/api/openai/realtime-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            voice: 'alloy' // Voz fija para todos los contextos
          })
        })

        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text()
          throw new Error(`Error al obtener token: ${tokenResponse.status} - ${errorText}`)
        }

        const tokenData = await tokenResponse.json()
        
        if (!tokenData.client_secret || !tokenData.client_secret.value) {
          throw new Error('Token ephemeral inválido o expirado')
        }
        
        const ephemeralKey = tokenData.client_secret.value

        Logger.debug('Token ephemeral obtenido', { expiresAt: tokenData.client_secret.expires_at })

        // Create peer connection with proper configuration
        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        })
        peerConnectionRef.current = pc

        // Set up audio context for visualization
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
          
          // Create gain nodes for visualization (similar to working live-audio implementation)
          const inputGainNode = audioContextRef.current.createGain()
          const outputGainNode = audioContextRef.current.createGain()
          
          // Set initial gain levels
          inputGainNode.gain.value = 0.0 // Start muted since microphone is disabled
          outputGainNode.gain.value = 1.0 // Enable output audio
          
          // Connect gain nodes to destination to enable audio flow
          inputGainNode.connect(audioContextRef.current.destination)
          outputGainNode.connect(audioContextRef.current.destination)
          
          // Store gain nodes for visualization
          inputAudioNodeRef.current = inputGainNode
          outputAudioNodeRef.current = outputGainNode
          
          // Resume audio context to enable audio processing
          try {
            await audioContextRef.current.resume()
            Logger.info('Audio context and gain nodes created successfully', {
              contextState: audioContextRef.current.state,
              sampleRate: audioContextRef.current.sampleRate
            })
          } catch (error) {
            Logger.warn('Could not resume audio context', error)
          }
        }

        // Set up audio element for remote audio
        if (!audioRef.current) {
          audioRef.current = document.createElement('audio')
          audioRef.current.autoplay = true
          audioRef.current.style.display = 'none'
          document.body.appendChild(audioRef.current)
        }

        // Handle incoming audio tracks
        pc.ontrack = (event) => {
          Logger.info('Track recibido', { kind: event.track.kind })
          if (audioRef.current && event.streams[0]) {
            audioRef.current.srcObject = event.streams[0]
            
            // Ensure audio plays
            audioRef.current.play().catch(error => {
              Logger.warn('Could not auto-play audio', error)
            })
            
            // Connect incoming audio stream to output gain node for visualization
            if (audioContextRef.current && outputAudioNodeRef.current) {
              try {
                const source = audioContextRef.current.createMediaStreamSource(event.streams[0])
                
                // Connect source to output gain node - this is what the SphereVisual analyzes
                source.connect(outputAudioNodeRef.current)
                
                // The gain node should already be connected to destination, so audio flows:
                // source -> outputGainNode -> destination (for hearing)
                //       \-> analyser (for visualization in SphereVisual)
                
                Logger.info('Output audio source connected to gain node', {
                  contextState: audioContextRef.current.state,
                  streamActive: event.streams[0].active,
                  trackCount: event.streams[0].getTracks().length,
                  streamTracks: event.streams[0].getTracks().map(t => ({ kind: t.kind, enabled: t.enabled })),
                  gainNodeConnected: !!outputAudioNodeRef.current
                })
              } catch (error) {
                Logger.warn('Could not connect output audio source', error)
              }
            }
          }
        }

        // Add connection state change handler
        pc.addEventListener('connectionstatechange', () => {
          Logger.info('Connection state changed', { state: pc.connectionState })
          if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
            setConnectionState('error')
            setError(`Conexión falló: ${pc.connectionState}`)
            onStreamError?.(`Conexión falló: ${pc.connectionState}`)
          }
        })

        // Add ICE connection state change handler
        pc.addEventListener('iceconnectionstatechange', () => {
          Logger.info('ICE connection state changed', { state: pc.iceConnectionState })
          if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'closed') {
            setConnectionState('error')
            setError(`Conexión ICE falló: ${pc.iceConnectionState}`)
            onStreamError?.(`Conexión ICE falló: ${pc.iceConnectionState}`)
          }
        })

        // Add local audio track for microphone input (initially disabled)
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            }
          })
          
          // Store the media stream for later use
          const audioTrack = mediaStream.getAudioTracks()[0]
          if (audioTrack) {
            // Initially disable the microphone until user activates it
            audioTrack.enabled = false
            audioTrackRef.current = audioTrack
            setIsMicrophoneActive(false)
            pc.addTrack(audioTrack, mediaStream)
            Logger.info('Micrófono local agregado (inicialmente deshabilitado)')
            
            // Create audio source and connect to input gain node for visualization
            if (audioContextRef.current && inputAudioNodeRef.current) {
              try {
                const source = audioContextRef.current.createMediaStreamSource(mediaStream)
                
                // Connect source to input gain node - this is what the SphereVisual analyzes
                source.connect(inputAudioNodeRef.current)
                inputSourceRef.current = source
                
                // The gain node should already be connected to destination, so audio flows:
                // source -> inputGainNode -> destination (for monitoring/feedback prevention)
                //       \-> analyser (for visualization in SphereVisual)
                
                Logger.info('Input audio source connected to gain node', {
                  contextState: audioContextRef.current.state,
                  sampleRate: audioContextRef.current.sampleRate,
                  microphoneEnabled: audioTrack.enabled,
                  mediaStreamActive: mediaStream.active,
                  trackEnabled: audioTrack.enabled,
                  gainNodeConnected: !!inputAudioNodeRef.current
                })
              } catch (error) {
                Logger.warn('Could not create input audio source', error)
              }
            }
          }
        } catch (micError) {
          Logger.warn('No se pudo acceder al micrófono', micError)
          // Continue without microphone for now
        }

        // Set up data channel for sending and receiving events
        const dc = pc.createDataChannel('oai-events')
        dataChannelRef.current = dc

        dc.addEventListener('open', () => {
          Logger.info('Data channel abierto')
          setIsDataChannelAvailable(true)
          setIsConnected(true)
          setConnectionState('connected')
          onStreamReady?.()
        })

        dc.addEventListener('message', (event) => {
          try {
            const data = JSON.parse(event.data)
            Logger.debug('Mensaje recibido en data channel', data)
            
            // Handle different types of messages from OpenAI Realtime
            if (data.type === 'text') {
              Logger.info('Texto recibido del agente', data.text)
              // Emitir evento para que el componente padre pueda procesar el texto
              const textEvent = new CustomEvent('agentTextResponse', { 
                detail: { text: data.text } 
              })
              window.dispatchEvent(textEvent)
            } else if (data.type === 'user_text') {
              // Texto transcrito del usuario - ya no emitir evento, se maneja por AudioRecorder
              Logger.info('Texto del usuario transcrito (manejado por AudioRecorder)', data.text)
            } else if (data.type === 'audio') {
              Logger.info('Audio recibido del agente')
            } else if (data.type === 'conversation_started') {
              Logger.info('Conversación iniciada con el agente')
            } else if (data.type === 'conversation_ended') {
              Logger.info('Conversación finalizada')
            }
          } catch (parseError) {
            Logger.warn('Error al parsear mensaje', { data: event.data, error: parseError })
          }
        })

        dc.addEventListener('error', (error) => {
          Logger.error('Error en data channel', error)
          
          // Handle specific SCTP errors
          if (error.error && error.error.sctpCauseCode === 12) {
            Logger.warn('SCTP failure detected - data channel will be disabled but connection continues')
            // Mark data channel as unavailable but don't fail the entire connection
            dataChannelRef.current = null
            setIsDataChannelAvailable(false)
            return
          }
          
          // Handle User-Initiated Abort
          if (error.error && error.error.message && error.error.message.includes('User-Initiated Abort')) {
            Logger.warn('Data channel aborted - this might be temporary')
            return
          }
          
          // Only set error if we're not already connected
          if (!isConnected) {
            setError("Error en la comunicación")
            onStreamError?.("Error en la comunicación")
          }
        })

        dc.addEventListener('close', () => {
          Logger.info('Data channel cerrado')
          setIsDataChannelAvailable(false)
          setIsConnected(false)
          setConnectionState('disconnected')
        })

        // Set a timeout for data channel connection
        setTimeout(() => {
          if (dataChannelRef.current && dataChannelRef.current.readyState !== 'open') {
            Logger.warn('Data channel connection timeout')
            // Don't fail the entire connection, just log the warning
          }
        }, 10000) // 10 second timeout

        // Create and send offer
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)

        const baseUrl = "https://api.openai.com/v1/realtime"
        const model = "gpt-4o-realtime-preview-2025-06-03"
        
        const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
          method: 'POST',
          body: offer.sdp,
          headers: {
            Authorization: `Bearer ${ephemeralKey}`,
            "Content-Type": "application/sdp"
          },
        })

        if (!sdpResponse.ok) {
          const errorText = await sdpResponse.text()
          throw new Error(`Error al conectar con OpenAI: ${sdpResponse.status} - ${errorText}`)
        }

        const answer = {
          type: "answer" as const,
          sdp: await sdpResponse.text(),
        }
        
        await pc.setRemoteDescription(answer)
        Logger.success('Conexión WebRTC establecida')

        // Mark as ready even if data channel is not open yet
        // The data channel might take a moment to establish
        setTimeout(() => {
          if (isMountedRef.current) {
            setIsConnected(true)
            setConnectionState('connected')
            onStreamReady?.()
            Logger.info('Componente marcado como listo')
          }
        }, 2000) // Give 2 seconds for data channel to establish

        setIsInitializing(false)

      } catch (err) {
        Logger.error('Error al inicializar conexión', err)
        setError(err instanceof Error ? err.message : "Error al conectar")
        setConnectionState('error')
        onStreamError?.(err instanceof Error ? err.message : "Error al conectar")
        setIsInitializing(false)
      }
    }

    // Cleanup function
    const cleanup = () => {
      Logger.info('Limpiando conexión')
      
      if (dataChannelRef.current) {
        dataChannelRef.current.close()
        dataChannelRef.current = null
      }
      
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
        peerConnectionRef.current = null
      }
      
      if (audioRef.current) {
        audioRef.current.remove()
        audioRef.current = null
      }
      
      // Clean up audio sources
      if (inputSourceRef.current) {
        inputSourceRef.current.disconnect()
        inputSourceRef.current = null
      }
      
      // Clean up output sources
      outputSourcesRef.current.forEach(source => {
        source.stop()
        source.disconnect()
      })
      outputSourcesRef.current.clear()
      
      // Clean up audio nodes
      if (inputAudioNodeRef.current) {
        inputAudioNodeRef.current.disconnect()
        inputAudioNodeRef.current = null
      }
      
      if (outputAudioNodeRef.current) {
        outputAudioNodeRef.current.disconnect()
        outputAudioNodeRef.current = null
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
      
      setIsConnected(false)
      setConnectionState('disconnected')
    }

    // Update context when contextId changes
    useEffect(() => {
      const newContext = getContextById(contextId)
      setCurrentContext(newContext)
      Logger.info('Contexto actualizado', { 
        contextId, 
        contextName: newContext.name
      })
    }, [contextId])

    // Initialize on mount
    useEffect(() => {
      Logger.info('Componente montado, iniciando conexión')
      isMountedRef.current = true
      
      if (!isInitializing && !isConnected) {
        initializeConnection()
      }
      
      return () => {
        Logger.info('Componente desmontándose')
        isMountedRef.current = false
        cleanup()
      }
    }, [])

    // Handle click to ensure audio context is running
    const handleContainerClick = async () => {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        try {
          await audioContextRef.current.resume()
          Logger.info('Audio context resumed after user interaction', {
            state: audioContextRef.current.state,
            sampleRate: audioContextRef.current.sampleRate
          })
        } catch (error) {
          Logger.warn('Could not resume audio context after click', error)
        }
      }
    }

    return (
      <div className="relative h-full w-full" onClick={handleContainerClick}>
        {/* Connection state indicator */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm z-50">
          <div className="flex items-center gap-2">
            <span>{connectionState}</span>
            {connectionState === 'connected' && (
              <div className={`w-2 h-2 rounded-full ${isMicrophoneActive ? 'bg-red-400' : 'bg-green-400'} ${isMicrophoneActive ? 'animate-pulse' : ''}`} 
                   title={isMicrophoneActive ? 'Micrófono activo' : 'Micrófono inactivo'} />
            )}
            {audioContextRef.current && (
              <span className="text-xs">🎵 {audioContextRef.current.state}</span>
            )}
          </div>
        </div>

        {/* Error display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg max-w-[80%] z-10"
          >
            <p className="text-sm">{error}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "tween", duration: 0.6, ease: "easeOut" }}
          className="relative h-[96%] flex items-center justify-center"
        >
          {/* Sphere visualization with agent info */}
          <div className="flex flex-col items-center justify-center h-full relative">
            {/* Sphere visualization container */}
            <div className="w-full max-w-lg h-72 relative flex-shrink-0">
              {/* <SphereVisualization
                inputNode={inputAudioNodeRef.current || undefined}
                outputNode={outputAudioNodeRef.current || undefined}
                isActive={connectionState === 'connected'}
                className="absolute inset-0 rounded-lg overflow-hidden"
              /> */}

              <SphereVisual
                inputNode={inputAudioNodeRef.current || undefined}
                outputNode={outputAudioNodeRef.current || undefined}
                isActive={true}
                className="w-full h-full"
              />

              {/* Fallback for when sphere is loading */}
              {/* {connectionState !== 'connected' && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg">
                  <div className="text-white text-6xl">🤖</div>
                </div>
              )} */}
            </div>
          </div>
          
          {/* Agent info overlay - positioned outside the main container to avoid blocking */}
          {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center pointer-events-none">
            <div className="bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
              <h3 className="text-lg font-semibold mb-1">
                {connectionState === 'connecting' && 'Conectando...'}
                {connectionState === 'connected' && `Sofía - ${currentContext.name}`}
                {connectionState === 'error' && 'Error de conexión'}
                {connectionState === 'disconnected' && 'Desconectado'}
              </h3>
              <p className="text-sm opacity-90">
                {connectionState === 'connecting' && 'Estableciendo conexión de voz...'}
                {connectionState === 'connected' && currentContext.welcomeMessage}
                {connectionState === 'error' && 'No se pudo conectar con el agente'}
                {connectionState === 'disconnected' && 'Conexión perdida'}
              </p>
              {connectionState === 'connected' && (
                <div className="mt-1 space-y-1">
                  <p className="text-xs text-blue-300">
                    🎤 Micrófono controlado por el usuario
                  </p>
                  <p className="text-xs opacity-75">
                    {currentContext.description}
                  </p>
                  <p className="text-xs text-green-300">
                    🌐 Visualización de audio activa
                  </p>
                </div>
              )}
            </div>
          </div> */}
        </motion.div>
      </div>
    )
  }
) 