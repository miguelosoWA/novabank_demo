"use client"
import { Bell } from "lucide-react"
import Image from "next/image"
import { useMediaQuery } from "@/hooks/use-media-query"
import { UserMenu } from "@/components/dashboard/user-menu"

export function Navbar() {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <header className="bg-[#0B3C23] w-full px-4 py-2 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
      {/* Logo y texto */}
      <div className="flex items-center space-x-3">
        <Image src="/novabank_logo.svg" alt="Logo" width={40} height={40} />
        <div className="flex flex-col justify-center">
          <span className="flex items-center space-x-1">
            <span className="text-white font-bold text-lg tracking-wide" style={{ fontFamily: 'var(--font-clash-display)' }}>INSIGHT</span>
            <span className="text-[#00C96B] font-normal text-lg tracking-wide" style={{ fontFamily: 'var(--font-clash-display)' }}>BANKING</span>
            <span className="text-white text-sm ml-2" style={{ fontFamily: 'var(--font-roboto)' }}>By</span>
            <span className="text-white font-bold text-sm ml-1" style={{ fontFamily: 'var(--font-roboto)' }}>sofka</span>
            <span className="text-orange-400 font-bold text-lg ml-0.5" style={{ fontFamily: 'var(--font-roboto)' }}>_</span>
          </span>
        </div>
      </div>
      {/* Notificación campana */}
      <div className="relative">
        <Bell size={28} className="text-[#00C96B]" />
        <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-orange-500 border-2 border-[#0B3C23]" />
      </div>

      {isDesktop && <UserMenu />}
    </header>
  )
}
