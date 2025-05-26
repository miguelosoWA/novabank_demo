"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { VoiceRecognition } from "./voice-recognition"

interface DIDVirtualAgentProps {
  apiKey: string
  sessionId?: string
  onSessionStart?: (sessionId: string) => void
  onSessionEnd?: () => void
}

export function DIDVirtualAgent({ apiKey, sessionId, onSessionStart, onSessionEnd }: DIDVirtualAgentProps) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const wsRef = useRef<WebSocket | null>(null)

  // Inicializar la sesión de D-ID
  const initializeSession = async () => {
    try {
      const response = await fetch("https://api.d-id.com/talks/streams", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_url: "",
          config: {
            stitch: true,
            result_format: "mp4",
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Error al inicializar la sesión de D-ID")
      }

      const data = await response.json()
      const newSessionId = data.id
      onSessionStart?.(newSessionId)

      // Iniciar WebSocket
      const ws = new WebSocket(data.websocket_url)
      wsRef.current = ws

      ws.onopen = () => {
        console.log("WebSocket conectado")
        setIsStreaming(true)
      }

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data)
        if (message.type === "video") {
          // Procesar el stream de video
          if (videoRef.current) {
            const blob = new Blob([message.data], { type: "video/mp4" })
            const url = URL.createObjectURL(blob)
            videoRef.current.src = url
          }
        }
      }

      ws.onerror = (error) => {
        console.error("Error en WebSocket:", error)
        setError("Error en la conexión del agente virtual")
      }

      ws.onclose = () => {
        console.log("WebSocket cerrado")
        setIsStreaming(false)
        onSessionEnd?.()
      }

    } catch (err) {
      console.error("Error al inicializar D-ID:", err)
      setError("Error al inicializar el agente virtual")
    }
  }

  // Enviar mensaje al agente
  const sendMessage = async (text: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setError("No hay conexión con el agente virtual")
      return
    }

    try {
      const response = await fetch("https://api.d-id.com/talks/streams", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          session_id: sessionId,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al enviar mensaje")
      }

      const data = await response.json()
      wsRef.current.send(JSON.stringify({
        type: "text",
        text: data.text,
      }))

    } catch (err) {
      console.error("Error al enviar mensaje:", err)
      setError("Error al comunicarse con el agente virtual")
    }
  }

  // Manejar el reconocimiento de voz
  const handleSpeechRecognized = (text: string) => {
    sendMessage(text)
  }

  // Limpiar recursos al desmontar
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  return (
    <div className="h-full w-full flex items-end justify-center bg-white relative">
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
        transition={{ type: "spring", bounce: 0.4, duration: 0.7 }}
        className="relative h-[95%] flex items-center justify-center"
      >
        <video
          ref={videoRef}
          className="h-[95%] w-auto object-contain object-bottom mt-auto"
          autoPlay
          playsInline
          muted
        />
      </motion.div>

      {/* Botón de micrófono */}
      <div className="absolute bottom-6 right-6">
        <VoiceRecognition onSpeechRecognized={handleSpeechRecognized} />
      </div>
    </div>
  )
} 