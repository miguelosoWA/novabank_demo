"use client"

import { useRouter } from "next/navigation"
import { Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotificationsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pb-16 md:pb-20 bg-[#DDF3E6]">
      {/* Banner superior */}
      <div className="w-full max-w-xl rounded-t-2xl bg-[#00C96B] flex justify-center items-center py-6 shadow-sm">
        <span className="text-2xl md:text-3xl text-white" style={{ fontFamily: 'var(--font-clash-display)' }}>
          Notificaciones
        </span>
      </div>
      <div className="w-full max-w-xl px-4 -mt-6">
        <Card className="mt-6 border-0 shadow-lg rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'var(--font-clash-display)', color: '#003C1A' }}>
              <Info className="h-5 w-5 text-[#00C96B]" />
              Condiciones para retiro anticipado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-left">
              <li className="flex items-start">
                <span className="text-[#1C3B5A] mr-3">•</span>
                <span className="text-gray-700" style={{ fontFamily: 'var(--font-roboto)' }}>Penalización por retiro anticipado</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1C3B5A] mr-3">•</span>
                <span className="text-gray-700" style={{ fontFamily: 'var(--font-roboto)' }}>Emergencias médicas o personales comprobadas</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1C3B5A] mr-3">•</span>
                <span className="text-gray-700" style={{ fontFamily: 'var(--font-roboto)' }}>Desempleo o pérdida de ingresos</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1C3B5A] mr-3">•</span>
                <span className="text-gray-700" style={{ fontFamily: 'var(--font-roboto)' }}>Fallecimiento del titular</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1C3B5A] mr-3">•</span>
                <span className="text-gray-700" style={{ fontFamily: 'var(--font-roboto)' }}>Compra de vivienda o educación</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1C3B5A] mr-3">•</span>
                <span className="text-gray-700" style={{ fontFamily: 'var(--font-roboto)' }}>Acuerdo previo al contratar el depósito</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1C3B5A] mr-3">•</span>
                <span className="text-gray-700" style={{ fontFamily: 'var(--font-roboto)' }}>Montos parciales según condiciones del contrato</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
