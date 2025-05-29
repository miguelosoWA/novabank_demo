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
        <h3 className="text-xl font-bold text-left">Características clave del Fondo de Inversión Colectiva:</h3>
      </div>

      <div className="bg-transparent px-8" style={{ marginTop: "20px" }}>
        <ul className="space-y-3 text-left">
        <li className="flex items-start">
            <span className="text-[#1C3B5A] mr-3">•</span>
            <span className="text-[#1a3e24]">Gestión profesional. Administrado por nuestros comisionistas expertos, que toman decisiones de inversión en nombre de los inversionistas.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#1C3B5A] mr-3">•</span>
            <span className="text-[#1a3e24]">Accesibilidad. Permite participar con montos relativamente bajos, haciéndolo accesible para pequeños y medianos inversionistas.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#1C3B5A] mr-3">•</span>
            <span className="text-[#1a3e24]">Liquidez. Nuestros FIC permiten el retiro del dinero en plazos cortos, aunque esto depende del tipo de fondo.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#1C3B5A] mr-3">•</span>
            <span className="text-[#1a3e24]">Transparencia: Informes periódicos sobre el comportamiento del fondo, su rentabilidad y composición del portafolio.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#1C3B5A] mr-3">•</span>
            <span className="text-[#1a3e24]">Supervisión regulada: En países como Colombia, están vigilados por entidades como la Superintendencia Financiera, lo que brinda seguridad al inversionista.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#1C3B5A] mr-3">•</span>
            <span className="text-[#1a3e24]">Rentabilidad variable: Los rendimientos no están garantizados y dependen del comportamiento del mercado y las decisiones del gestor.</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
