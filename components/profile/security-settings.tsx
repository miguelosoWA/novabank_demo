"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Lock, Smartphone, Shield, AlertTriangle, Loader2 } from "lucide-react"

interface SecuritySettingsProps {
  lastPasswordChange: string
  twoFactorEnabled: boolean
  loginNotifications: boolean
  onUpdatePassword: () => void
  onToggleTwoFactor: (enabled: boolean) => void
  onToggleLoginNotifications: (enabled: boolean) => void
  isLoading?: boolean
}

export function SecuritySettings({
  lastPasswordChange,
  twoFactorEnabled,
  loginNotifications,
  onUpdatePassword,
  onToggleTwoFactor,
  onToggleLoginNotifications,
  isLoading = false,
}: SecuritySettingsProps) {
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Evaluar la fortaleza de la contraseña si estamos cambiando la nueva contraseña
    if (name === "newPassword") {
      evaluatePasswordStrength(value)
    }
  }

  const evaluatePasswordStrength = (password: string) => {
    // Criterios básicos de fortaleza
    const hasLowerCase = /[a-z]/.test(password)
    const hasUpperCase = /[A-Z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const isLongEnough = password.length >= 8

    // Calcular puntuación (0-100)
    let score = 0
    if (hasLowerCase) score += 20
    if (hasUpperCase) score += 20
    if (hasNumbers) score += 20
    if (hasSpecialChars) score += 20
    if (isLongEnough) score += 20

    setPasswordStrength(score)
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return "bg-red-500"
    if (passwordStrength < 60) return "bg-orange-500"
    if (passwordStrength < 80) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return "Débil"
    if (passwordStrength < 60) return "Regular"
    if (passwordStrength < 80) return "Buena"
    return "Fuerte"
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Las contraseñas no coinciden")
      return
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres")
      return
    }

    onUpdatePassword()
    setIsChangingPassword(false)
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setPasswordStrength(0)
  }

  return (
    <Card>
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-lg">Seguridad</CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 space-y-6">
        {/* Cambio de contraseña */}
        <div>
          <div className="flex flex-wrap justify-between items-start mb-4 gap-2">
            <div>
              <h3 className="text-base font-medium text-[#1C3B5A] flex items-center">
                <Lock size={18} className="mr-2" aria-hidden="true" /> Contraseña
              </h3>
              <p className="text-sm text-gray-500 mt-1">Última actualización: {lastPasswordChange || "Nunca"}</p>
            </div>
            {!isChangingPassword && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsChangingPassword(true)}
                disabled={isLoading}
                aria-label="Cambiar contraseña"
              >
                Cambiar contraseña
              </Button>
            )}
          </div>

          {isChangingPassword && (
            <form
              onSubmit={handlePasswordSubmit}
              className="mt-4 space-y-4"
              aria-label="Formulario de cambio de contraseña"
            >
              <div>
                <label htmlFor="currentPassword" className="text-sm font-medium text-gray-500 mb-1 block">
                  Contraseña actual
                </label>
                <Input
                  id="currentPassword"
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Ingresa tu contraseña actual"
                  required
                  aria-required="true"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="text-sm font-medium text-gray-500 mb-1 block">
                  Nueva contraseña
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Ingresa tu nueva contraseña"
                  required
                  aria-required="true"
                  disabled={isLoading}
                  autoComplete="new-password"
                  aria-describedby="password-strength"
                />

                {passwordData.newPassword && (
                  <div className="mt-2" id="password-strength">
                    <div className="flex items-center justify-between mb-1">
                      <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getPasswordStrengthColor()}`}
                          style={{ width: `${passwordStrength}%` }}
                          aria-hidden="true"
                        />
                      </div>
                      <span className="text-xs ml-2 min-w-[60px] text-gray-500">{getPasswordStrengthText()}</span>
                    </div>
                    <p className="text-xs text-gray-500">Usa al menos 8 caracteres con letras, números y símbolos</p>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-500 mb-1 block">
                  Confirmar contraseña
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirma tu nueva contraseña"
                  required
                  aria-required="true"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
              </div>

              {passwordError && (
                <div className="text-red-500 text-sm flex items-center" role="alert">
                  <AlertTriangle size={16} className="mr-1" aria-hidden="true" /> {passwordError}
                </div>
              )}

              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsChangingPassword(false)}
                  disabled={isLoading}
                  aria-label="Cancelar cambio de contraseña"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading} aria-label="Guardar nueva contraseña">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    "Guardar contraseña"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="border-t pt-6">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="mt-0.5">
                <Smartphone size={18} className="text-[#1C3B5A]" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base font-medium text-[#1C3B5A]" id="two-factor-label">
                  Autenticación de dos factores
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Añade una capa adicional de seguridad a tu cuenta requiriendo un código de verificación además de tu
                  contraseña.
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Checkbox
                id="two-factor"
                checked={twoFactorEnabled}
                onChange={(e) => onToggleTwoFactor(e.target.checked)}
                disabled={isLoading}
                aria-labelledby="two-factor-label"
              />
              <label htmlFor="two-factor" className="ml-2 text-sm text-[#1C3B5A]">
                {twoFactorEnabled ? "Activado" : "Desactivado"}
              </label>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="mt-0.5">
                <Shield size={18} className="text-[#1C3B5A]" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base font-medium text-[#1C3B5A]" id="login-notifications-label">
                  Notificaciones de inicio de sesión
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Recibe notificaciones cuando se detecte un inicio de sesión en un nuevo dispositivo.
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Checkbox
                id="login-notifications"
                checked={loginNotifications}
                onChange={(e) => onToggleLoginNotifications(e.target.checked)}
                disabled={isLoading}
                aria-labelledby="login-notifications-label"
              />
              <label htmlFor="login-notifications" className="ml-2 text-sm text-[#1C3B5A]">
                {loginNotifications ? "Activado" : "Desactivado"}
              </label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
