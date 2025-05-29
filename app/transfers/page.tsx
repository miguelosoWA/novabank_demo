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
    <div className="px-4 py-6">
      <div className="bg-[#15d05f] text-white p-4 rounded-t-2xl">
        <h1 className="text-xl font-semibold text-center">Transferencias</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {/* Límites de Transferencia */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 rounded-full">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-base text-blue-900 font-medium">Límites de Transferencia</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-white rounded-lg">
              <span className="text-gray-600">Límite Diario</span>
              <span className="font-semibold text-gray-900">$10,000,000 COP</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded-lg">
              <span className="text-gray-600">Límite Mensual</span>
              <span className="font-semibold text-gray-900">$50,000,000 COP</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded-lg">
              <span className="text-gray-600">Mínimo por Transacción</span>
              <span className="font-semibold text-gray-900">$10,000 COP</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded-lg">
              <span className="text-gray-600">Máximo por Transacción</span>
              <span className="font-semibold text-gray-900">$5,000,000 COP</span>
            </div>
          </div>
        </div>

        {/* Información Importante */}
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-yellow-100 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-base text-yellow-900 font-medium">Información Importante</span>
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-white rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-1 text-sm">Horarios de Procesamiento</h3>
              <p className="text-yellow-800 text-sm">Las transferencias se procesan en horario bancario de lunes a viernes.</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-1 text-sm">Tiempo de Procesamiento</h3>
              <p className="text-yellow-800 text-sm">Las transferencias pueden tomar hasta 24 horas hábiles.</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-1 text-sm">Comisiones</h3>
              <p className="text-yellow-800 text-sm">Consulta las comisiones aplicables según el tipo de transferencia.</p>
            </div>
          </div>
        </div>
      </div>


      {/* Mensaje de Seguridad */}
      <div className="mt-8 text-center text-gray-600 flex items-center justify-center gap-2">
        <Shield className="h-5 w-5 text-green-600" />
        <p>Todas las transferencias están protegidas con los más altos estándares de seguridad</p>
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
