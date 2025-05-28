"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTransferStore } from "@/lib/store/transfer-store"
import { Shield, CheckCircle2 } from "lucide-react"

export default function TransferConfirmation() {
  const router = useRouter()
  const { destinationAccount, amount, description, response, resetTransferData } = useTransferStore()

  useEffect(() => {
    // Si no hay datos de transferencia, redirigir a la página de transferencias
    if (!destinationAccount || !amount) {
      router.push('/transfers')
    }
  }, [destinationAccount, amount, router])

  const handleComplete = () => {
    resetTransferData()
    router.push('/dashboard')
  }

  return (
    <div className="px-2 py-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-center gap-3">
            <CheckCircle2 className="h-8 w-8" />
            <h1 className="text-xl font-semibold">Transferencia Confirmada</h1>
          </div>
        </div>

        {/* Detalles de la Transferencia */}
        <Card className="mt-4 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Cuenta Destino</span>
                <span className="font-semibold text-gray-900">{destinationAccount}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Monto</span>
                <span className="font-semibold text-gray-900">${amount.toLocaleString('es-CO')} COP</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Descripción</span>
                <span className="font-semibold text-gray-900">{description}</span>
              </div>
            </div>

            {/* Mensaje de Confirmación */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-green-800 text-sm">{response}</p>
            </div>

            {/* Botón de Completar */}
            <div className="mt-6">
              <Button
                onClick={handleComplete}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Volver al Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mensaje de Seguridad */}
        <div className="mt-6 text-center text-gray-600 flex items-center justify-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          <p>Tu transferencia está siendo procesada de manera segura</p>
        </div>
      </div>
    </div>
  )
}
