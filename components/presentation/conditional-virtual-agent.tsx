"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { VirtualAgent } from "./virtual-agent"

// Lista de rutas donde NO queremos mostrar el agente virtual
const EXCLUDED_ROUTES = [
  "/login",
  "/register",
  "/about",
]

export function ConditionalVirtualAgent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Verificar si la ruta actual está en la lista de exclusiones
  const shouldShowVirtualAgent = !EXCLUDED_ROUTES.some(route => pathname.startsWith(route))

  if (!shouldShowVirtualAgent) {
    return (
      <div className="w-full h-full overflow-auto">
        {children}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Asistente virtual - parte superior */}
      <div className="w-full h-1/2 min-h-[350px] border-b border-gray-200 pt-16">
        <VirtualAgent />
      </div>

      {/* Aplicación Insight Banking by Sofka - parte inferior */}
      <div className="w-full flex-1 overflow-auto">{children}</div>
    </div>
  )
}
