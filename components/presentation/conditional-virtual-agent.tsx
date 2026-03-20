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

  // Si la ruta es /about o /login, renderiza solo el children sin Navbar ni wrappers
  if (pathname.startsWith("/about") || pathname.startsWith("/login")) {
    return <>{children}</>
  }

  if (!shouldShowVirtualAgent) {
    return (
      <div className="bi-shell flex h-screen flex-col overflow-hidden">
        <Navbar />
        <div className="w-full h-full overflow-auto">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className="bi-shell flex h-screen flex-col overflow-hidden font-roboto" style={{ fontFamily: 'var(--font-roboto)' }}>
      <Navbar />
      {/* Asistente virtual - parte superior */}
      <div className="flex h-1/2 min-h-[350px] w-full items-center justify-center border-b border-[#d7e4e8] pt-16" style={{ background: 'linear-gradient(180deg, #f8fefe 0%, #eaf3f5 100%)' }}>
        <VirtualAgent />
      </div>

      {/* Aplicación Bi Banking - parte inferior */}
      <div className="w-full flex-1 h-1/2 overflow-auto">
        {children}
      </div>
    </div>
  )
}
