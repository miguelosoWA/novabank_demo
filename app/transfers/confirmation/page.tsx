"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTransferStore } from "@/lib/store/transfer-store"
import { Shield, CheckCircle2, Info } from "lucide-react"

export default function TransferConfirmation() {
  const router = useRouter()
  const { nombreDestinatario, amount, description, response, resetTransferData } = useTransferStore()

  useEffect(() => {
    // Si no hay datos de transferencia, redirigir a la página de transferencias
    // if (!nombreDestinatario || !amount) {
    //   router.push('/transfers')
    // }
  }, [nombreDestinatario, amount, router])

  const handleComplete = () => {
    resetTransferData()
    router.push('/dashboard')
  }

  return (
    <div className="flex flex-col items-center justify-start bg-background">
      {/* Banner superior */}
      <div className="w-full max-w-xl bi-feature-radius bg-primary flex justify-center items-center py-6 shadow-[0_4px_16px_rgba(0,56,101,0.12)]">
        <span className="text-2xl md:text-3xl text-white font-display">
          Transferencia Confirmada
        </span>
      </div>
      <div className="w-full max-w-xl px-4 -mt-6">
        <Card className="mt-6 border-0 shadow-lg rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 font-display text-primary">
              <Info className="h-5 w-5 text-accent" />
              Detalles de la Transferencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600" style={{ fontFamily: 'var(--font-roboto)' }}>Nombre Destinatario</span>
                <span className="font-semibold text-gray-900" style={{ fontFamily: 'var(--font-roboto)' }}>{nombreDestinatario}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600" style={{ fontFamily: 'var(--font-roboto)' }}>Monto</span>
                <span className="font-semibold text-gray-900" style={{ fontFamily: 'var(--font-roboto)' }}>${amount.toLocaleString('es-CO')} COP</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600" style={{ fontFamily: 'var(--font-roboto)' }}>Descripción</span>
                <span className="font-semibold text-gray-900" style={{ fontFamily: 'var(--font-roboto)' }}>{description}</span>
              </div>
            </div>


            {/* Botón de Completar */}
            <div className="mt-6">
              <Button
                onClick={handleComplete}
                className="w-full bg-secondary hover:bg-[#d88912] text-primary py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-bold"
              >
                Confirmar Transferencia
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mensaje de Seguridad */}
        <div className="mt-6 text-center text-gray-600 flex items-center justify-center gap-2 mb-10">
          <Shield className="h-5 w-5 text-accent" />
          <p style={{ fontFamily: 'var(--font-roboto)' }}>Tu transferencia está siendo procesada de manera segura</p>
        </div>
      </div>
    </div>
  )
}
