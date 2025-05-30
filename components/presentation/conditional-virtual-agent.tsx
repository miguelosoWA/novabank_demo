"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { VirtualAgent } from "./virtual-agent"
import { Navbar } from "@/components/dashboard/navbar"

// Lista de rutas donde NO queremos mostrar el agente virtual
const EXCLUDED_ROUTES = [
  "/login",
  "/register",
  "/about",
  "/not-found",
]

export function ConditionalVirtualAgent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Verificar si la ruta actual está en la lista de exclusiones
  const shouldShowVirtualAgent = !EXCLUDED_ROUTES.some(route => pathname.startsWith(route))

  // Si la ruta es /about, renderiza solo el children sin Navbar ni wrappers
  if (pathname.startsWith("/about")) {
    return <>{children}</>
  }

  if (!shouldShowVirtualAgent) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-b from-[#003C1A] to-[#00C96B]">
        <Navbar />
        <div className="w-full h-full overflow-auto">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#E6F7ED] font-roboto" style={{ fontFamily: 'var(--font-roboto)' }}>
      <Navbar />
      {/* Asistente virtual - parte superior */}
      <div className="w-full h-1/2 min-h-[350px] pt-16 flex items-center justify-center" style={{ background: '#F4F8F6' }}>
        <VirtualAgent />
      </div>

      {/* Aplicación SofkaBank - parte inferior */}
      <div className="w-full h-1/2 overflow-auto">
        {children}
      </div>
    </div>
  )
}
