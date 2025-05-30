"use client"

import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Clock, ArrowRight, Info } from "lucide-react"
import { useRouter } from "next/navigation"

// Client component that uses useSearchParams
const TransfersContent = () => {
  const router = useRouter()

  const handleContinue = () => {
    router.push('/transfers/confirmation')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pb-16 md:pb-20 bg-[#DDF3E6]">
      {/* Banner superior */}
      <div className="w-full max-w-xl rounded-t-2xl bg-[#00C96B] flex justify-center items-center py-6 shadow-sm">
        <span className="text-2xl md:text-3xl text-white" style={{ fontFamily: 'var(--font-clash-display)' }}>
          Transferencias
        </span>
      </div>
      <div className="w-full max-w-xl px-4 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Límites de Transferencia */}
          <Card className="border-0 shadow-lg rounded-2xl bg-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'var(--font-clash-display)', color: '#003C1A' }}>
                <Shield className="h-5 w-5 text-[#00C96B]" />
                Límites de Transferencia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600" style={{ fontFamily: 'var(--font-roboto)' }}>Límite Diario</span>
                  <span className="font-semibold text-gray-900" style={{ fontFamily: 'var(--font-roboto)' }}>$10,000,000 COP</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600" style={{ fontFamily: 'var(--font-roboto)' }}>Límite Mensual</span>
                  <span className="font-semibold text-gray-900" style={{ fontFamily: 'var(--font-roboto)' }}>$50,000,000 COP</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600" style={{ fontFamily: 'var(--font-roboto)' }}>Mínimo por Transacción</span>
                  <span className="font-semibold text-gray-900" style={{ fontFamily: 'var(--font-roboto)' }}>$10,000 COP</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600" style={{ fontFamily: 'var(--font-roboto)' }}>Máximo por Transacción</span>
                  <span className="font-semibold text-gray-900" style={{ fontFamily: 'var(--font-roboto)' }}>$5,000,000 COP</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información Importante */}
          <Card className="border-0 shadow-lg rounded-2xl bg-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'var(--font-clash-display)', color: '#003C1A' }}>
                <Info className="h-5 w-5 text-[#00C96B]" />
                Información Importante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-[#003C1A] mb-1 text-sm" style={{ fontFamily: 'var(--font-clash-display)' }}>Horarios de Procesamiento</h3>
                  <p className="text-gray-700 text-sm" style={{ fontFamily: 'var(--font-roboto)' }}>Las transferencias se procesan en horario bancario de lunes a viernes.</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-[#003C1A] mb-1 text-sm" style={{ fontFamily: 'var(--font-clash-display)' }}>Tiempo de Procesamiento</h3>
                  <p className="text-gray-700 text-sm" style={{ fontFamily: 'var(--font-roboto)' }}>Las transferencias pueden tomar hasta 24 horas hábiles.</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-[#003C1A] mb-1 text-sm" style={{ fontFamily: 'var(--font-clash-display)' }}>Comisiones</h3>
                  <p className="text-gray-700 text-sm" style={{ fontFamily: 'var(--font-roboto)' }}>Consulta las comisiones aplicables según el tipo de transferencia.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botón de Continuar */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleContinue}
            className="bg-[#00C96B] hover:bg-[#00B05A] text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            Continuar con la transferencia
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Mensaje de Seguridad */}
        <div className="mt-8 text-center text-gray-600 flex items-center justify-center gap-2">
          <Shield className="h-5 w-5 text-[#00C96B]" />
          <p style={{ fontFamily: 'var(--font-roboto)' }}>Todas las transferencias están protegidas con los más altos estándares de seguridad</p>
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
