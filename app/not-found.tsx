"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#DDF3E6] px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-6xl font-bold text-[#00C96B]" style={{ fontFamily: 'var(--font-clash-display)' }}>
          404
        </h1>
        <h2 className="text-2xl font-semibold text-[#003C1A]" style={{ fontFamily: 'var(--font-clash-display)' }}>
          Página no encontrada
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'var(--font-roboto)' }}>
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Button
          onClick={() => router.push("/")}
          className="bg-[#00C96B] hover:bg-[#00B05C] text-white px-6 py-2 rounded-full flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Volver al inicio
        </Button>
      </div>
    </div>
  )
} 