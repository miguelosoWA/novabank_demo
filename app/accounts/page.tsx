"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, CreditCard, DollarSign, Wallet, Filter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BackButton } from "@/components/navigation/back-button"

// Datos de ejemplo
const accounts = [
  {
    id: "savings-1",
    type: "savings" as const,
    name: "Cuenta de Ahorros Principal",
    number: "4552 **** **** 7895",
    balance: 45678.9,
    currency: "MXN",
    interestRate: 3.5,
  },
  {
    id: "checking-1",
    type: "checking" as const,
    name: "Cuenta Corriente",
    number: "4552 **** **** 4321",
    balance: 12500.75,
    currency: "MXN",
  },
  {
    id: "credit-1",
    type: "credit" as const,
    name: "Tarjeta Oro",
    number: "5412 **** **** 3456",
    balance: 12500.75,
    currency: "MXN",
    limit: 50000,
    availableCredit: 37499.25,
  },
]

export default function AccountsPage() {
  const router = useRouter()
  const [filter, setFilter] = useState<"all" | "savings" | "checking" | "credit">("all")

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const getAccountIcon = (type: "savings" | "checking" | "credit") => {
    switch (type) {
      case "savings":
        return <DollarSign size={20} className="text-white" />
      case "checking":
        return <Wallet size={20} className="text-white" />
      case "credit":
        return <CreditCard size={20} className="text-white" />
    }
  }

  const getAccountGradient = (type: "savings" | "checking" | "credit") => {
    switch (type) {
      case "savings":
        return "from-[#1C3B5A] to-[#2a5580]"
      case "checking":
        return "from-[#2a5580] to-[#3a6590]"
      case "credit":
        return "from-[#DEA742] to-[#e8c078]"
    }
  }

  const getAccountTypeName = (type: "savings" | "checking" | "credit") => {
    switch (type) {
      case "savings":
        return "Cuenta de Ahorros"
      case "checking":
        return "Cuenta Corriente"
      case "credit":
        return "Tarjeta de Crédito"
    }
  }

  const filteredAccounts = accounts.filter((account) => filter === "all" || account.type === filter)

  // Calculate totals
  const totals = accounts.reduce(
    (acc, account) => {
      if (account.type === "credit") {
        acc.debt += account.balance
      } else {
        acc.balance += account.balance
      }
      return acc
    },
    { balance: 0, debt: 0 },
  )

  // Datos de ejemplo para movimientos y resumen financiero
  const movimientos = [
    { tipo: 'ingreso', descripcion: 'Depósito recibida', detalle: 'Transferencia de nómina', monto: 15000, fecha: '15 May 2025' },
    { tipo: 'gasto', descripcion: 'Supermercado La Comer', detalle: 'Compras semanales', monto: -1250.75, fecha: '14 May 2025' },
    { tipo: 'gasto', descripcion: 'Starbucks', detalle: 'Café', monto: -85.5, fecha: '14 May 2025' },
    { tipo: 'gasto', descripcion: 'Pago de hipoteca', detalle: 'Mensualidad mayo', monto: -8500, fecha: '10 May 2025' },
    { tipo: 'gasto', descripcion: 'Pago de tarjeta', detalle: 'Tarjeta Oro', monto: -5000, fecha: '05 May 2025' },
  ]
  const resumen = {
    ingresos: 15000,
    gastos: 14836.25,
    balance: 163.75,
  }

  return (
    <div className="min-h-screen pb-16 md:pb-20 bg-[#F4F8F6]">
      <div className="max-w-md mx-auto px-2 md:px-0 py-6 space-y-6">
        {/* Tarjetas resumen de cuentas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cuenta de Ahorros */}
          <div className="rounded-2xl bg-[#0097A7] text-white p-4 flex flex-col shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5" />
              <span className="font-semibold">Cuenta de Ahorros</span>
              <span className="ml-auto text-xs opacity-80">7895</span>
            </div>
            <div className="text-xs opacity-80 mb-1">Saldo disponible</div>
            <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-clash-display)' }}>$35,000</div>
          </div>
          {/* Tarjeta Oro */}
          <div className="rounded-2xl bg-[#DEA742] text-white p-4 flex flex-col shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-5 w-5" />
              <span className="font-semibold">Tarjeta Oro</span>
              <span className="ml-auto text-xs opacity-80">3456</span>
            </div>
            <div className="text-xs opacity-80 mb-1">Saldo Actual</div>
            <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-clash-display)' }}>$12,500.75</div>
            <div className="flex justify-between text-xs mt-2">
              <span>Límite <span className="font-bold">$50,000</span></span>
              <span>Disponible <span className="font-bold">$37,499.25</span></span>
            </div>
          </div>
        </div>

        {/* Movimientos recientes */}
        <div className="rounded-2xl bg-white p-4 shadow-md">
          <h2 className="text-lg font-bold text-[#1C3B5A] mb-3" style={{ fontFamily: 'var(--font-clash-display)' }}>Movimientos recientes</h2>
          <ul className="divide-y divide-gray-100">
            {movimientos.map((mov, i) => (
              <li key={i} className="flex items-center py-2 gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${mov.tipo === 'ingreso' ? 'bg-[#E6F7ED]' : 'bg-[#FFF0F0]'}`}> 
                  {mov.tipo === 'ingreso' ? <DollarSign className="text-[#00C96B]" /> : <CreditCard className="text-[#F87171]" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-900">{mov.descripcion}</div>
                  <div className="text-xs text-gray-400">{mov.detalle}</div>
                </div>
                <div className={`text-sm font-bold ${mov.tipo === 'ingreso' ? 'text-[#00C96B]' : 'text-[#F87171]'}`}>{mov.monto > 0 ? '+' : ''}${Math.abs(mov.monto).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                <div className="text-xs text-gray-400 ml-2 whitespace-nowrap">{mov.fecha}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Resumen financiero */}
        <div className="rounded-2xl bg-white p-4 shadow-md">
          <h2 className="text-lg font-bold text-[#1C3B5A] mb-3" style={{ fontFamily: 'var(--font-clash-display)' }}>Resumen financiero</h2>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span>Ingresos (Mayo):</span>
              <span className="font-bold text-[#00C96B]">${resumen.ingresos.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Gastos (Mayo):</span>
              <span className="font-bold text-[#F87171]">${resumen.gastos.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Balance:</span>
              <span className="font-bold text-[#1C3B5A]">${resumen.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            {/* Barra de progreso */}
            <div className="mt-2">
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#00C96B]" style={{ width: `${Math.max(0, Math.min(100, (resumen.balance / resumen.ingresos) * 100))}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
