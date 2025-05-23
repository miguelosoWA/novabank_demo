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
        <div className="h-8 w-8 rounded-full bg-[#1C3B5A] flex items-center justify-center text-white mr-2">
          <User size={16} />
        </div>
        <span className="hidden md:block text-sm font-medium">Carlos</span>
      </Button>

      {isProfileOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
          <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
            <User size={16} className="mr-2" />
            Mi perfil
          </Link>
          <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
            <Settings size={16} className="mr-2" />
            Configuración
          </Link>
          <Link href="/help" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
            <HelpCircle size={16} className="mr-2" />
            Ayuda
          </Link>
          <div className="border-t border-gray-200 my-1"></div>
          <button
            onClick={handleLogout}
            className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
          >
            <LogOut size={16} className="mr-2" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}
