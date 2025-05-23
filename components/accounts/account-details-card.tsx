"use client"

import { useState } from "react"
import { CreditCard, DollarSign, Eye, EyeOff, Share2, Download, MoreHorizontal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AccountDetailsCardProps {
  type: "savings" | "checking" | "credit"
  name: string
  number: string
  balance: number
  currency?: string
  limit?: number
  availableCredit?: number
  interestRate?: number
  dueDate?: string
  onViewTransactions: () => void
}

export function AccountDetailsCard({
  type,
  name,
  number,
  balance,
  currency = "MXN",
  limit,
  availableCredit,
  interestRate,
  dueDate,
  onViewTransactions,
}: AccountDetailsCardProps) {
  const [isNumberHidden, setIsNumberHidden] = useState(true)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const getCardIcon = () => {
    switch (type) {
      case "savings":
        return <DollarSign size={24} className="text-white" />
      case "checking":
        return <DollarSign size={24} className="text-white" />
      case "credit":
        return <CreditCard size={24} className="text-white" />
    }
  }

  const getCardGradient = () => {
    switch (type) {
      case "savings":
        return "from-[#1C3B5A] to-[#2a5580]"
      case "checking":
        return "from-[#2a5580] to-[#3a6590]"
      case "credit":
        return "from-[#DEA742] to-[#e8c078]"
    }
  }

  const getCardTitle = () => {
    switch (type) {
      case "savings":
        return "Cuenta de Ahorros"
      case "checking":
        return "Cuenta Corriente"
      case "credit":
        return "Tarjeta de Crédito"
    }
  }

  const toggleNumberVisibility = () => {
    setIsNumberHidden(!isNumberHidden)
  }

  const maskedNumber = isNumberHidden ? number.replace(/\d(?=\d{4})/g, "•") : number

  return (
    <Card className={`overflow-hidden`}>
      <CardContent className="p-0">
        {/* Card header with gradient */}
        <div className={`bg-gradient-to-r ${getCardGradient()} p-4 sm:p-5 md:p-6`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white text-sm opacity-80">{getCardTitle()}</p>
              <h3 className="text-white text-xl font-bold mt-1">{name}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">{getCardIcon()}</div>
          </div>

          <div className="mt-6 flex items-center">
            <p className="text-white text-sm opacity-80 mr-2">Número de cuenta</p>
            <button
              onClick={toggleNumberVisibility}
              className="text-white opacity-80 hover:opacity-100 transition-opacity"
            >
              {isNumberHidden ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
          <p className="text-white font-mono text-lg">{maskedNumber}</p>

          <div className="mt-4">
            <p className="text-white text-sm opacity-80">{type === "credit" ? "Saldo actual" : "Saldo disponible"}</p>
            <p className="text-white text-2xl font-bold mt-1">{formatCurrency(balance)}</p>

            {type === "credit" && limit && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-white/80">
                  <span>Límite: {formatCurrency(limit)}</span>
                  <span>Disponible: {formatCurrency(availableCredit || limit - balance)}</span>
                </div>
                <div className="mt-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white" style={{ width: `${(balance / limit) * 100}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card details */}
        <div className="p-4 sm:p-5 md:p-6 bg-white">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {interestRate && (
              <div>
                <p className="text-sm text-gray-500">Tasa de interés</p>
                <p className="text-[#1C3B5A] font-medium">{interestRate}% anual</p>
              </div>
            )}

            {dueDate && (
              <div>
                <p className="text-sm text-gray-500">Fecha de pago</p>
                <p className="text-[#1C3B5A] font-medium">{dueDate}</p>
              </div>
            )}

            {type === "savings" && (
              <div>
                <p className="text-sm text-gray-500">Rendimiento mensual</p>
                <p className="text-[#1C3B5A] font-medium">
                  {formatCurrency((balance * (interestRate || 0)) / 100 / 12)}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={onViewTransactions} variant="outline" size="sm">
              Ver movimientos
            </Button>

            <Button variant="outline" size="sm" leftIcon={<Share2 size={16} />}>
              Compartir datos
            </Button>

            <Button variant="outline" size="sm" leftIcon={<Download size={16} />}>
              Estado de cuenta
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Configurar cuenta</DropdownMenuItem>
                <DropdownMenuItem>Cambiar nombre</DropdownMenuItem>
                <DropdownMenuItem>Establecer límites</DropdownMenuItem>
                <DropdownMenuItem>Reportar problema</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
