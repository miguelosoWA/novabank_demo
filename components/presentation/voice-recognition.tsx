"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

// Declaraciones de tipos para la Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
  }
}

interface VoiceRecognitionProps {
  onSpeechRecognized: (text: string) => void
  isListening?: boolean
  onListeningChange?: (isListening: boolean) => void
  className?: string
}

export function VoiceRecognition({
  onSpeechRecognized,
  isListening: controlledIsListening,
  onListeningChange,
  className
}: VoiceRecognitionProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Verificar si el navegador soporta la API de reconocimiento de voz
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognitionAPI) {
      console.warn("El reconocimiento de voz no está soportado en este navegador")
      setIsSupported(false)
      return
    }

    // Crear una instancia de SpeechRecognition
    recognitionRef.current = new SpeechRecognitionAPI()
    const recognition = recognitionRef.current

    // Configurar el reconocimiento de voz
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'es-ES'

    // Manejar resultados
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('')

      if (event.results[0].isFinal) {
        onSpeechRecognized(transcript)
      }
    }

    // Manejar errores
    recognition.onerror = (event: any) => {
      console.error('Error en reconocimiento de voz:', event.error)
      
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setPermissionDenied(true)
      }
      
      setIsListening(false)
      onListeningChange?.(false)
    }

    // Manejar el final del reconocimiento
    recognition.onend = () => {
      setIsListening(false)
      onListeningChange?.(false)
    }

    return () => {
      if (recognition) {
        recognition.stop()
      }
    }
  }, [onSpeechRecognized, onListeningChange])

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop()) // Detener el stream después de obtener el permiso
      setPermissionDenied(false)
      return true
    } catch (error) {
      console.error('Error al solicitar permiso del micrófono:', error)
      setPermissionDenied(true)
      return false
    }
  }

  const toggleListening = async () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      const newIsListening = false
      setIsListening(newIsListening)
      onListeningChange?.(newIsListening)
    } else {
      // Solicitar permiso del micrófono antes de iniciar
      const hasPermission = await requestMicrophonePermission()
      if (!hasPermission) {
        return
      }

      try {
        recognitionRef.current.start()
        const newIsListening = true
        setIsListening(newIsListening)
        onListeningChange?.(newIsListening)
      } catch (error) {
        console.error('Error al iniciar el reconocimiento de voz:', error)
        setPermissionDenied(true)
      }
    }
  }

  if (!isSupported) {
    return (
      <button
        disabled
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-400",
          className
        )}
      >
        <MicOff size={20} />
      </button>
    )
  }

  if (permissionDenied) {
    return (
      <button
        onClick={() => setPermissionDenied(false)}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-500",
          className
        )}
        title="Permiso de micrófono denegado. Toca para intentar de nuevo."
      >
        <MicOff size={20} />
      </button>
    )
  }

  return (
    <button
      onClick={toggleListening}
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full transition-colors",
        isListening
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-[#1C3B5A] text-white hover:bg-[#2C4B6A]",
        className
      )}
      title={isListening ? "Detener grabación" : "Iniciar grabación"}
    >
      {isListening ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        <Mic size={20} />
      )}
    </button>
  )
}
