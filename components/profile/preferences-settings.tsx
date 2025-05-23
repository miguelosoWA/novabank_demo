"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Bell,
  Mail,
  Smartphone,
  DollarSign,
  CreditCard,
  PiggyBank,
  Moon,
  Languages,
  ChevronDown,
  Shield,
  Loader2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface NotificationPreferences {
  email: boolean
  push: boolean
  sms: boolean
}

interface NotificationTypes {
  transactions: boolean
  security: boolean
  promotions: boolean
  accountUpdates: boolean
}

interface PreferencesSettingsProps {
  notificationPreferences: NotificationPreferences
  notificationTypes: NotificationTypes
  language: string
  darkMode: boolean
  onUpdateNotificationPreferences: (key: keyof NotificationPreferences, value: boolean) => void
  onUpdateNotificationTypes: (key: keyof NotificationTypes, value: boolean) => void
  onChangeLanguage: (language: string) => void
  onToggleDarkMode: (enabled: boolean) => void
  isLoading?: boolean
}

export function PreferencesSettings({
  notificationPreferences,
  notificationTypes,
  language,
  darkMode,
  onUpdateNotificationPreferences,
  onUpdateNotificationTypes,
  onChangeLanguage,
  onToggleDarkMode,
  isLoading = false,
}: PreferencesSettingsProps) {
  const languages = [
    { code: "es", name: "Español" },
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
    { code: "pt", name: "Português" },
  ]

  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0]

  return (
    <Card>
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-lg">Preferencias</CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 space-y-6">
        {/* Notificaciones */}
        <div>
          <h3 className="text-base font-medium text-[#1C3B5A] mb-4 flex items-center" id="notifications-heading">
            <Bell size={18} className="mr-2" aria-hidden="true" /> Notificaciones
          </h3>

          <div className="space-y-4" role="group" aria-labelledby="notifications-heading">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gray-500" aria-hidden="true" />
                <label htmlFor="email-notifications" className="text-sm text-[#1C3B5A]">
                  Correo electrónico
                </label>
              </div>
              <Checkbox
                id="email-notifications"
                checked={notificationPreferences.email}
                onChange={(e) => onUpdateNotificationPreferences("email", e.target.checked)}
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-gray-500" aria-hidden="true" />
                <label htmlFor="push-notifications" className="text-sm text-[#1C3B5A]">
                  Notificaciones push
                </label>
              </div>
              <Checkbox
                id="push-notifications"
                checked={notificationPreferences.push}
                onChange={(e) => onUpdateNotificationPreferences("push", e.target.checked)}
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Smartphone size={18} className="text-gray-500" aria-hidden="true" />
                <label htmlFor="sms-notifications" className="text-sm text-[#1C3B5A]">
                  SMS
                </label>
              </div>
              <Checkbox
                id="sms-notifications"
                checked={notificationPreferences.sms}
                onChange={(e) => onUpdateNotificationPreferences("sms", e.target.checked)}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Tipos de notificaciones */}
        <div className="border-t pt-6">
          <h3 className="text-base font-medium text-[#1C3B5A] mb-4" id="notification-types-heading">
            Tipos de notificaciones
          </h3>

          <div className="space-y-4" role="group" aria-labelledby="notification-types-heading">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <DollarSign size={18} className="text-gray-500" aria-hidden="true" />
                <label htmlFor="transactions-notifications" className="text-sm text-[#1C3B5A]">
                  Transacciones
                </label>
              </div>
              <Checkbox
                id="transactions-notifications"
                checked={notificationTypes.transactions}
                onChange={(e) => onUpdateNotificationTypes("transactions", e.target.checked)}
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <CreditCard size={18} className="text-gray-500" aria-hidden="true" />
                <label htmlFor="account-notifications" className="text-sm text-[#1C3B5A]">
                  Actualizaciones de cuenta
                </label>
              </div>
              <Checkbox
                id="account-notifications"
                checked={notificationTypes.accountUpdates}
                onChange={(e) => onUpdateNotificationTypes("accountUpdates", e.target.checked)}
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-gray-500" aria-hidden="true" />
                <label htmlFor="security-notifications" className="text-sm text-[#1C3B5A]">
                  Seguridad
                </label>
              </div>
              <Checkbox
                id="security-notifications"
                checked={notificationTypes.security}
                onChange={(e) => onUpdateNotificationTypes("security", e.target.checked)}
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <PiggyBank size={18} className="text-gray-500" aria-hidden="true" />
                <label htmlFor="promotions-notifications" className="text-sm text-[#1C3B5A]">
                  Promociones y ofertas
                </label>
              </div>
              <Checkbox
                id="promotions-notifications"
                checked={notificationTypes.promotions}
                onChange={(e) => onUpdateNotificationTypes("promotions", e.target.checked)}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Idioma y tema */}
        <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-base font-medium text-[#1C3B5A] mb-2 flex items-center" id="language-heading">
              <Languages size={18} className="mr-2" aria-hidden="true" /> Idioma
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  disabled={isLoading}
                  aria-labelledby="language-heading"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      <span>Cargando...</span>
                    </>
                  ) : (
                    <>
                      {currentLanguage.name}
                      <ChevronDown size={16} aria-hidden="true" />
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                {languages.map((lang) => (
                  <DropdownMenuItem key={lang.code} onClick={() => onChangeLanguage(lang.code)} disabled={isLoading}>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <h3 className="text-base font-medium text-[#1C3B5A] mb-2 flex items-center" id="dark-mode-heading">
              <Moon size={18} className="mr-2" aria-hidden="true" /> Modo oscuro
            </h3>
            <div className="flex items-center">
              <Checkbox
                id="dark-mode"
                checked={darkMode}
                onChange={(e) => onToggleDarkMode(e.target.checked)}
                disabled={isLoading}
                aria-labelledby="dark-mode-heading"
              />
              <label htmlFor="dark-mode" className="ml-2 text-sm text-[#1C3B5A]">
                Activar modo oscuro
              </label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
