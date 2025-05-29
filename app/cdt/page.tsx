"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft, Banknote, Info } from "lucide-react"
import { Button } from "@/components/ui/button"


export default function WithdrawalPage() {
  const router = useRouter()
  const availableBalance = 18500.75 // Simulado, normalmente vendría de la API

  return (
    <div className="space-y-8 px-0 md:px-6 lg:px-8 pb-16 md:pb-20 max-w-screen-md mx-auto bg-[#E3FAEC]">

      <div className="bg-[#15d05f] text-white py-6 px-6 shadow-m">
        <h3 className="text-xl font-bold text-left">Características clave de un Certificado de Depósito a Término:</h3>
      </div>

      <div className="bg-transparent px-9" style={{ marginTop: "20px" }}>
        <ul className="space-y-3 text-left">
          <li className="flex items-start">
            <span className="text-[#1C3B5A] mr-3">•</span>
            <span className="text-[#1a3e24]">Plazo fijo. El dinero se deposita por un período específico (desde 30 días hasta varios años). No puede retirarse antes sin penalización.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#1C3B5A] mr-3">•</span>
            <span className="text-[#1a3e24]">Tasa de interés conocida. Desde el inicio te decimos cuánto ganarás al final del plazo (interés fijo o variable según el producto).</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#1C3B5A] mr-3">•</span>
            <span className="text-[#1a3e24]">Bajo riesgo. Es una inversión segura, respaldada por nosotros.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#1C3B5A] mr-3">•</span>
            <span className="text-[#1a3e24]">Rendimiento garantizado. El rendimiento está asegurado siempre que se cumpla el plazo pactado.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#1C3B5A] mr-3">•</span>
            <span className="text-[#1a3e24]">Cobertura del Fogafín. En Colombia, los CDT emitidos por entidades financieras vigiladas están cubiertos por el Fondo de Garantías de Instituciones Financieras.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#1C3B5A] mr-3">•</span>
            <span className="text-[#1a3e24]">No es líquido. No se puede disponer del dinero antes del vencimiento sin incurrir en penalidades o perder rendimientos.</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
