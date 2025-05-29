"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft, Banknote, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function WithdrawalPage() {
  const router = useRouter()
  const availableBalance = 18500.75 // Simulado, normalmente vendría de la API

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pb-16 md:pb-20 bg-[#DDF3E6]">
      {/* Banner superior */}
      <div className="w-full max-w-xl rounded-t-2xl bg-[#00C96B] flex justify-center items-center py-6 shadow-sm">
        <span className="text-2xl md:text-3xl text-white" style={{ fontFamily: 'var(--font-clash-display)' }}>
          Fondo de Inversión Colectiva
        </span>
      </div>
      <div className="w-full max-w-xl px-4 -mt-6">
        {/* Características clave */}
        <Card className="mt-6 border-0 shadow-lg rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'var(--font-clash-display)', color: '#003C1A' }}>
              <Info className="h-5 w-5 text-[#00C96B]" />
              Características clave del Fondo de Inversión Colectiva
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-left">
              <li className="flex items-start">
                <span className="text-[#1C3B5A] mr-3">•</span>
                <span className="text-gray-700" style={{ fontFamily: 'var(--font-roboto)' }}>Gestión profesional. Administrado por nuestros comisionistas expertos, que toman decisiones de inversión en nombre de los inversionistas.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1C3B5A] mr-3">•</span>
                <span className="text-gray-700" style={{ fontFamily: 'var(--font-roboto)' }}>Accesibilidad. Permite participar con montos relativamente bajos, haciéndolo accesible para pequeños y medianos inversionistas.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1C3B5A] mr-3">•</span>
                <span className="text-gray-700" style={{ fontFamily: 'var(--font-roboto)' }}>Liquidez. Nuestros FIC permiten el retiro del dinero en plazos cortos, aunque esto depende del tipo de fondo.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1C3B5A] mr-3">•</span>
                <span className="text-gray-700" style={{ fontFamily: 'var(--font-roboto)' }}>Transparencia: Informes periódicos sobre el comportamiento del fondo, su rentabilidad y composición del portafolio.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1C3B5A] mr-3">•</span>
                <span className="text-gray-700" style={{ fontFamily: 'var(--font-roboto)' }}>Supervisión regulada: En países como Colombia, están vigilados por entidades como la Superintendencia Financiera, lo que brinda seguridad al inversionista.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1C3B5A] mr-3">•</span>
                <span className="text-gray-700" style={{ fontFamily: 'var(--font-roboto)' }}>Rentabilidad variable: Los rendimientos no están garantizados y dependen del comportamiento del mercado y las decisiones del gestor.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
