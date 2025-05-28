"use client"

import { useState, useRef, useEffect } from "react"
import {useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { StreamingAgent } from "@/components/presentation/streaming-agent"
import { VoiceRecognition } from "@/components/presentation/voice-recognition"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

interface FormData {
  fullName: string
  email: string
  phone: string
  monthlyIncome: string
  employmentStatus: string
  timeEmployed: string
}

interface OpenAIResponse {
  monthlyIncome?: number
  employmentStatus?: "empleado" | "independiente" | "empresario"
  timeEmployed?: number
  response: string
}

export default function VirtualAgent() {
  const router = useRouter()
  const context = "credit-card-application"
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    fullName: "Carlos Torres",
    email: "carlos@sofka.com.co",
    phone: "+57 3173808475",
    monthlyIncome: "",
    employmentStatus: "",
    timeEmployed: ""
  })
  const streamingAgentRef = useRef<{ sendMessage: (text: string) => void }>(null)
  const [isStreamReady, setIsStreamReady] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  const handleStart = async () => {
    if (streamingAgentRef.current && isStreamReady) {
      try {
        const initialMessage = `¡Hola Carlos! Sofia aqui de nuevo. 
        Para poder continuar con tu solicitud, necesito que me des algunos datos de tu perfil. 
        Primero, cual es tu ingreso mensual?
        Segundo, cual es tu situacion laboral
        Por ultimo, cuantos años llevas en tu empleo actual?`
        
        await streamingAgentRef.current.sendMessage(initialMessage)
        setHasStarted(true)
      } catch (error) {
        console.error("Error al iniciar la conversación:", error)
      }
    }
  }

  const handleSpeechRecognized = async (text: string) => {
    try {
      setIsProcessing(true)

      // Enviar la transcripción a OpenAI usando la nueva ruta
      const openaiResponse = await fetch('/api/openai/virtual-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          context: context || "credit-card-application"
        })
      })

      if (!openaiResponse.ok) {
        throw new Error(`Error al procesar con OpenAI: ${openaiResponse.status}`)
      }

      const result = await openaiResponse.json()
      
      // Enviar respuesta al avatar
      if (result.response && streamingAgentRef.current) {
        const responseText = result.response.response
        
        // Enviar el texto al avatar
        streamingAgentRef.current.sendMessage(responseText)

        // Actualizar el formulario con la información recolectada
        const openAIResponse = result.response as OpenAIResponse
        
        // Actualizar solo los campos que vienen en la respuesta y son diferentes
        setFormData(prev => ({
          ...prev,
          ...(openAIResponse.monthlyIncome !== undefined && 
              openAIResponse.monthlyIncome.toString() !== prev.monthlyIncome && {
            monthlyIncome: openAIResponse.monthlyIncome.toString()
          }),
          ...(openAIResponse.employmentStatus !== undefined && 
              openAIResponse.employmentStatus !== prev.employmentStatus && {
            employmentStatus: openAIResponse.employmentStatus
          }),
          ...(openAIResponse.timeEmployed !== undefined && 
              openAIResponse.timeEmployed.toString() !== prev.timeEmployed && {
            timeEmployed: openAIResponse.timeEmployed.toString()
          })
        }))
      }
    } catch (error) {
      console.error("Error al procesar la solicitud:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleComplete = async () => {
    if (streamingAgentRef.current) {
      const completionMessage = "¡Perfecto Carlos! He recibido toda la información necesaria. Tu solicitud será procesada y te notificaremos el resultado en breve. ¡Gracias por confiar en nosotros!"
      streamingAgentRef.current.sendMessage(completionMessage)
      
      // Esperar 5 segundos antes de redirigir para que el mensaje se reproduzca
      setTimeout(() => {
        router.push('/dashboard')
      }, 5000)
    }
  }

  const isFormComplete = formData.monthlyIncome && formData.employmentStatus && formData.timeEmployed

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Asistente virtual - parte superior */}
      <div className="w-full h-1/2 min-h-[350px] border-b border-gray-200 pt-16 relative">
        <StreamingAgent
          ref={streamingAgentRef}
          apiKey={process.env.DID_API_KEY || ""}
          onStreamReady={() => {
            console.log("Stream ready")
            setIsStreamReady(true)
          }}
          onStreamError={(error) => console.error("Stream error:", error)}
        />
        
        {/* Botón de inicio a la izquierda */}
        {isStreamReady && !hasStarted && (
          <div className="absolute bottom-4 left-4">
            <Button
              onClick={handleStart}
              className="bg-[#1C3B5A] hover:bg-[#1C3B5A]/90 text-white px-6 py-2 rounded-full flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Botón de grabación posicionado en la esquina inferior derecha */}
        {hasStarted && (
          <div className="absolute bottom-4 right-4">
            <VoiceRecognition 
              onSpeechRecognized={handleSpeechRecognized}
              className="w-16 h-16"
            />
          </div>
        )}
      </div>

      {/* Formulario - parte inferior */}
      <div className="w-full h-1/2 overflow-auto p-4">
        <div className="max-w-2xl mx-auto">
          {/* Formulario */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nombre completo</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Ingrese su nombre completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="ejemplo@correo.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+56 9 XXXX XXXX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyIncome">Ingreso mensual</Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) => setFormData(prev => ({ ...prev, monthlyIncome: e.target.value }))}
                    placeholder="Ingrese su ingreso mensual"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employmentStatus">Situación laboral</Label>
                  <Select
                    value={formData.employmentStatus}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, employmentStatus: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione su situación laboral" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employed">Empleado</SelectItem>
                      <SelectItem value="self-employed">Independiente</SelectItem>
                      <SelectItem value="business-owner">Empresario</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeEmployed">Tiempo en el empleo actual</Label>
                  <Input
                    id="timeEmployed"
                    type="number"
                    value={formData.timeEmployed}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeEmployed: e.target.value }))}
                    placeholder="Ingrese los años en su empleo actual"
                  />
                </div>

                {/* Botón de completar */}
                <div className="pt-4">
                  <Button 
                    className="w-full bg-[#1C3B5A] hover:bg-[#1C3B5A]/90"
                    onClick={handleComplete}
                    disabled={!isFormComplete}
                  >
                    {isFormComplete ? "Completar Solicitud" : "Complete todos los campos"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 