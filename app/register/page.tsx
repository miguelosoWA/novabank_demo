"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, User, Phone, Shield } from "lucide-react"
import { Logo } from "@/components/logo"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "" }

    const hasLower = /[a-z]/.test(password)
    const hasUpper = /[A-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[^A-Za-z0-9]/.test(password)
    const isLongEnough = password.length >= 8

    const checks = [hasLower, hasUpper, hasNumber, hasSpecial, isLongEnough]
    const passedChecks = checks.filter(Boolean).length

    const strength = Math.min(100, (passedChecks / checks.length) * 100)

    let label = ""
    if (strength < 30) label = "Débil"
    else if (strength < 60) label = "Regular"
    else if (strength < 80) label = "Buena"
    else label = "Fuerte"

    return { strength, label }
  }

  const passwordStrength = getPasswordStrength(password)

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulación de registro
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f5fa] to-white flex flex-col justify-center p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#1C3B5A]">Crear una cuenta</h1>
            <p className="text-gray-500 mt-1">Completa tus datos para comenzar</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <Input
              label="Nombre completo"
              type="text"
              placeholder="Carlos Rodríguez"
              icon={<User size={18} />}
              required
            />

            <Input
              label="Correo electrónico"
              type="email"
              placeholder="ejemplo@correo.com"
              icon={<Mail size={18} />}
              required
            />

            <Input
              label="Número de celular"
              type="tel"
              placeholder="+52 55 1234 5678"
              icon={<Phone size={18} />}
              required
            />

            <div className="space-y-2">
              <Input
                label="Crear contraseña"
                type="password"
                placeholder="••••••••"
                icon={<Lock size={18} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {password && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          passwordStrength.strength < 30
                            ? "bg-red-500"
                            : passwordStrength.strength < 60
                              ? "bg-orange-500"
                              : passwordStrength.strength < 80
                                ? "bg-yellow-500"
                                : "bg-green-500"
                        }`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      />
                    </div>
                    <span className="text-xs ml-2 min-w-[60px] text-gray-500">{passwordStrength.label}</span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Shield size={12} className="mr-1" />
                    Usa 8+ caracteres con letras, números y símbolos
                  </p>
                </div>
              )}
            </div>

            <div>
              <Checkbox
                label={
                  <span className="text-sm text-gray-600">
                    Acepto los{" "}
                    <Link href="#" className="text-[#1C3B5A] hover:text-[#DEA742] font-medium">
                      términos y condiciones
                    </Link>{" "}
                    y la{" "}
                    <Link href="#" className="text-[#1C3B5A] hover:text-[#DEA742] font-medium">
                      política de privacidad
                    </Link>
                  </span>
                }
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                required
              />
            </div>

            <Button type="submit" fullWidth isLoading={isLoading} disabled={!acceptTerms}>
              Registrarme ahora
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-[#1C3B5A] font-medium hover:text-[#DEA742]">
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
