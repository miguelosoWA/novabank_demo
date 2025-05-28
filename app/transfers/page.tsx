"use client"

import { useState, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { StreamingAgent } from "@/components/presentation/streaming-agent"
import { VoiceRecognition } from "@/components/presentation/voice-recognition"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

interface Account {
  id: string
  name: string
  number: string
  balance: number
  currency: string
}

interface FormData {
  sourceAccount: string
  destinationAccount: string
  amount: string
  description: string
}

interface OpenAIResponse {
  destinationAccount?: string
  amount?: number
  description?: string
  response: string
}

const accounts: Account[] = [
  { 
    id: "1", 
    name: "Cuenta Corriente", 
    number: "1234 5678 9012 3456", 
    balance: 18500.75, 
    currency: "COP" 
  },
  { 
    id: "2", 
    name: "Cuenta de Ahorro", 
    number: "9876 5432 1098 7654", 
    balance: 32000.0, 
    currency: "COP" 
  },
]

export default function Transfers() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const context = searchParams.get("context")
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    sourceAccount: accounts[0].id,
    destinationAccount: "",
    amount: "",
    description: "",
  })
  const streamingAgentRef = useRef<{ sendMessage: (text: string) => void }>(null)
  const [isStreamReady, setIsStreamReady] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  const handleStart = async () => {
    if (streamingAgentRef.current && isStreamReady) {
      try {
        const initialMessage = `¡Hola! Soy Sofia, tu asistente virtual para transferencias. 
        Para ayudarte con tu transferencia, necesito algunos datos:
        Primero, ¿a qué cuenta quieres transferir?
        Segundo, ¿qué monto deseas transferir?
        Y por último, ¿deseas agregar alguna descripción a la transferencia?`
        
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

      const openaiResponse = await fetch('/api/openai/transfers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          context: "transfer"
        })
      })

      if (!openaiResponse.ok) {
        throw new Error(`Error al procesar con OpenAI: ${openaiResponse.status}`)
      }

      const result = await openaiResponse.json()
      
      if (result.response && streamingAgentRef.current) {
        const { text: responseText } = result.response
        
        streamingAgentRef.current.sendMessage(responseText)

        const openAIResponse = result as OpenAIResponse
        
        setFormData(prev => ({
          ...prev,
          ...(openAIResponse.destinationAccount !== undefined && 
              openAIResponse.destinationAccount !== prev.destinationAccount && {
            destinationAccount: openAIResponse.destinationAccount
          }),
          ...(openAIResponse.amount !== undefined && 
              openAIResponse.amount.toString() !== prev.amount && {
            amount: openAIResponse.amount.toString()
          }),
          ...(openAIResponse.description !== undefined && 
              openAIResponse.description !== prev.description && {
            description: openAIResponse.description
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
      const completionMessage = "¡Perfecto! He procesado tu solicitud de transferencia. La transferencia será procesada según el tipo seleccionado. ¡Gracias por confiar en nosotros!"
      streamingAgentRef.current.sendMessage(completionMessage)
      
      setTimeout(() => {
        router.push('/dashboard')
      }, 5000)
    }
  }

  const isFormComplete = formData.destinationAccount && formData.amount

  const selectedAccount = accounts.find(acc => acc.id === formData.sourceAccount)

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
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sourceAccount">Cuenta de origen</Label>
                  <Select
                    value={formData.sourceAccount}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, sourceAccount: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione la cuenta de origen" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map(account => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name} ({account.number.slice(-4)}) - {account.balance.toLocaleString("es-MX", { style: "currency", currency: account.currency })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destinationAccount">Cuenta de destino</Label>
                  <Input
                    id="destinationAccount"
                    value={formData.destinationAccount}
                    onChange={(e) => setFormData(prev => ({ ...prev, destinationAccount: e.target.value }))}
                    placeholder="Ingrese el número de cuenta de destino"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Monto</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="Ingrese el monto a transferir"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Ingrese una descripción (opcional)"
                  />
                </div>

                {/* Botón de completar */}
                <div className="pt-4">
                  <Button 
                    className="w-full bg-[#1C3B5A] hover:bg-[#1C3B5A]/90"
                    onClick={handleComplete}
                    disabled={!isFormComplete}
                  >
                    {isFormComplete ? "Realizar Transferencia" : "Complete todos los campos requeridos"}
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
