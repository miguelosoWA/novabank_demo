"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState("carlos@sofka.com.co")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulación de inicio de sesión
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#004029] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\'data:image/svg+xml;charset=UTF-8,%3Csvg width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22 fill=%22none%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M10 0L10 20M0 10L20 10%22 stroke=%22white%22 stroke-width=%220.5%22/%3E%3C/svg%3E\')" }}></div>

      <div className="relative z-10 w-full max-w-sm mx-auto">
        <div className="text-center mb-10 px-4">
          <div className="inline-block">
            <div className="flex items-center justify-center">
              <div className="mr-3">
                <Image
                  src="/icon-512x512.png"
                  alt="Insight Banking Logo"
                  width={80}
                  height={80}
                />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">INSIGHT</h1>
                <h2 className="text-4xl font-light text-white tracking-tight -mt-2">BANKING</h2>
              </div>
            </div>
            <p className="text-right text-sm text-white mt-1">
              By <span className="font-semibold text-[#FF7A2E]">sofka_</span>
            </p>
          </div>

          <h2 className="text-3xl font-semibold text-white mt-8">
            ¡Bienvenido de nuevo!
          </h2>
        </div>

        <div className="bg-[#12B47A] rounded-[40px] shadow-2xl p-8 pt-10 w-full">
          <form onSubmit={handleLogin} className="space-y-6">
              <Input
                type="email"
                placeholder="Ingresa tu correo"
                icon={<Mail size={35} className="text-[#12B47A] pr-3" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white placeholder-gray-500 text-gray-800 flex-grow"
              />

            <Input
              type="password"
              placeholder="Ingresa contraseña"
              icon={<Lock size={35} className="text-[#12B47A] pr-3" />}
              required
              className="bg-white placeholder-gray-500 text-gray-800 flex-grow"
            />

            <div className="flex items-center justify-between text-sm">
              <Checkbox
                label="Recordarme"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="text-white"
                id="remember-me"
              />
              <Link href="/forgot-password" className="font-medium text-white hover:text-gray-200">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="bg-[#FF7A2E] hover:bg-[#E66A20] text-white font-bold py-3 rounded-full text-lg"
            >
              Iniciar sesión
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-white">
              ¿Nuevo aquí?{" "}
              <Link href="/register" className="font-semibold text-[#6ECE3C] hover:text-[#8CF05D]">
                Crea tu cuenta
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 text-center w-full z-0">
        <p className="text-xs text-gray-300 opacity-75">
          2025© Sofka Technologies / All Rigths Reserved
        </p>
      </div>
    </div>
  )
}
