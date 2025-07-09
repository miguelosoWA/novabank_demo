"use client"

import { useState, useRef, useEffect } from "react"

interface AudioRecorderProps {
  onTranscription: (text: string) => void
  isActive: boolean
  onRecordingStateChange: (isRecording: boolean) => void
}

// Declarar CustomEvent para TypeScript
declare global {
  interface WindowEventMap {
    'userTextResponse': CustomEvent<{ text: string }>
  }
}

export function AudioRecorder({ onTranscription, isActive, onRecordingStateChange }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  // Logger utility
  const Logger = {
    info: (message: string, data?: any) => {
      console.log(`[AudioRecorder] ℹ️ ${message}`, data || '')
    },
    error: (message: string, error?: any) => {
      console.error(`[AudioRecorder] ❌ ${message}`, error || '')
    },
    success: (message: string, data?: any) => {
      console.log(`[AudioRecorder] ✅ ${message}`, data || '')
    },
    warn: (message: string, data?: any) => {
      console.warn(`[AudioRecorder] ⚠️ ${message}`, data || '')
    },
    debug: (message: string, data?: any) => {
      console.debug(`[AudioRecorder] 🐛 ${message}`, data || '')
    }
  }

  // Inicializar grabación cuando se activa
  useEffect(() => {
    if (isActive && !isRecording && !mediaRecorderRef.current) {
      startRecording()
    } else if (!isActive && isRecording) {
      stopRecording()
    }
  }, [isActive, isRecording])

  const startRecording = async () => {
    try {
      Logger.info('Iniciando grabación de audio')
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000
        }
      })

      streamRef.current = stream
      audioChunksRef.current = []

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })

      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        await processAudio()
      }

      mediaRecorder.start(1000) // Capturar cada segundo
      setIsRecording(true)
      onRecordingStateChange(true)
      Logger.success('Grabación iniciada')

    } catch (error) {
      Logger.error('Error al iniciar grabación', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      Logger.info('Deteniendo grabación')
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      onRecordingStateChange(false)
      
      // Limpiar stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }

  const processAudio = async () => {
    if (audioChunksRef.current.length === 0) {
      Logger.warn('No hay audio para procesar')
      return
    }

    setIsProcessing(true)
    Logger.info('Procesando audio...')

    try {
      // Crear blob de audio
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
      Logger.debug('Audio blob creado', { size: audioBlob.size })
      
      // Crear FormData para enviar
      const formData = new FormData()
      formData.append('audio', audioBlob, 'audio.webm')

      // Enviar a la API de transcripción
      Logger.info('Enviando audio para transcripción...')
      const response = await fetch('/api/openai/transcribe', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Error en transcripción: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      
      if (data.success && data.text) {
        Logger.success('Transcripción completada', { text: data.text })
        // Solo llamar a onTranscription, VirtualAgent ya está escuchando los eventos
        onTranscription(data.text)
      } else {
        Logger.error('Transcripción falló', data)
      }

    } catch (error) {
      Logger.error('Error al procesar audio', error)
    } finally {
      setIsProcessing(false)
      audioChunksRef.current = []
    }
  }

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center gap-2">
        {/* Indicador de estado */}
        <div className={`w-3 h-3 rounded-full ${
          isRecording ? 'bg-red-500 animate-pulse' : 
          isProcessing ? 'bg-yellow-500' : 
          'bg-gray-400'
        }`} />
        
        {/* Texto de estado */}
        <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">
          {isRecording ? 'Grabando...' : 
           isProcessing ? 'Procesando...' : 
           'Inactivo'}
        </span>
      </div>
    </div>
  )
} 