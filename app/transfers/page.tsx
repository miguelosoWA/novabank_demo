"use client"

import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Clock, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

// Client component that uses useSearchParams
const TransfersContent = () => {
  const router = useRouter()

  const handleContinue = () => {
    router.push('/transfers/confirmation')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-t-2xl">
          <h1 className="text-3xl font-bold text-center">Transferencias</h1>
          <p className="text-center text-blue-100 mt-2">Realiza transferencias de manera segura y rápida</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Límites de Transferencia */}
          <Card className="shadow-lg">
            <CardHeader className="bg-blue-50 rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-blue-900">Límites de Transferencia</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Límite Diario</span>
                  <span className="font-semibold text-gray-900">$10,000,000 COP</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Límite Mensual</span>
                  <span className="font-semibold text-gray-900">$50,000,000 COP</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Mínimo por Transacción</span>
                  <span className="font-semibold text-gray-900">$10,000 COP</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Máximo por Transacción</span>
                  <span className="font-semibold text-gray-900">$5,000,000 COP</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información Importante */}
          <Card className="shadow-lg">
            <CardHeader className="bg-yellow-50 rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle className="text-xl text-yellow-900">Información Importante</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">Horarios de Procesamiento</h3>
                  <p className="text-yellow-800">Las transferencias se procesan en horario bancario de lunes a viernes.</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">Tiempo de Procesamiento</h3>
                  <p className="text-yellow-800">Las transferencias pueden tomar hasta 24 horas hábiles.</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">Comisiones</h3>
                  <p className="text-yellow-800">Consulta las comisiones aplicables según el tipo de transferencia.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botón de Continuar */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleContinue}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            Continuar con la transferencia
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Mensaje de Seguridad */}
        <div className="mt-8 text-center text-gray-600 flex items-center justify-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          <p>Todas las transferencias están protegidas con los más altos estándares de seguridad</p>
        </div>
      </div>
    </div>
  )
}

// Main page component
export default function TransfersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransfersContent />
    </Suspense>
  )
}
