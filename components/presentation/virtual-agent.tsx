"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { VoiceRecognition } from "./voice-recognition"

export function VirtualAgent() {
  const [imageError, setImageError] = useState(false)
  const [userMessage, setUserMessage] = useState("")

  const handleSpeechRecognized = (text: string) => {
    setUserMessage(text)
    // Aquí se podría implementar la lógica para procesar el mensaje
    // y generar una respuesta del asistente virtual
    console.log("Mensaje reconocido:", text)

    // Después de un tiempo, limpiar el mensaje (simulando respuesta)
    setTimeout(() => {
      setUserMessage("")
    }, 5000)
  }

  return (
    <div className="h-full w-full flex items-end justify-center bg-white relative">
      {userMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-[#1C3B5A] text-white px-4 py-2 rounded-lg max-w-[80%] z-10"
        >
          <p className="text-sm">{userMessage}</p>
        </motion.div>
      )}

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.7 }}
        className="relative h-[95%] flex items-center justify-center"
      >
        {!imageError ? (
          <div className="relative h-full flex items-center justify-center overflow-hidden">
            <Image
              src="/nova-assistant-full.png"
              alt="Nova - Asistente virtual de NovaBank"
              width={500}
              height={600}
              className="h-[95%] w-auto object-contain object-bottom mt-auto"
              priority
              onError={() => {
                console.log("Error cargando imagen del asistente")
                setImageError(true)
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <div className="text-6xl mb-2">👩‍💼</div>
            <div className="text-sm font-medium text-[#1C3B5A]">Nova</div>
          </div>
        )}
      </motion.div>

      {/* Botón de micrófono */}
      <div className="absolute bottom-6 right-6">
        <VoiceRecognition onSpeechRecognized={handleSpeechRecognized} />
      </div>
    </div>
  )
}
