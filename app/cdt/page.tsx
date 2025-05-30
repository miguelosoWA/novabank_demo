"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft, Banknote, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WithdrawalPage() {
  const router = useRouter()
  const availableBalance = 18500.75 // Simulado, normalmente vendría de la API

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pb-16 md:pb-20 bg-[#DDF3E6]">
      {/* Banner superior CDT */}
      <div className="w-full max-w-md rounded-t-2xl bg-[#00C96B] flex justify-center items-center py-6 shadow-sm">
        <span className="text-2xl md:text-3xl  text-white" style={{ fontFamily: 'var(--font-clash-display)' }}>
          CDT
        </span>
      </div>
      {/* Tarjeta de contenido */}
      <div className="w-full max-w-md px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl md:text-2xl font-bold mb-6 text-[#003C1A]" style={{ fontFamily: 'var(--font-clash-display)' }}>
            Características clave de un Certificado de Depósito a Término:
          </h3>
          <ul className="space-y-4 text-left">
            <li className="flex items-start">
              <span className="text-[#00C96B] mr-3 text-lg font-bold">•</span>
              <span className="text-gray-700" style={{ fontFamily: 'var(--font-roboto)' }}>
                Plazo fijo. El dinero se deposita por un período específico (desde 30 días hasta varios años). No puede retirarse antes sin penalización.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#00C96B] mr-3 text-lg font-bold">•</span>
              <span className="text-gray-700" style={{ fontFamily: 'var(--font-roboto)' }}>
                Tasa de interés conocida. Desde el inicio te decimos cuánto ganarás al final del plazo (interés fijo o variable según el producto).
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#00C96B] mr-3 text-lg font-bold">•</span>
              <span className="text-gray-700" style={{ fontFamily: 'var(--font-roboto)' }}>
                Bajo riesgo. Es una inversión segura, respaldada por nosotros.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#00C96B] mr-3 text-lg font-bold">•</span>
              <span className="text-gray-700" style={{ fontFamily: 'var(--font-roboto)' }}>
                Rendimiento garantizado. El rendimiento está asegurado siempre que se cumpla el plazo pactado.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#00C96B] mr-3 text-lg font-bold">•</span>
              <span className="text-gray-700" style={{ fontFamily: 'var(--font-roboto)' }}>
                Cobertura del Fogafín. En Colombia, los CDT emitidos por entidades financieras vigiladas están cubiertos por el Fondo de Garantías de Instituciones Financieras.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#00C96B] mr-3 text-lg font-bold">•</span>
              <span className="text-gray-700" style={{ fontFamily: 'var(--font-roboto)' }}>
                No es líquido. No se puede disponer del dinero antes del vencimiento sin incurrir en penalidades o perder rendimientos.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
