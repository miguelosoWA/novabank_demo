"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useTransferStore } from "@/lib/store/transfer-store"
import { Info } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function TransferConfirmation() {
  const router = useRouter()
  const { nombreDestinatario, amount, description, response, setTransferData, resetTransferData } = useTransferStore()

  // Función para formatear números con separadores de miles
  const formatMoney = (value: number | string): string => {
    if (!value) return ''
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[.,]/g, '')) : value
    if (isNaN(numValue)) return ''
    return numValue.toLocaleString('es-CO')
  }

  // Función para convertir texto formateado a número
  const parseMoney = (value: string): number => {
    if (!value) return 0
    const cleanValue = value.replace(/[.,]/g, '')
    return parseFloat(cleanValue) || 0
  }

  useEffect(() => {
    // Show toast when transfer data is auto-populated from voice interaction
    if (response === 'success' && (nombreDestinatario || amount > 0)) {
      toast({
        title: "Información detectada",
        description: "Los datos de transferencia han sido completados automáticamente desde la conversación",
        variant: "default"
      })
    }
  }, [response, nombreDestinatario, amount])

  const handleComplete = () => {
    // Validaciones antes de confirmar
    if (!nombreDestinatario.trim()) {
      toast({
        title: "Error",
        description: "El nombre del destinatario es requerido",
        variant: "destructive"
      })
      return
    }

    if (amount <= 0) {
      toast({
        title: "Error", 
        description: "El monto debe ser mayor a 0",
        variant: "destructive"
      })
      return
    }

    router.push('/transfers_success')
  }

  const handleInputChange = (field: string, value: string | number) => {
    // Clear the auto-completion status when user manually edits
    const newResponse = response === 'success' ? '' : response
    
    setTransferData({
      nombreDestinatario: field === 'nombreDestinatario' ? value as string : nombreDestinatario,
      amount: field === 'amount' ? value as number : amount,
      description: field === 'description' ? value as string : description,
      response: newResponse
    })
  }

  return (
    <div className="flex flex-col items-center justify-start bg-[#DDF3E6]">
      {/* Banner superior */}
      <div className="w-full max-w-xl rounded-t-2xl bg-[#00C96B] flex justify-center items-center py-6 shadow-sm">
        <span className="text-2xl md:text-3xl text-white" style={{ fontFamily: 'var(--font-clash-display)' }}>
          Transferencia
        </span>
      </div>
      <div className="w-full max-w-xl px-4 -mt-6">
        <Card className="mt-6 border-0 shadow-lg rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'var(--font-clash-display)', color: '#003C1A' }}>
              <Info className="h-5 w-5 text-[#00C96B]" />
              Detalles de la Transferencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Campo Nombre Destinatario */}
              <div className="space-y-2">
                <Label htmlFor="nombreDestinatario" className="text-gray-600 flex items-center gap-2" style={{ fontFamily: 'var(--font-roboto)' }}>
                  Nombre Destinatario
                  {response === 'success' && nombreDestinatario && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Auto-completado
                    </span>
                  )}
                </Label>
                <Input
                  id="nombreDestinatario"
                  value={nombreDestinatario}
                  onChange={(e) => handleInputChange('nombreDestinatario', e.target.value)}
                  placeholder="Ingrese el nombre del destinatario"
                  className={`border-gray-300 focus:border-[#00C96B] focus:ring-[#00C96B] h-14 text-base ${
                    response === 'success' && nombreDestinatario 
                      ? 'border-green-300 bg-green-50' 
                      : ''
                  }`}
                />
              </div>

              {/* Campo Monto */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-gray-600 flex items-center gap-2" style={{ fontFamily: 'var(--font-roboto)' }}>
                  Monto
                  {response === 'success' && amount > 0 && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Auto-completado
                    </span>
                  )}
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-base">$</span>
                  <Input
                    id="amount"
                    type="text"
                    value={amount === 0 ? '' : formatMoney(amount)}
                    onChange={(e) => handleInputChange('amount', parseMoney(e.target.value))}
                    placeholder="0"
                    className={`pl-8 pr-16 border-gray-300 focus:border-[#00C96B] focus:ring-[#00C96B] h-14 text-base ${
                      response === 'success' && amount > 0 
                        ? 'border-green-300 bg-green-50' 
                        : ''
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-base">COP</span>
                </div>
              </div>

            </div>

            {/* Botón de Completar */}
            <div className="mt-6">
              <Button
                onClick={handleComplete}
                className="w-full bg-[#00C96B] hover:bg-[#00B05A] text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Confirmar Transferencia
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
