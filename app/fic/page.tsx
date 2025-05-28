"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft, Banknote, Info } from "lucide-react"
import { Button } from "@/components/ui/button"


export default function WithdrawalPage() {
  const router = useRouter()
  const availableBalance = 18500.75 // Simulado, normalmente vendría de la API

  return (
    <div className="space-y-8 px-4 md:px-6 lg:px-8 pb-16 md:pb-20 max-w-screen-md mx-auto">
     
      <div className="bg-white rounded-xl p-4">
        <h3 className="text-l font-semibold text-[#1C3B5A] mb-6">Características clave del Fondo de Inversión Colectiva:</h3>
        <ul className="space-y-3 text-left">
          <li className="flex items-start">
            <span className="text-[#1C3B5A] mr-3">•</span>
            <span className="text-gray-700">Gestión profesional. Administrado por nuestros comisionistas expertos, que toman decisiones de inversión en nombre de los inversionistas.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#1C3B5A] mr-3">•</span>
            <span className="text-gray-700">Accesibilidad. Permite participar con montos relativamente bajos, haciéndolo accesible para pequeños y medianos inversionistas.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#1C3B5A] mr-3">•</span>
            <span className="text-gray-700">Liquidez. Nuestros FIC permiten el retiro del dinero en plazos cortos, aunque esto depende del tipo de fondo.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#1C3B5A] mr-3">•</span>
            <span className="text-gray-700">Transparencia: Informes periódicos sobre el comportamiento del fondo, su rentabilidad y composición del portafolio.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#1C3B5A] mr-3">•</span>
            <span className="text-gray-700">Supervisión regulada: En países como Colombia, están vigilados por entidades como la Superintendencia Financiera, lo que brinda seguridad al inversionista.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#1C3B5A] mr-3">•</span>
            <span className="text-gray-700">Rentabilidad variable: Los rendimientos no están garantizados y dependen del comportamiento del mercado y las decisiones del gestor.</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
