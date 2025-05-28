"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Info, ArrowRight, Shield, Clock, Globe } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const TRANSACTION_LIMITS = {
  daily: 10000000, // 10 millones COP
  monthly: 50000000, // 50 millones COP
  minimum: 10000, // 10 mil COP
  maximum: 5000000, // 5 millones COP por transacción
}

export default function Transfers() {
  const router = useRouter()

  const handleContinue = () => {
    router.push('/transfers/confirmation')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-[#1C3B5A] to-[#2A4D6E] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Transferencias</h1>
          <p className="text-xl text-gray-200">Realiza tus transferencias de manera segura y rápida</p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Límites de transferencia */}
          <Card className="border-none shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">Límites de transferencia</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Mínimo por transacción</span>
                  <span className="font-semibold text-gray-800">
                    {TRANSACTION_LIMITS.minimum.toLocaleString("es-CO", { style: "currency", currency: "COP" })}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Máximo por transacción</span>
                  <span className="font-semibold text-gray-800">
                    {TRANSACTION_LIMITS.maximum.toLocaleString("es-CO", { style: "currency", currency: "COP" })}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Límite diario</span>
                  <span className="font-semibold text-gray-800">
                    {TRANSACTION_LIMITS.daily.toLocaleString("es-CO", { style: "currency", currency: "COP" })}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Límite mensual</span>
                  <span className="font-semibold text-gray-800">
                    {TRANSACTION_LIMITS.monthly.toLocaleString("es-CO", { style: "currency", currency: "COP" })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Restricciones y tiempos */}
          <Card className="border-none shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">Información importante</h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Horario de procesamiento</h3>
                  <p className="text-gray-600">8:00 AM - 5:00 PM, días hábiles</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Tiempo de procesamiento</h3>
                  <p className="text-gray-600">Hasta 24 horas hábiles para transferencias a otros bancos</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Verificación adicional</h3>
                  <p className="text-gray-600">Requerida para transferencias superiores a 2 millones de pesos</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Transferencias internacionales</h3>
                  <p className="text-gray-600">Límites y requisitos adicionales aplican</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botón de continuar */}
        <div className="mt-12 text-center">
          <Button 
            className="bg-[#1C3B5A] hover:bg-[#1C3B5A]/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={handleContinue}
          >
            Continuar con la transferencia
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Información de seguridad */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-gray-600">
            <Shield className="w-5 h-5 text-green-600" />
            <span>Todas las transferencias están protegidas con encriptación de última generación</span>
          </div>
        </div>
      </div>
    </div>
  )
}
