"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { VirtualAgent } from "./virtual-agent"

export function ConditionalVirtualAgent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Rutas donde NO queremos mostrar el agente virtual
  const excludedRoutes = [
    "/login",
    "/register",
    "/home",
    "/profile"
  ]

  // Si la ruta actual está en la lista de excluidas, solo mostrar el contenido
  if (excludedRoutes.some(route => pathname.startsWith(route))) {
    return <>{children}</>
  }

  // Para otras rutas, mostrar el agente virtual
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Asistente virtual - parte superior */}
      <div className="w-full h-1/2 min-h-[350px] border-b border-gray-200 pt-16">
        <VirtualAgent />
      </div>

      {/* Aplicación NovaBank - parte inferior */}
      <div className="w-full h-1/2 overflow-auto">{children}</div>
    </div>
  )
}
