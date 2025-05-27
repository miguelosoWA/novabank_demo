"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft, Banknote, Info } from "lucide-react"
import { Button } from "@/components/ui/button"


export default function WithdrawalPage() {
  const router = useRouter()
  const availableBalance = 18500.75 // Simulado, normalmente vendría de la API

  return (
    <div className="space-y-8 px-4 md:px-6 lg:px-8 pb-16 md:pb-20 max-w-screen-md mx-auto">
      {/* Botón regresar */}
      <div className="pt-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-2 text-[#1C3B5A]">
          <ChevronLeft className="w-5 h-5" /> Regresar
        </Button>
      </div>

      {/* Header visual */}
      <div className="flex flex-col items-center text-center gap-2">
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full p-4 mb-2 shadow-lg">
          <Banknote className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1C3B5A]">Retiro anticipado</h1>
        <p className="text-gray-600 max-w-md">Solicita un retiro anticipado de tu depósito a plazo. Recuerda revisar las condiciones y posibles penalizaciones.</p>
      </div>

      {/* Saldo disponible y acción */}
      <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center gap-4">
        <span className="text-gray-500 text-sm">Saldo disponible para retiro</span>
        <span className="text-3xl md:text-4xl font-extrabold text-[#1C3B5A]">{availableBalance.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}</span>
        <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-all mt-2">
          Solicitar retiro
        </Button>
      </div>

      {/* Condiciones */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-[#DEA742]" />
          <h2 className="text-lg font-semibold text-[#1C3B5A]">Condiciones para retiro anticipado</h2>
        </div>
        <ul className="space-y-3 text-left text-gray-700">
          <li className="flex items-start gap-2"><span className="text-[#DEA742] mt-1">•</span> Penalización por retiro anticipado</li>
          <li className="flex items-start gap-2"><span className="text-[#DEA742] mt-1">•</span> Emergencias médicas o personales comprobadas</li>
          <li className="flex items-start gap-2"><span className="text-[#DEA742] mt-1">•</span> Desempleo o pérdida de ingresos</li>
          <li className="flex items-start gap-2"><span className="text-[#DEA742] mt-1">•</span> Fallecimiento del titular</li>
          <li className="flex items-start gap-2"><span className="text-[#DEA742] mt-1">•</span> Compra de vivienda o educación</li>
          <li className="flex items-start gap-2"><span className="text-[#DEA742] mt-1">•</span> Acuerdo previo al contratar el depósito</li>
          <li className="flex items-start gap-2"><span className="text-[#DEA742] mt-1">•</span> Montos parciales según condiciones del contrato</li>
        </ul>
      </div>
    </div>
  )
}
