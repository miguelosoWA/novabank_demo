"use client"

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useTransferStore } from '@/lib/store/transfer-store'
import { useCreditCardStore } from '@/lib/store/credit-card-store'

// Logger utility
const Logger = {
  info: (message: string, data?: any) => {
    console.log(`[OpenAIVirtualAgent] ℹ️ ${message}`, data || '')
  },
  error: (message: string, error?: any) => {
    console.error(`[OpenAIVirtualAgent] ❌ ${message}`, error || '')
  },
  warn: (message: string, data?: any) => {
    console.warn(`[OpenAIVirtualAgent] ⚠️ ${message}`, data || '')
  },
  debug: (message: string, data?: any) => {
    console.debug(`[OpenAIVirtualAgent] 🔍 ${message}`, data || '')
  },
  success: (message: string, data?: any) => {
    console.log(`[OpenAIVirtualAgent] ✅ ${message}`, data || '')
  }
}

interface OpenAIVirtualAgentProps {
  onStreamReady?: () => void
  onStreamError?: (error: string) => void
}

export interface OpenAIVirtualAgentRef {
  sendMessage: (text: string) => void
  startRecording: () => void
  stopRecording: () => void
}

interface RealtimeEvent {
  type: string
  data?: any
  text?: string
  audio?: ArrayBuffer
}

export const OpenAIVirtualAgent = forwardRef<OpenAIVirtualAgentRef, OpenAIVirtualAgentProps>(
  ({ onStreamReady, onStreamError }, ref) => {
    const [isRecording, setIsRecording] = useState(false)
    const [isConnected, setIsConnected] = useState(false)
    const [status, setStatus] = useState('Initializing...')
    const [error, setError] = useState<string | null>(null)
    
    const router = useRouter()
    const pathname = usePathname()
    const isMountedRef = useRef(true)
    const isTransfersPage = pathname === '/transfers' || pathname === '/transfers/confirmation'
    const isCreditCardPage = pathname === '/credit-card' || pathname === '/credit-card/confirmation'
    const setTransferData = useTransferStore((state) => state.setTransferData)
    const setCreditCardData = useCreditCardStore((state) => state.setCreditCardData)

    // WebRTC refs
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
    const dataChannelRef = useRef<RTCDataChannel | null>(null)
    const mediaStreamRef = useRef<MediaStream | null>(null)
    const audioElementRef = useRef<HTMLAudioElement | null>(null)
    const ephemeralKeyRef = useRef<string | null>(null)

    // Initialize WebRTC connection
    const initializeWebRTC = async () => {
      try {
        setStatus('Getting ephemeral token...')
        
        // Get ephemeral token from server
        const tokenResponse = await fetch('/api/openai/realtime-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "gpt-4o-realtime-preview-2025-06-03",
            voice: "alloy"
          })
        })

        if (!tokenResponse.ok) {
          throw new Error(`Failed to get ephemeral token: ${tokenResponse.status}`)
        }

        const tokenData = await tokenResponse.json()
        ephemeralKeyRef.current = tokenData.client_secret.value

        setStatus('Creating WebRTC connection...')

        // Create peer connection
        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' }
          ]
        })
        peerConnectionRef.current = pc

        // Set up audio element for remote audio
        const audioEl = document.createElement('audio')
        audioEl.autoplay = true
        audioEl.style.display = 'none'
        document.body.appendChild(audioEl)
        audioElementRef.current = audioEl

        // Handle remote audio tracks
        pc.ontrack = (event) => {
          Logger.info('Remote audio track received')
          if (audioElementRef.current) {
            audioElementRef.current.srcObject = event.streams[0]
          }
        }

        // Handle connection state changes
        pc.onconnectionstatechange = () => {
          Logger.info('Connection state changed', { state: pc.connectionState })
          if (pc.connectionState === 'connected') {
            setStatus('Connected to OpenAI Realtime')
          } else if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
            setError('WebRTC connection failed')
            onStreamError?.('WebRTC connection failed')
          }
        }

        // Handle ICE connection state changes
        pc.oniceconnectionstatechange = () => {
          Logger.info('ICE connection state changed', { state: pc.iceConnectionState })
        }

        // Set up data channel for events
        const dc = pc.createDataChannel('oai-events')
        dataChannelRef.current = dc

        dc.addEventListener('open', () => {
          Logger.info('Data channel opened')
          setIsConnected(true)
          setStatus('Connected to OpenAI Realtime')
          onStreamReady?.()
        })

        dc.addEventListener('message', (event) => {
          handleRealtimeEvent(event.data)
        })

        dc.addEventListener('close', () => {
          Logger.info('Data channel closed')
          setIsConnected(false)
          setStatus('Disconnected')
        })

        dc.addEventListener('error', (error) => {
          Logger.error('Data channel error', error)
          setError('Data channel error')
          onStreamError?.('Data channel error')
        })

        // Get microphone access first
        setStatus('Requesting microphone access...')
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 16000,
          },
          video: false,
        })

        // Add audio track to peer connection
        stream.getTracks().forEach(track => {
          pc.addTrack(track, stream)
        })

        // Store stream for later use
        mediaStreamRef.current = stream

        // Create offer after adding audio track
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)

        setStatus('Connecting to OpenAI...')

        // Send offer to OpenAI
        const baseUrl = "https://api.openai.com/v1/realtime"
        const model = "gpt-4o-realtime-preview-2025-06-03"
        const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
          method: "POST",
          body: offer.sdp,
          headers: {
            Authorization: `Bearer ${ephemeralKeyRef.current}`,
            "Content-Type": "application/sdp"
          },
        })

        if (!sdpResponse.ok) {
          const errorText = await sdpResponse.text()
          throw new Error(`OpenAI connection failed: ${sdpResponse.status} - ${errorText}`)
        }

        // Set remote description
        const answer: RTCSessionDescriptionInit = {
          type: "answer" as RTCSdpType,
          sdp: await sdpResponse.text(),
        }
        await pc.setRemoteDescription(answer)

        Logger.success('WebRTC connection established')

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        Logger.error('Error initializing WebRTC', err)
        setError(`Connection error: ${errorMessage}`)
        onStreamError?.(`Connection error: ${errorMessage}`)
        setStatus('Connection failed')
      }
    }

    // Handle realtime events from OpenAI
    const handleRealtimeEvent = async (eventData: any) => {
      try {
        Logger.debug('Received realtime event', eventData)

        // Handle text responses
        if (eventData.type === 'text' && eventData.text) {
          Logger.info('Received text response', { text: eventData.text })
          await handleTextResponse(eventData.text)
        }

        // Handle audio responses
        if (eventData.type === 'audio' && eventData.audio) {
          Logger.info('Received audio response')
          // Audio is automatically played through the audio element
        }

        // Handle session events
        if (eventData.type === 'session') {
          Logger.info('Session event', eventData)
        }

      } catch (err) {
        Logger.error('Error handling realtime event', err)
      }
    }

    // Handle text responses for navigation
    const handleTextResponse = async (text: string) => {
      try {
        Logger.info('Processing text response for navigation', { text })
        
        // Send to OpenAI for processing (same logic as Gemini)
        const {nombreDestinatario, amount, description} = useTransferStore.getState()
        const {monthlyIncome, employmentStatus, timeEmployed} = useCreditCardStore.getState()

        let body: any = { text }

        if (isTransfersPage) {
          body = {
            text,
            nombreDestinatario,
            amount,
            description
          }
        }

        if (isCreditCardPage) {
          body = {
            text,
            monthlyIncome,
            employmentStatus,
            timeEmployed
          }
        }

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

        if (openaiResponse.ok) {
          const result = await openaiResponse.json()
          
          if (result.response && isMountedRef.current) {
            if (isTransfersPage) {
              setTransferData(result.response)
              if (result.response.page) {
                router.push(`/${result.response.page}`)
              } else {
                router.push('/transfers/confirmation')
              }
            } else if (isCreditCardPage) {
              setCreditCardData(result.response)
              if (result.response.page) {
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
            Logger.success('Navigation completed')
          }
        }
      } catch (err) {
        Logger.error('Error processing text response', err)
      }
    }

    // Start recording
    const startRecording = async () => {
      if (isRecording || !isConnected) {
        return
      }

      try {
        // Microphone is already accessed during initialization
        // Just enable the tracks if they were disabled
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => {
            track.enabled = true
          })
        }

        setIsRecording(true)
        setStatus('🔴 Recording...')
        Logger.success('Recording started')

      } catch (err) {
        Logger.error('Error starting recording', err)
        setError(`Recording error: ${err instanceof Error ? err.message : 'Unknown error'}`)
        setStatus('Recording failed')
      }
    }

    // Stop recording
    const stopRecording = () => {
      if (!isRecording) {
        return
      }

      setStatus('Stopping recording...')

      // Disable tracks instead of stopping them to maintain connection
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => {
          track.enabled = false
        })
      }

      setIsRecording(false)
      setStatus('Recording stopped. Click Start to begin again.')
      Logger.info('Recording stopped')
    }

    // Send text message
    const sendTextMessage = async (text: string) => {
      if (!dataChannelRef.current || dataChannelRef.current.readyState !== 'open') {
        Logger.error('Data channel not ready')
        return
      }

      try {
        const message: RealtimeEvent = {
          type: 'text',
          text
        }
        
        dataChannelRef.current.send(JSON.stringify(message))
        Logger.success('Text message sent')
      } catch (err) {
        Logger.error('Error sending text message', err)
      }
    }

    // Cleanup
    const cleanup = () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop())
        mediaStreamRef.current = null
      }

      if (audioElementRef.current && document.body.contains(audioElementRef.current)) {
        document.body.removeChild(audioElementRef.current)
        audioElementRef.current = null
      }

      if (dataChannelRef.current) {
        dataChannelRef.current.close()
        dataChannelRef.current = null
      }

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
        peerConnectionRef.current = null
      }

      setIsRecording(false)
      setIsConnected(false)
    }

    // Expose methods through ref
    useImperativeHandle(ref, () => ({
      sendMessage: sendTextMessage,
      startRecording,
      stopRecording
    }))

    // Initialize on mount
    useEffect(() => {
      Logger.info('Component mounted, initializing OpenAI Realtime')
      isMountedRef.current = true
      
      initializeWebRTC()
      
      return () => {
        Logger.info('Component unmounting')
        isMountedRef.current = false
        cleanup()
      }
    }, [])

    return (
      <div className="relative h-full w-full">
        {/* Status display */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm z-50">
          {status}
        </div>

        {/* Connection status */}
        <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm z-50">
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>

        {/* Error display */}
        {error && (
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg max-w-[80%] z-10">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-4 z-10">
          <button
            onClick={() => {
              cleanup()
              initializeWebRTC()
            }}
            disabled={isRecording}
            className="w-16 h-16 rounded-xl border border-white/20 text-white bg-white/10 hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="40px"
              viewBox="0 -960 960 960"
              width="40px"
              fill="#ffffff"
            >
              <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
            </svg>
          </button>
          
          <button
            onClick={startRecording}
            disabled={isRecording || !isConnected}
            className="w-16 h-16 rounded-xl border border-white/20 text-white bg-white/10 hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              viewBox="0 0 100 100"
              width="32px"
              height="32px"
              fill="#c80000"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="50" />
            </svg>
          </button>
          
          <button
            onClick={stopRecording}
            disabled={!isRecording}
            className="w-16 h-16 rounded-xl border border-white/20 text-white bg-white/10 hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              viewBox="0 0 100 100"
              width="32px"
              height="32px"
              fill="#000000"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="0" y="0" width="100" height="100" rx="15" />
            </svg>
          </button>
        </div>

        {/* OpenAI Logo */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-4xl font-bold text-gray-300 mb-4">OpenAI</div>
          <div className="text-lg text-gray-400">Realtime Assistant</div>
        </div>
      </div>
    )
  }
) 