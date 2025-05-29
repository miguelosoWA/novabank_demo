"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCreditCardStore } from "@/lib/store/credit-card-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, DollarSign, Briefcase, Calendar } from "lucide-react"

export default function CreditCardConfirmationPage() {
  const router = useRouter()
  const { monthlyIncome, employmentStatus, timeEmployed, response, resetCreditCardData } = useCreditCardStore()

  // Redirigir si no hay datos
  useEffect(() => {
    if (!monthlyIncome && !employmentStatus && !timeEmployed) {
      router.push('/credit-card')
    }
  }, [monthlyIncome, employmentStatus, timeEmployed, router])

  const handleReturnToDashboard = () => {
    resetCreditCardData()
    router.push('/dashboard')
  }

  return (
    <div className="px-2 py-2">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-[#15d05f] text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-center gap-3">
            <CheckCircle2 className="h-8 w-8" />
            <h1 className="text-xl font-semibold">Solicitud Recibida</h1>
          </div>
        </div>

        {/* Mensaje de Confirmación */}
        <Card className="mt-6 border-0 shadow-lg bg-green-50">
          <CardHeader>
            <CardTitle className="text-lg">Detalles de tu Solicitud</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Ingreso Mensual</h3>
                  <p className="text-gray-600">${monthlyIncome.toLocaleString('es-CO')} COP</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Estado Laboral</h3>
                  <p className="text-gray-600 capitalize">{employmentStatus}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Años de Experiencia</h3>
                  <p className="text-gray-600">{timeEmployed} años</p>
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  onClick={handleReturnToDashboard}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Confirmar Solicitud
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mensaje de Seguridad */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Tu información está segura y será procesada de acuerdo con nuestras políticas de privacidad.</p>
        </div>
      </div>
    </div>
  )
} 