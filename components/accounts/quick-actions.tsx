"use client"

import { CreditCard, PiggyBank, ArrowRightLeft, Shield, Bell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface QuickActionsProps {
  accountType: "savings" | "checking" | "credit"
  userName: string
  accountBalance: number
  hasUnusedCredit?: boolean
  lowSavings?: boolean
}

export function QuickActions({
  accountType,
  userName,
  accountBalance,
  hasUnusedCredit,
  lowSavings,
}: QuickActionsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  // Personalized recommendations based on account type and user behavior
  const getPersonalizedRecommendation = () => {
    if (accountType === "credit" && hasUnusedCredit) {
      return {
        title: "Optimiza tu crédito",
        description: `${userName}, tienes crédito sin utilizar. Considera consolidar otras deudas con mayor interés.`,
        icon: <CreditCard size={20} className="text-[#1C3B5A]" />,
        action: "Ver opciones",
      }
    } else if (accountType === "savings" && lowSavings) {
      return {
        title: "Incrementa tus ahorros",
        description: `${userName}, configura un ahorro automático mensual para alcanzar tus metas financieras más rápido.`,
        icon: <PiggyBank size={20} className="text-[#1C3B5A]" />,
        action: "Configurar ahorro",
      }
    } else if (accountType === "checking") {
      return {
        title: "Protege tu cuenta",
        description: `${userName}, configura alertas de seguridad para monitorear la actividad de tu cuenta.`,
        icon: <Shield size={20} className="text-[#1C3B5A]" />,
        action: "Configurar alertas",
      }
    } else {
      return {
        title: "Gestiona tu dinero",
        description: `${userName}, configura categorías personalizadas para un mejor seguimiento de tus finanzas.`,
        icon: <Bell size={20} className="text-[#1C3B5A]" />,
        action: "Personalizar",
      }
    }
  }

  const recommendation = getPersonalizedRecommendation()

  return (
    <Card>
      <CardHeader className="px-4 sm:px-5 md:px-6 pb-2">
        <CardTitle className="text-lg">Acciones rápidas</CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-5 md:px-6">
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Button variant="outline" className="h-auto py-3 justify-start" leftIcon={<ArrowRightLeft size={18} />}>
            <div className="text-left">
              <span className="block text-sm">Transferir</span>
            </div>
          </Button>

          <Button variant="outline" className="h-auto py-3 justify-start" leftIcon={<PiggyBank size={18} />}>
            <div className="text-left">
              <span className="block text-sm">Ahorrar</span>
            </div>
          </Button>

          <Button variant="outline" className="h-auto py-3 justify-start" leftIcon={<CreditCard size={18} />}>
            <div className="text-left">
              <span className="block text-sm">Pagar</span>
            </div>
          </Button>

          <Button variant="outline" className="h-auto py-3 justify-start" leftIcon={<Shield size={18} />}>
            <div className="text-left">
              <span className="block text-sm">Seguridad</span>
            </div>
          </Button>
        </div>

        {/* Personalized recommendation */}
        <div className="bg-[#f0f5fa] rounded-lg p-3 sm:p-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              {recommendation.icon}
            </div>

            <div>
              <h4 className="text-sm font-medium text-[#1C3B5A]">{recommendation.title}</h4>
              <p className="text-xs text-gray-600 mt-1 mb-2">{recommendation.description}</p>
              <Button size="sm" variant="default">
                {recommendation.action}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
