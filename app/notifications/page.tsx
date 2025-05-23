"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotificationsPage() {
  const router = useRouter()

  return (
    <div className="space-y-6 px-4 md:px-6 lg:px-8 pb-16 md:pb-20 max-w-screen-xl mx-auto">
      <div>
        {/* Botón de regreso al inicio */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          leftIcon={<ChevronLeft size={16} />}
          onClick={() => router.push("/dashboard")}
        >
          Regresar al inicio
        </Button>
        <h1 className="text-2xl font-bold text-[#1C3B5A]">Notificaciones</h1>
        <p className="text-gray-500">Mantente al día con tus alertas y avisos</p>
      </div>

      <div className="bg-white rounded-xl p-8 text-center">
        <h2 className="text-xl font-semibold text-[#1C3B5A] mb-2">Sección en desarrollo</h2>
        <p className="text-gray-500">Esta sección estará disponible próximamente.</p>
      </div>
    </div>
  )
}
