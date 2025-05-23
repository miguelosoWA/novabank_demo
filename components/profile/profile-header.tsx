"use client"

import { useState } from "react"
import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProfileHeaderProps {
  name: string
  email: string
  phone: string
  avatarUrl?: string
}

export function ProfileHeader({ name, email, phone, avatarUrl }: ProfileHeaderProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-4 sm:p-6 bg-white rounded-xl shadow-sm">
      <div className="relative" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
        {avatarUrl ? (
          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden">
            <img
              src={avatarUrl || "/placeholder.svg"}
              alt={`Foto de perfil de ${name}`}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div
            className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-[#1C3B5A] flex items-center justify-center text-white text-xl sm:text-2xl font-bold"
            aria-label={`Iniciales de ${name}: ${initials}`}
          >
            {initials}
          </div>
        )}
        <div
          className={`absolute inset-0 bg-black/50 rounded-full flex items-center justify-center transition-opacity ${
            isHovering || isFocused ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button
            variant="ghost"
            size="sm"
            className="text-white p-1 h-auto"
            aria-label="Cambiar foto de perfil"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            <Camera size={20} />
          </Button>
        </div>
      </div>

      <div className="text-center md:text-left flex-1">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1C3B5A]">{name}</h2>
        <div className="mt-2 space-y-1 text-gray-500">
          <p>
            <span className="sr-only">Correo electrónico: </span>
            {email}
          </p>
          <p>
            <span className="sr-only">Teléfono: </span>
            {phone}
          </p>
        </div>
        <div className="mt-4">
          <Button size="sm" aria-label="Editar información de perfil">
            Editar perfil
          </Button>
        </div>
      </div>
    </div>
  )
}
