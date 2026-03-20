"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-6xl font-bold text-accent font-display">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-primary font-display">
          Página no encontrada
        </h2>
        <p className="text-[#4F5151]">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Button
          onClick={() => router.push("/dashboard")}
          variant="primary"
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Volver al inicio
        </Button>
      </div>
    </div>
  )
} 