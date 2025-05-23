"use client"

import { BackButton } from "@/components/navigation/back-button"

export default function TransfersPage() {
  return (
    <div className="space-y-6 px-4 md:px-6 lg:px-8 pb-16 md:pb-20 max-w-screen-xl mx-auto">
      <div>
        {/* Usar el componente BackButton */}
        <BackButton />
        <h1 className="text-2xl font-bold text-[#1C3B5A]">Transferencias</h1>
        <p className="text-gray-500">Envía y recibe dinero de forma segura</p>
      </div>

      <div className="bg-white rounded-xl p-8 text-center">
        <h2 className="text-xl font-semibold text-[#1C3B5A] mb-2">Sección en desarrollo</h2>
        <p className="text-gray-500">Esta sección estará disponible próximamente.</p>
      </div>
    </div>
  )
}
