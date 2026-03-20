"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState("carlos@sofka.com.co")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="relative min-h-screen overflow-y-auto bg-primary px-4 py-6 sm:px-6 lg:flex lg:items-center lg:justify-center lg:overflow-hidden lg:p-4">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;charset=UTF-8,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 fill=%22none%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M20 0L20 40M0 20L40 20%22 stroke=%22white%22 stroke-width=%220.5%22/%3E%3C/svg%3E')",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
        <div className="px-1 pt-2 text-white sm:px-2 lg:pt-0">
          <div className="mb-5 lg:mb-8">
            <Image
              src="/logo-bi-white.png"
              alt="Banco Industrial"
              width={220}
              height={96}
              priority
              className="h-auto w-[124px] sm:w-[156px] lg:w-[220px]"
            />
          </div>

          <div className="max-w-xl space-y-4 lg:space-y-5">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur sm:px-4 sm:text-sm">
              Bi Banking
            </span>
            <h1 className="font-display text-[2.15rem] font-semibold leading-[1.05] sm:text-[2.75rem] lg:text-5xl">
              Tu banca digital,&emsp; una experiencia clara y confiable.
            </h1>
          </div>
        </div>

        <div className="bi-panel-radius w-full bg-white/98 p-5 shadow-[0_8px_30px_rgba(0,56,101,0.24)] backdrop-blur sm:p-8 lg:p-10">

          <form onSubmit={handleLogin} className="space-y-5 sm:space-y-5">
            <div>
              <Input
                label="Correo electrónico"
                type="email"
                placeholder="Ingresa tu correo"
                icon={<Mail size={20} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Contraseña"
                type="password"
                placeholder="Ingresa contraseña"
                icon={<Lock size={20} />}
                required
              />
            </div>

            <div className="flex flex-row items-center gap-1 text-sm">
              <Link href="/forgot-password" className="mr-auto font-semibold text-accent-dark hover:text-accent">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button type="submit" fullWidth isLoading={isLoading} className="py-3 text-base font-bold sm:text-lg">
              Iniciar sesión
            </Button>
          </form>

          <div className="mt-6 text-center sm:mt-8">
            <p className="text-sm text-white">
              ¿Nuevo aquí?{" "}
              <Link href="/login" className="font-semibold text-accent-dark hover:text-accent">
                Crea tu cuenta
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-6 w-full text-center lg:absolute lg:bottom-4 lg:left-0 lg:mt-0">
        <p className="text-xs text-white/65">2026© Banco Industrial / Todos los derechos reservados</p>
      </div>
    </div>
  )
}
