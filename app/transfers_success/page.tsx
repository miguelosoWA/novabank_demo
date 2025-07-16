"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, DollarSign, User, FileText, Clock, Send } from "lucide-react"
import { useTransferStore } from "@/lib/store/transfer-store"

export default function TransferSuccessPage() {
  const router = useRouter()
  const { 
    nombreDestinatario, amount, description, response, resetTransferData 
  } = useTransferStore()

  // Generar datos de la transferencia
  const transferData = {
    transferNumber: `TRF-${Math.random().toString().substring(2,8)}`,
    creationDate: new Date().toLocaleDateString('es-CO'),
    creationTime: new Date().toLocaleTimeString('es-CO'),
    amount: amount || 0,
    destinatario: nombreDestinatario || 'Destinatario',
    description: description || 'Transferencia',
    status: 'Completada'
  }

  const handleReturnToDashboard = () => {
    router.push('/dashboard')
    resetTransferData()
  }

  return (
    <div className="px-2 py-2">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-[#15d05f] text-white p-6 rounded-t-2xl shadow-lg mt-5">
          <div className="flex items-center justify-center gap-3">
            <CheckCircle2 className="h-6 w-8" />
            <h1 className="text-xl font-semibold">Transferencia Exitosa</h1>
          </div>
        </div>

        {/* Mensaje de Confirmación */}
        <Card className="mt-3 border-0 shadow-lg rounded-2xl bg-white">
          <CardContent>
            <div className="space-y-6">

              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-[#00C96B] mt-1" />
                <div>
                  <h3 className="font-semibold" style={{ fontFamily: 'var(--font-roboto)' }}>Monto Transferido</h3>
                  <p className="text-gray-600" style={{ fontFamily: 'var(--font-roboto)' }}>${transferData.amount.toLocaleString('es-CO')} COP</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-[#00C96B] mt-1" />
                <div>
                  <h3 className="font-semibold" style={{ fontFamily: 'var(--font-roboto)' }}>Destinatario</h3>
                  <p className="text-gray-600" style={{ fontFamily: 'var(--font-roboto)' }}>{transferData.destinatario}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-[#00C96B] mt-1" />
                <div>
                  <h3 className="font-semibold" style={{ fontFamily: 'var(--font-roboto)' }}>Fecha y Hora</h3>
                  <p className="text-gray-600" style={{ fontFamily: 'var(--font-roboto)' }}>{transferData.creationDate} - {transferData.creationTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Send className="h-5 w-5 text-[#00C96B] mt-1" />
                <div>
                  <h3 className="font-semibold" style={{ fontFamily: 'var(--font-roboto)' }}>Estado</h3>
                  <p className="text-[#00C96B] font-medium" style={{ fontFamily: 'var(--font-roboto)' }}>{transferData.status}</p>
                </div>
              </div>

              {description && (
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-[#00C96B] mt-1" />
                  <div>
                    <h3 className="font-semibold" style={{ fontFamily: 'var(--font-roboto)' }}>Descripción</h3>
                    <p className="text-gray-600" style={{ fontFamily: 'var(--font-roboto)' }}>{description}</p>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <Button 
                  onClick={handleReturnToDashboard}
                  className="w-full bg-[#00C96B] hover:bg-[#00A55A] text-white"
                >
                  Regresar al inicio
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mensaje de Información */}
        <div className="mt-6 text-center text-sm text-gray-500" style={{ fontFamily: 'var(--font-roboto)' }}>
          <p>Tu transferencia ha sido procesada exitosamente. El dinero llegará al destinatario en unos minutos.</p>
          <p className="mt-1">Recibirás una confirmación por correo electrónico y SMS.</p>
        </div>
      </div>
    </div>
  )
} 