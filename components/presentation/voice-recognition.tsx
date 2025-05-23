"use client"

import { useState, useEffect, useCallback } from "react"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from "web-speech-api"

interface VoiceRecognitionProps {
  onSpeechRecognized: (text: string) => void
  className?: string
}

export function VoiceRecognition({ onSpeechRecognized, className }: VoiceRecognitionProps) {
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognition | null>(null)
  const [isSupported, setIsSupported] = useState(true)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if browser supports SpeechRecognition
      const SpeechRecognitionAPI = window.SpeechRecognition || (window as any).webkitSpeechRecognition

      if (SpeechRecognitionAPI) {
        const recognition = new SpeechRecognitionAPI()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = "es-ES" // Spanish language

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript
          onSpeechRecognized(transcript)
          setIsListening(false)
          setIsLoading(false)
        }

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error("Error de reconocimiento de voz:", event.error)
          setIsListening(false)
          setIsLoading(false)
        }

        recognition.onend = () => {
          setIsListening(false)
          setIsLoading(false)
        }

        setSpeechRecognition(recognition)
      } else {
        setIsSupported(false)
        console.warn("El reconocimiento de voz no está soportado en este navegador")
      }
    }

    return () => {
      if (speechRecognition) {
        speechRecognition.abort()
      }
    }
  }, [onSpeechRecognized])

  const toggleListening = useCallback(() => {
    if (!speechRecognition || !isSupported) return

    if (isListening) {
      speechRecognition.stop()
      setIsListening(false)
    } else {
      setIsLoading(true)
      try {
        speechRecognition.start()
        setIsListening(true)
      } catch (error) {
        console.error("Error al iniciar el reconocimiento de voz:", error)
        setIsLoading(false)
      }
    }
  }, [isListening, speechRecognition, isSupported])

  if (!isSupported) {
    return null // No mostrar nada si no es compatible
  }

  return (
    <button
      onClick={toggleListening}
      className={cn(
        "flex items-center justify-center w-12 h-12 rounded-full transition-all",
        isListening ? "bg-red-500 hover:bg-red-600" : "bg-[#1C3B5A] hover:bg-[#2a5580]",
        className,
      )}
      aria-label={isListening ? "Detener reconocimiento de voz" : "Iniciar reconocimiento de voz"}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-6 w-6 text-white animate-spin" />
      ) : isListening ? (
        <MicOff className="h-6 w-6 text-white" />
      ) : (
        <Mic className="h-6 w-6 text-white" />
      )}
    </button>
  )
}
