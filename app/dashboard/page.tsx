"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, Sparkles } from "lucide-react"
import { AccountCard } from "@/components/dashboard/account-card"
import { TransactionList } from "@/components/dashboard/transaction-list"
import { Button } from "@/components/ui/button"
import { useUserActivity } from "@/hooks/use-user-activity"

const transactions = [
  {
    id: "1",
    title: "Depósito recibido",
    description: "Transferencia de nómina",
    amount: 15000,
    type: "income" as const,
    category: "transfer" as const,
    date: "15 May, 2025",
  },
  {
    id: "2",
    title: "Supermercado La Comer",
    description: "Compras semanales",
    amount: 1250.75,
    type: "expense" as const,
    category: "shopping" as const,
    date: "14 May, 2025",
  },
  {
    id: "3",
    title: "Starbucks",
    description: "Café",
    amount: 85.5,
    type: "expense" as const,
    category: "food" as const,
    date: "14 May, 2025",
  },
  {
    id: "4",
    title: "Pago de hipoteca",
    description: "Mensualidad mayo",
    amount: 8500,
    type: "expense" as const,
    category: "housing" as const,
    date: "10 May, 2025",
  },
  {
    id: "5",
    title: "Pago de tarjeta",
    description: "Tarjeta Oro",
    amount: 5000,
    type: "expense" as const,
    category: "credit" as const,
    date: "05 May, 2025",
  },
]

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const userName = "Carlos"
  const hasTrackedViewRef = useRef(false)

  const {
    userActivity,
    trackSectionView,
    trackInteraction,
    hasInterestIn,
    hasAvailableBalanceForInvestment,
  } = useUserActivity()

  useEffect(() => {
    if (hasTrackedViewRef.current) return

    hasTrackedViewRef.current = true
    trackSectionView("dashboard")
  }, [trackSectionView])

  useEffect(() => {
    if (hasInterestIn("investments") && hasAvailableBalanceForInvestment()) {
      const timer = setTimeout(() => undefined, 5000)
      return () => clearTimeout(timer)
    }
  }, [hasAvailableBalanceForInvestment, hasInterestIn])

  const handleRefresh = () => {
    setIsLoading(true)
    trackInteraction("refresh", "dashboard")

    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  const availableBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(userActivity.financialContext.availableBalance)

  return (
    <>
      <main className="bi-shell min-h-full w-full px-0 py-0">
        <section className="bi-card-hero bi-feature-radius mx-4 mb-4 mt-4 overflow-hidden px-5 py-6 text-white md:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-3">
              <div>
                <h1 className="font-display text-3xl font-semibold md:text-4xl">Hola, {userName}</h1>
              </div>
            </div>

            <div className="flex flex-col items-start gap-2 rounded-lg bg-white/10 px-4 py-3 backdrop-blur">
              <span className="text-xs uppercase tracking-[0.24em] text-white/70">Saldo disponible</span>
              <span className="text-3xl font-semibold">{availableBalance}</span>
              <Button variant="primary" size="sm" onClick={handleRefresh} isLoading={isLoading} className="mt-1">
                Actualizar
              </Button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 px-4 pb-8">
          <section className="bi-card bi-feature-radius flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent-dark">Siguiente mejor acción</p>
              <h2 className="font-display mt-2 text-2xl font-semibold text-primary">Haz crecer tu saldo con herramientas Bi</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#4F5151]">
                Explora recomendaciones, transferencias y soluciones de inversión sin salir de tu panel principal.
              </p>
            </div>
            <Button variant="outline" rightIcon={<ArrowRight size={16} />}>
              Ver oportunidades
            </Button>
          </section>

          <div>
            <TransactionList transactions={transactions} />
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 bg-primary py-4 text-center text-white">
        <p className="text-sm">2026© Banco Industrial / Todos los derechos reservados.</p>
      </footer>
    </>
  )
}
