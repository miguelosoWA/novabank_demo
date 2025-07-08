"use client"

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react"
import { GoogleGenAI, LiveServerMessage, Modality, Session } from '@google/genai'
import { createBlob, decode, decodeAudioData } from '@/lib/utils'
import { useRouter, usePathname } from "next/navigation"
import { useTransferStore } from '@/lib/store/transfer-store'
import { useCreditCardStore } from '@/lib/store/credit-card-store'

// Logger utility
const Logger = {
  info: (message: string, data?: any) => {
    console.log(`[GeminiVirtualAgent] ℹ️ ${message}`, data || '')
  },
  error: (message: string, error?: any) => {
    console.error(`[GeminiVirtualAgent] ❌ ${message}`, error || '')
  },
  warn: (message: string, data?: any) => {
    console.warn(`[GeminiVirtualAgent] ⚠️ ${message}`, data || '')
  },
  debug: (message: string, data?: any) => {
    console.debug(`[GeminiVirtualAgent] 🔍 ${message}`, data || '')
  },
  success: (message: string, data?: any) => {
    console.log(`[GeminiVirtualAgent] ✅ ${message}`, data || '')
  }
}

interface GeminiVirtualAgentProps {
  apiKey: string
  onStreamReady?: () => void
  onStreamError?: (error: string) => void
}

export interface GeminiVirtualAgentRef {
  sendMessage: (text: string) => void
  startRecording: () => void
  stopRecording: () => void
}

export const GeminiVirtualAgent = forwardRef<GeminiVirtualAgentRef, GeminiVirtualAgentProps>(
  ({ apiKey, onStreamReady, onStreamError }, ref) => {
    const [isRecording, setIsRecording] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [status, setStatus] = useState<string>('')
    const [isStreamReady, setIsStreamReady] = useState(false)
    const [isSessionReady, setIsSessionReady] = useState(false)
    
    const router = useRouter()
    const pathname = usePathname()
    const isMountedRef = useRef(true)
    const isTransfersPage = pathname === '/transfers' || pathname === '/transfers/confirmation'
    const isCreditCardPage = pathname === '/credit-card' || pathname === '/credit-card/confirmation'
    const setTransferData = useTransferStore((state) => state.setTransferData)
    const setCreditCardData = useCreditCardStore((state) => state.setCreditCardData)

    // Audio contexts and nodes
    const inputAudioContextRef = useRef<AudioContext | null>(null)
    const outputAudioContextRef = useRef<AudioContext | null>(null)
    const inputNodeRef = useRef<GainNode | null>(null)
    const outputNodeRef = useRef<GainNode | null>(null)
    
    // Recording state
    const mediaStreamRef = useRef<MediaStream | null>(null)
    const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null)
    const audioWorkletNodeRef = useRef<AudioWorkletNode | null>(null)
    const nextStartTimeRef = useRef<number>(0)
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set())
    
    // Gemini client and session
    const clientRef = useRef<GoogleGenAI | null>(null)
    const sessionRef = useRef<Session | null>(null)

    // Initialize audio contexts
    const initAudio = async () => {
      try {
        inputAudioContextRef.current = new AudioContext({ sampleRate: 16000 })
        outputAudioContextRef.current = new AudioContext({ sampleRate: 24000 })
        
        // Load audio worklet module
        Logger.info('Loading AudioWorklet module...')
        await inputAudioContextRef.current.audioWorklet.addModule('/lib/audio-worklet-processor.js')
        Logger.success('AudioWorklet module loaded')
        
        inputNodeRef.current = inputAudioContextRef.current.createGain()
        outputNodeRef.current = outputAudioContextRef.current.createGain()
        
        nextStartTimeRef.current = outputAudioContextRef.current.currentTime
        
        if (outputNodeRef.current && outputAudioContextRef.current) {
          outputNodeRef.current.connect(outputAudioContextRef.current.destination)
        }
        
        Logger.success('Audio contexts initialized')
      } catch (err) {
        Logger.error('Error initializing audio contexts', err)
        setError('Error initializing audio')
        onStreamError?.('Error initializing audio')
      }
    }

    // Initialize Gemini client
    const initClient = async () => {
      try {
        initAudio()
        
        clientRef.current = new GoogleGenAI({
          apiKey: apiKey,
        })
        
        await initSession()
        Logger.success('Gemini client initialized')
      } catch (err) {
        Logger.error('Error initializing Gemini client', err)
        setError('Error initializing Gemini client')
        onStreamError?.('Error initializing Gemini client')
      }
    }

    // Initialize Gemini session
    const initSession = async () => {
      if (!clientRef.current) {
        throw new Error('Client not initialized')
      }

      try {
        const model = 'gemini-2.5-flash-preview-native-audio-dialog'
        
        sessionRef.current = await clientRef.current.live.connect({
          model: model,
          callbacks: {
            onopen: () => {
              Logger.info('Gemini session opened')
              setStatus('Connected')
              setIsSessionReady(true)
              setIsStreamReady(true)
              onStreamReady?.()
            },
            onmessage: async (message: LiveServerMessage) => {
              await handleGeminiMessage(message)
            },
            onerror: (e: ErrorEvent) => {
              Logger.error('Gemini session error', e)
              setError(e.message)
              onStreamError?.(e.message)
            },
            onclose: (e: CloseEvent) => {
              Logger.info('Gemini session closed', { reason: e.reason })
              setStatus(`Closed: ${e.reason}`)
              setIsSessionReady(false)
              setIsStreamReady(false)
            },
          },
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Orus' } },
            //   languageCode: 'es-US'
            },
          },
        })
        
        Logger.success('Gemini session initialized')
      } catch (err) {
        Logger.error('Error initializing Gemini session', err)
        throw err
      }
    }

    // Handle messages from Gemini
    const handleGeminiMessage = async (message: LiveServerMessage) => {
      try {
        const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData

        if (audio && audio.data && outputAudioContextRef.current) {
          nextStartTimeRef.current = Math.max(
            nextStartTimeRef.current,
            outputAudioContextRef.current.currentTime,
          )

          const audioBuffer = await decodeAudioData(
            decode(audio.data),
            outputAudioContextRef.current,
            24000,
            1,
          )
          
          const source = outputAudioContextRef.current.createBufferSource()
          source.buffer = audioBuffer
          source.connect(outputNodeRef.current!)
          source.addEventListener('ended', () => {
            sourcesRef.current.delete(source)
          })

          source.start(nextStartTimeRef.current)
          nextStartTimeRef.current = nextStartTimeRef.current + audioBuffer.duration
          sourcesRef.current.add(source)
          
          Logger.info('Audio response played')
        }

        const interrupted = message.serverContent?.interrupted
        if (interrupted) {
          for (const source of sourcesRef.current.values()) {
            source.stop()
            sourcesRef.current.delete(source)
          }
          nextStartTimeRef.current = 0
          Logger.info('Audio interrupted')
        }

        // Handle text responses for navigation
        const textContent = message.serverContent?.modelTurn?.parts?.[0]?.text
        if (textContent) {
          await handleTextResponse(textContent)
        }
      } catch (err) {
        Logger.error('Error handling Gemini message', err)
      }
    }

    // Handle text responses for navigation
    const handleTextResponse = async (text: string) => {
      try {
        Logger.info('Processing text response for navigation', { text })
        
        // Send to OpenAI for processing (same logic as before)
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
      if (isRecording || !sessionRef.current) {
        return
      }

      try {
        if (inputAudioContextRef.current) {
          await inputAudioContextRef.current.resume()
        }

        setStatus('Requesting microphone access...')

        mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 16000,
          },
          video: false,
        })

        setStatus('Microphone access granted. Starting capture...')

                if (inputAudioContextRef.current && mediaStreamRef.current) {
          sourceNodeRef.current = inputAudioContextRef.current.createMediaStreamSource(mediaStreamRef.current)
          sourceNodeRef.current.connect(inputNodeRef.current!)

          // Create AudioWorkletNode
          Logger.info('Creating AudioWorkletNode...')
          try {
            audioWorkletNodeRef.current = new AudioWorkletNode(inputAudioContextRef.current, 'audio-processor', {
              numberOfInputs: 1,
              numberOfOutputs: 1,
              channelCount: 1,
              channelCountMode: 'explicit',
              channelInterpretation: 'discrete'
            })
            Logger.success('AudioWorkletNode created successfully')

            // Handle audio data from worklet
            audioWorkletNodeRef.current.port.onmessage = (event) => {
              if (event.data.type === 'audioData' && sessionRef.current) {
                const pcmData = new Float32Array(event.data.data)
                const audioBlob = createBlob(pcmData) as any
                sessionRef.current.sendRealtimeInput({ media: audioBlob })
              }
            }

            sourceNodeRef.current.connect(audioWorkletNodeRef.current)
            audioWorkletNodeRef.current.connect(inputAudioContextRef.current.destination)
            Logger.success('AudioWorkletNode connected')
          } catch (workletError) {
            Logger.error('Error creating AudioWorkletNode, falling back to ScriptProcessorNode', workletError)
            
            // Fallback to ScriptProcessorNode (deprecated but functional)
            const bufferSize = 256
            const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(
              bufferSize,
              1,
              1,
            )

            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              if (sessionRef.current) {
                const inputBuffer = audioProcessingEvent.inputBuffer
                const pcmData = inputBuffer.getChannelData(0)
                const audioBlob = createBlob(pcmData) as any
                sessionRef.current.sendRealtimeInput({ media: audioBlob })
              }
            }

            sourceNodeRef.current.connect(scriptProcessor)
            scriptProcessor.connect(inputAudioContextRef.current.destination)
            Logger.warn('Using deprecated ScriptProcessorNode as fallback')
          }

          setIsRecording(true)
          setStatus('🔴 Recording... Capturing PCM chunks.')
          Logger.success('Recording started')
        }
      } catch (err) {
        Logger.error('Error starting recording', err)
        setStatus(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
        stopRecording()
      }
    }

    // Stop recording
    const stopRecording = () => {
      if (!isRecording && !mediaStreamRef.current) {
        return
      }

      setStatus('Stopping recording...')

      setIsRecording(false)

      if (audioWorkletNodeRef.current && sourceNodeRef.current && inputAudioContextRef.current) {
        audioWorkletNodeRef.current.disconnect()
        sourceNodeRef.current.disconnect()
      }

      audioWorkletNodeRef.current = null
      sourceNodeRef.current = null

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop())
        mediaStreamRef.current = null
      }

      setStatus('Recording stopped. Click Start to begin again.')
      Logger.info('Recording stopped')
    }

    // Reset session
    const resetSession = () => {
      if (sessionRef.current) {
        sessionRef.current.close()
        initSession()
        setStatus('Session cleared.')
        Logger.info('Session reset')
      }
    }

    // Expose methods through ref
    useImperativeHandle(ref, () => ({
      sendMessage: async (text: string) => {
        if (!sessionRef.current) {
          Logger.error('No active session')
          return
        }

        try {
          Logger.info('Sending text message to Gemini', { text })
          // Use sendRealtimeInput for text messages
          await sessionRef.current.sendRealtimeInput({ text })
          Logger.success('Text message sent')
        } catch (err) {
          Logger.error('Error sending text message', err)
        }
      },
      startRecording,
      stopRecording
    }))

    // Initialize on mount
    useEffect(() => {
      Logger.info('Component mounted, initializing Gemini client')
      isMountedRef.current = true
      
      if (apiKey) {
        initClient()
      } else {
        Logger.error('No API key provided')
        setError('No API key provided')
      }
      
      return () => {
        Logger.info('Component unmounting')
        isMountedRef.current = false
        stopRecording()
        if (sessionRef.current) {
          sessionRef.current.close()
        }
      }
    }, [apiKey])

    return (
      <div className="relative h-full w-full">
        {/* Status display */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm z-50">
          {status || 'Initializing...'}
        </div>

        {/* Error display */}
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg max-w-[80%] z-10">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-4 z-10">
          <button
            onClick={resetSession}
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
            disabled={isRecording || !isSessionReady}
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

        {/* Status text */}
        <div className="absolute bottom-24 left-0 right-0 text-center text-sm text-gray-600 z-10">
          {status}
        </div>

        {/* Placeholder for 3D visuals (can be added later) */}
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <p className="text-gray-600">Gemini Virtual Assistant</p>
          </div>
        </div>
      </div>
    )
  }
) 