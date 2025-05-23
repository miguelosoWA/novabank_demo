"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AccountDetailsCard } from "@/components/accounts/account-details-card"
import { TransactionHistory, type Transaction } from "@/components/accounts/transaction-history"
import { SpendingAnalysis } from "@/components/accounts/spending-analysis"
import { QuickActions } from "@/components/accounts/quick-actions"
import { BackButton } from "@/components/navigation/back-button"

// Datos de ejemplo
const accountsData = {
  "savings-1": {
    type: "savings" as const,
    name: "Cuenta de Ahorros Principal",
    number: "4552 7895 1234 5678",
    balance: 45678.9,
    interestRate: 3.5,
  },
  "checking-1": {
    type: "checking" as const,
    name: "Cuenta Corriente",
    number: "4552 7895 8765 4321",
    balance: 12500.75,
  },
  "credit-1": {
    type: "credit" as const,
    name: "Tarjeta Oro",
    number: "5412 3456 7890 1234",
    balance: 12500.75,
    limit: 50000,
    availableCredit: 37499.25,
    dueDate: "28/05/2025",
  },
}

// Datos de ejemplo para transacciones
const generateTransactions = (accountId: string, count: number): Transaction[] => {
  const now = Date.now()
  const day = 24 * 60 * 60 * 1000
  const transactions: Transaction[] = []

  const categories: Transaction["category"][] = ["transfer", "shopping", "food", "housing", "credit", "other"]
  const descriptions = [
    "Transferencia recibida",
    "Supermercado",
    "Restaurante",
    "Pago de servicios",
    "Pago de tarjeta",
    "Compra en línea",
    "Retiro de efectivo",
    "Depósito",
    "Suscripción",
    "Entretenimiento",
  ]

  for (let i = 0; i < count; i++) {
    const type = Math.random() > 0.3 ? "expense" : "income"
    const category = categories[Math.floor(Math.random() * categories.length)]
    const amount = Math.floor(Math.random() * 5000) + 100
    const timestamp = now - Math.floor(Math.random() * 90) * day
    const date = new Date(timestamp).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })

    transactions.push({
      id: `${accountId}-${i}`,
      title: type === "income" ? "Depósito" : descriptions[Math.floor(Math.random() * descriptions.length)],
      description: type === "income" ? "Transferencia recibida" : "Pago con tarjeta",
      amount,
      type,
      category,
      date,
      timestamp,
    })
  }

  return transactions.sort((a, b) => b.timestamp - a.timestamp)
}

export default function AccountDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const accountId = params.id as string
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    // Simulate loading transactions
    setTransactions(generateTransactions(accountId, 20))
  }, [accountId])

  const account = accountsData[accountId as keyof typeof accountsData]

  if (!account) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-[#1C3B5A]">Cuenta no encontrada</h1>
        <p className="text-gray-500 mt-2">La cuenta que buscas no existe o no tienes acceso a ella.</p>
        <Button className="mt-4" onClick={() => router.push("/accounts")}>
          Volver a Cuentas
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-4 md:px-6 lg:px-8 pb-16 md:pb-20 max-w-screen-xl mx-auto">
      <div className="mb-6">
        {/* Modificar la navegación para usar el componente BackButton */}
        <div className="flex items-center space-x-2 mb-4">
          <BackButton destination="/accounts" label="Volver a Cuentas" className="" />
          <Button variant="ghost" size="sm" leftIcon={<Home size={16} />} onClick={() => router.push("/dashboard")}>
            Inicio
          </Button>
        </div>
        <h1 className="text-2xl font-bold text-[#1C3B5A]">Detalles de cuenta</h1>
        <p className="text-gray-500">Gestiona y analiza tu cuenta</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AccountDetailsCard
            {...account}
            onViewTransactions={() => {
              // Already on transactions view
            }}
          />

          <TransactionHistory transactions={transactions} accountName={account.name} accountType={account.type} />
        </div>

        <div className="space-y-6">
          <QuickActions
            accountType={account.type}
            userName="Carlos"
            accountBalance={account.balance}
            hasUnusedCredit={account.type === "credit" && account.availableCredit > 10000}
            lowSavings={account.type === "savings" && account.balance < 10000}
          />

          <SpendingAnalysis transactions={transactions} accountType={account.type} />
        </div>
      </div>
    </div>
  )
}
