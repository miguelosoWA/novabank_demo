"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BackButton } from "@/components/navigation/back-button"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileForm } from "@/components/profile/profile-form"
import { SecuritySettings } from "@/components/profile/security-settings"
import { PreferencesSettings } from "@/components/profile/preferences-settings"
import { LinkedAccounts } from "@/components/profile/linked-accounts"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useMediaQuery } from "@/hooks/use-media-query"

// Datos de ejemplo del usuario
const userData = {
  name: "Carlos Rodríguez",
  email: "carlos.rodriguez@ejemplo.com",
  phone: "+52 55 1234 5678",
  address: "Av. Insurgentes Sur 1234, Ciudad de México",
  occupation: "Ingeniero de Software",
  birthdate: "15/04/1988",
  avatarUrl: "",
  security: {
    lastPasswordChange: "12/03/2025",
    twoFactorEnabled: true,
    loginNotifications: true,
  },
  preferences: {
    notificationPreferences: {
      email: true,
      push: true,
      sms: false,
    },
    notificationTypes: {
      transactions: true,
      security: true,
      promotions: false,
      accountUpdates: true,
    },
    language: "es",
    darkMode: false,
  },
  linkedAccounts: [
    {
      id: "google-1",
      name: "Google",
      type: "google",
      icon: "/google-logo.png",
      isConnected: true,
    },
  ],
}

export default function ProfilePage() {
  const router = useRouter()
  const [profileData, setProfileData] = useState(userData)
  const [activeTab, setActiveTab] = useState("personal")
  const [isLoading, setIsLoading] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Efecto para manejar el enfoque cuando cambia la pestaña
  useEffect(() => {
    // Encuentra el elemento de contenido de la pestaña activa y establece el enfoque en él
    const activeElement = document.getElementById(`tab-content-${activeTab}`)
    if (activeElement) {
      activeElement.focus()
    }
  }, [activeTab])

  // Manejadores para actualizar datos del perfil
  const handleUpdateProfile = (data: any) => {
    setIsLoading(true)

    // Simulamos una operación asíncrona
    setTimeout(() => {
      setProfileData((prev) => ({
        ...prev,
        ...data,
      }))
      setIsLoading(false)
      toast({
        title: "Perfil actualizado",
        description: "Tu información personal ha sido actualizada correctamente.",
      })
    }, 600)
  }

  const handleUpdatePassword = () => {
    setIsLoading(true)

    // Simulamos una operación asíncrona
    setTimeout(() => {
      setProfileData((prev) => ({
        ...prev,
        security: {
          ...prev.security,
          lastPasswordChange: new Date().toLocaleDateString("es-MX"),
        },
      }))
      setIsLoading(false)
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido actualizada correctamente.",
      })
    }, 600)
  }

  const handleToggleTwoFactor = (enabled: boolean) => {
    setIsLoading(true)

    // Simulamos una operación asíncrona
    setTimeout(() => {
      setProfileData((prev) => ({
        ...prev,
        security: {
          ...prev.security,
          twoFactorEnabled: enabled,
        },
      }))
      setIsLoading(false)
      toast({
        title: enabled ? "Autenticación de dos factores activada" : "Autenticación de dos factores desactivada",
        description: enabled
          ? "Has activado la autenticación de dos factores."
          : "Has desactivado la autenticación de dos factores.",
      })
    }, 400)
  }

  const handleToggleLoginNotifications = (enabled: boolean) => {
    setIsLoading(true)

    // Simulamos una operación asíncrona
    setTimeout(() => {
      setProfileData((prev) => ({
        ...prev,
        security: {
          ...prev.security,
          loginNotifications: enabled,
        },
      }))
      setIsLoading(false)
      toast({
        title: enabled
          ? "Notificaciones de inicio de sesión activadas"
          : "Notificaciones de inicio de sesión desactivadas",
        description: enabled
          ? "Recibirás notificaciones cuando se detecte un inicio de sesión en un nuevo dispositivo."
          : "Ya no recibirás notificaciones de inicio de sesión.",
      })
    }, 400)
  }

  const handleUpdateNotificationPreferences = (key: string, value: boolean) => {
    setIsLoading(true)

    // Simulamos una operación asíncrona
    setTimeout(() => {
      setProfileData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          notificationPreferences: {
            ...prev.preferences.notificationPreferences,
            [key]: value,
          },
        },
      }))
      setIsLoading(false)
      toast({
        title: "Preferencias actualizadas",
        description: "Tus preferencias de notificación han sido actualizadas.",
      })
    }, 400)
  }

  const handleUpdateNotificationTypes = (key: string, value: boolean) => {
    setIsLoading(true)

    // Simulamos una operación asíncrona
    setTimeout(() => {
      setProfileData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          notificationTypes: {
            ...prev.preferences.notificationTypes,
            [key]: value,
          },
        },
      }))
      setIsLoading(false)
      toast({
        title: "Preferencias actualizadas",
        description: "Tus tipos de notificación han sido actualizados.",
      })
    }, 400)
  }

  const handleChangeLanguage = (language: string) => {
    setIsLoading(true)

    // Simulamos una operación asíncrona
    setTimeout(() => {
      setProfileData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          language,
        },
      }))
      setIsLoading(false)
      toast({
        title: "Idioma actualizado",
        description: "El idioma de la aplicación ha sido actualizado.",
      })
    }, 400)
  }

  const handleToggleDarkMode = (enabled: boolean) => {
    setIsLoading(true)

    // Simulamos una operación asíncrona
    setTimeout(() => {
      setProfileData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          darkMode: enabled,
        },
      }))
      setIsLoading(false)
      toast({
        title: enabled ? "Modo oscuro activado" : "Modo oscuro desactivado",
        description: enabled
          ? "Has activado el modo oscuro de la aplicación."
          : "Has desactivado el modo oscuro de la aplicación.",
      })
    }, 400)
  }

  const handleConnectAccount = (accountType: string) => {
    setIsLoading(true)

    // Simulamos una operación asíncrona
    setTimeout(() => {
      // En una aplicación real, aquí se manejaría la autenticación con el servicio externo
      const newAccount = {
        id: `${accountType}-${Date.now()}`,
        name: accountType.charAt(0).toUpperCase() + accountType.slice(1),
        type: accountType,
        icon: `/placeholder.svg?height=24&width=24&query=${accountType} logo`,
        isConnected: true,
      }

      setProfileData((prev) => ({
        ...prev,
        linkedAccounts: [...prev.linkedAccounts, newAccount],
      }))
      setIsLoading(false)
      toast({
        title: "Cuenta vinculada",
        description: `Has vinculado tu cuenta de ${newAccount.name} correctamente.`,
      })
    }, 800)
  }

  const handleDisconnectAccount = (accountId: string) => {
    setIsLoading(true)

    // Simulamos una operación asíncrona
    setTimeout(() => {
      setProfileData((prev) => ({
        ...prev,
        linkedAccounts: prev.linkedAccounts.filter((account) => account.id !== accountId),
      }))
      setIsLoading(false)
      toast({
        title: "Cuenta desvinculada",
        description: "Has desvinculado la cuenta correctamente.",
      })
    }, 600)
  }

  const handleLogout = () => {
    setIsLoading(true)

    // Simulamos una breve carga
    setTimeout(() => {
      // Redirigir al usuario a la página de inicio de sesión
      router.push("/login")

      // Mostrar notificación de cierre de sesión exitoso
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
      })
      setIsLoading(false)
    }, 500)
  }

  // Determinar el número de columnas para las pestañas según el tamaño de pantalla
  const tabsGridCols = isMobile ? "grid-cols-2" : "grid-cols-4"

  return (
    <div className="space-y-6 px-4 md:px-6 lg:px-8 pb-16 md:pb-20 max-w-screen-xl mx-auto">
      <div>
        <BackButton />
        <h1 className="text-2xl font-bold text-[#1C3B5A]" id="profile-heading">
          Tu Perfil
        </h1>
        <p className="text-gray-500">Administra tu información personal y preferencias</p>
      </div>

      <ProfileHeader
        name={profileData.name}
        email={profileData.email}
        phone={profileData.phone}
        avatarUrl={profileData.avatarUrl}
      />

      <div aria-live="polite" className="sr-only">
        {isLoading ? "Cargando, por favor espera..." : ""}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" aria-labelledby="profile-heading">
        <TabsList className={`grid ${tabsGridCols} mb-6`}>
          <TabsTrigger value="personal" aria-controls="tab-content-personal">
            {isMobile ? "Personal" : "Información Personal"}
          </TabsTrigger>
          <TabsTrigger value="security" aria-controls="tab-content-security">
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="preferences" aria-controls="tab-content-preferences">
            {isMobile ? "Prefer." : "Preferencias"}
          </TabsTrigger>
          <TabsTrigger value="linked" aria-controls="tab-content-linked">
            {isMobile ? "Cuentas" : "Cuentas vinculadas"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6 focus:outline-none" tabIndex={-1} id="tab-content-personal">
          <ProfileForm
            initialData={{
              name: profileData.name,
              email: profileData.email,
              phone: profileData.phone,
              address: profileData.address,
              occupation: profileData.occupation,
              birthdate: profileData.birthdate,
            }}
            onSave={handleUpdateProfile}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="security" className="space-y-6 focus:outline-none" tabIndex={-1} id="tab-content-security">
          <SecuritySettings
            lastPasswordChange={profileData.security.lastPasswordChange}
            twoFactorEnabled={profileData.security.twoFactorEnabled}
            loginNotifications={profileData.security.loginNotifications}
            onUpdatePassword={handleUpdatePassword}
            onToggleTwoFactor={handleToggleTwoFactor}
            onToggleLoginNotifications={handleToggleLoginNotifications}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent
          value="preferences"
          className="space-y-6 focus:outline-none"
          tabIndex={-1}
          id="tab-content-preferences"
        >
          <PreferencesSettings
            notificationPreferences={profileData.preferences.notificationPreferences}
            notificationTypes={profileData.preferences.notificationTypes}
            language={profileData.preferences.language}
            darkMode={profileData.preferences.darkMode}
            onUpdateNotificationPreferences={handleUpdateNotificationPreferences}
            onUpdateNotificationTypes={handleUpdateNotificationTypes}
            onChangeLanguage={handleChangeLanguage}
            onToggleDarkMode={handleToggleDarkMode}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="linked" className="space-y-6 focus:outline-none" tabIndex={-1} id="tab-content-linked">
          <LinkedAccounts
            accounts={profileData.linkedAccounts}
            onConnect={handleConnectAccount}
            onDisconnect={handleDisconnectAccount}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>

      {/* Botón de cerrar sesión */}
      <div className="mt-8 border-t pt-6">
        <Button variant="destructive" className="w-full sm:w-auto" onClick={handleLogout} aria-label="Cerrar sesión">
          <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>Cerrar sesión</span>
        </Button>
      </div>
    </div>
  )
}
