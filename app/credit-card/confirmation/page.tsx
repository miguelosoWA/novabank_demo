"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCreditCardStore } from "@/lib/store/credit-card-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, DollarSign, Briefcase, Calendar } from "lucide-react"

export default function CreditCardConfirmationPage() {
  const router = useRouter()
  const { monthlyIncome, employmentStatus, yearsEmployed, response, resetCreditCardData } = useCreditCardStore()

  // Redirigir si no hay datos
  useEffect(() => {
    if (!monthlyIncome && !employmentStatus && !yearsEmployed) {
      router.push('/credit-card')
    }
  }, [monthlyIncome, employmentStatus, yearsEmployed, router])

  const handleReturnToDashboard = () => {
    resetCreditCardData()
    router.push('/dashboard')
  }

  return (
    <div className="px-2 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-center gap-3">
            <CheckCircle2 className="h-8 w-8" />
            <h1 className="text-xl font-semibold">Solicitud Recibida</h1>
          </div>
        </div>

        {/* Mensaje de Confirmación */}
        <Card className="mt-6 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Detalles de tu Solicitud</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Ingreso Mensual</h3>
                  <p className="text-gray-600">${monthlyIncome.toLocaleString('es-CO')} COP</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Estado Laboral</h3>
                  <p className="text-gray-600 capitalize">{employmentStatus}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Años de Experiencia</h3>
                  <p className="text-gray-600">{yearsEmployed} años</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800">{response}</p>
              </div>

              <div className="mt-6">
                <Button 
                  onClick={handleReturnToDashboard}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Volver al Dashboard
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