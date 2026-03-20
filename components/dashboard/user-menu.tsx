"use client"

import { useState } from "react"
import { User, LogOut, Settings, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function UserMenu() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    // En una aplicación real, aquí se manejaría el cierre de sesión
    router.push("/login")
  }

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" className="flex items-center" onClick={() => setIsProfileOpen(!isProfileOpen)}>
        <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white">
          <User size={16} />
        </div>
        <span className="hidden text-sm font-medium text-white md:block">Carlos</span>
      </Button>

      {isProfileOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-[#d7e4e8] bg-white py-1 shadow-[0_4px_16px_rgba(0,56,101,0.12)]">
          <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-[#eaf3f5]">
            <User size={16} className="mr-2" />
            Mi perfil
          </Link>
          <Link href="/settings" className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-[#eaf3f5]">
            <Settings size={16} className="mr-2" />
            Configuración
          </Link>
          <Link href="/help" className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-[#eaf3f5]">
            <HelpCircle size={16} className="mr-2" />
            Ayuda
          </Link>
          <div className="my-1 border-t border-[#d7e4e8]"></div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-2 text-left text-sm text-[#F13852] hover:bg-[#fff4f6]"
          >
            <LogOut size={16} className="mr-2" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}
