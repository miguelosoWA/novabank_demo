"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft, Banknote, Info } from "lucide-react"
import { Button } from "@/components/ui/button"


export default function WithdrawalPage() {
  const router = useRouter()
  const availableBalance = 18500.75 // Simulado, normalmente vendría de la API

  return (
    <div className="pb-12 bg-[#cae6d5]">
      {/* Header */}
      <div className="bg-[#2D7A4A] text-white py-4 px-6">
        <div className="max-w-4xl mx-auto">
            <div className="text-xl font-medium">Fondo de Inversión Colectiva (FIC)</div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-0">
        {/* Características clave section */}
        <div className="bg-white shadow-sm overflow-hidden">
          
          <div className="p-4">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-[#fd7524]">Características clave</h3>
              {/* Plazo fijo */}
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-[#FF6B35] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Gestión profesional</h3>
                  <p className="text-gray-600 leading-relaxed">
                  Administrado por nuestros comisionistas expertos, que toman decisiones de inversión en nombre de los inversionistas.
                  </p>
                </div>
              </div>

              {/* Tasa de interés conocida */}
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-[#FF6B35] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Accesibilidad</h3>
                  <p className="text-gray-600 leading-relaxed">
                  Permite participar con montos relativamente bajos, haciéndolo accesible para pequeños y medianos inversionistas.
                  </p>
                </div>
              </div>

              {/* Bajo riesgo */}
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-[#FF6B35] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Liquidez</h3>
                  <p className="text-gray-600 leading-relaxed">
                  Nuestros FIC permiten el retiro del dinero en plazos cortos, aunque esto depende del tipo de fondo.
                  </p>
                </div>
              </div>

              {/* Rendimiento garantizado */}
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-[#FF6B35] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Transparencia</h3>
                  <p className="text-gray-600 leading-relaxed">
                  Informes periódicos sobre el comportamiento del fondo, su rentabilidad y composición del portafolio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
