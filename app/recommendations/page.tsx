"use client"

import { useState, useEffect } from "react"
import { TrendingUp, BookOpen, PiggyBank } from "lucide-react"
import { AccountCard } from "@/components/dashboard/account-card"
import { OpportunityCard } from "@/components/dashboard/opportunity-card"
import { TransactionList } from "@/components/dashboard/transaction-list"
import { InvestmentSimulator } from "@/components/dashboard/investment-simulator"
import { PersonalizedRecommendation } from "@/components/dashboard/personalized-recommendation"
import { ContextualNotification } from "@/components/dashboard/contextual-notification"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserActivity } from "@/hooks/use-user-activity"

// Datos de ejemplo
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
  const [isInvestmentSimulatorOpen, setIsInvestmentSimulatorOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [showRecommendation, setShowRecommendation] = useState(true)
  const userName = "Carlos"

  const {
    userActivity,
    trackSectionView,
    trackInteraction,
    hasInterestIn,
    hasAvailableBalanceForInvestment,
    getInvestmentRecommendations,
    updatePreferences,
  } = useUserActivity()

  // Track dashboard view
  useEffect(() => {
    trackSectionView("dashboard")

    // Show contextual notification after a delay if user has interest in investments
    if (hasInterestIn("investments") && hasAvailableBalanceForInvestment()) {
      const timer = setTimeout(() => {
        setShowNotification(true)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [])

  // Handle refresh - simulate data reload
  const handleRefresh = () => {
    setIsLoading(true)
    trackInteraction("refresh", "dashboard")

    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  // Handle when user clicks on a recommendation
  const handleRecommendationAction = () => {
    trackInteraction("click", "investment_recommendation")
    setIsInvestmentSimulatorOpen(true)
  }

  // Handle feedback on recommendations
  const handleRecommendationFeedback = (isHelpful: boolean) => {
    trackInteraction("feedback", isHelpful ? "positive" : "negative")
    updatePreferences({
      preferredInvestmentTypes: isHelpful ? ["time_deposit"] : [],
    })
  }

  return (
    <>
      <main className="container mx-auto px-0 py-0">
        {/* Sección de oportunidades personalizadas - Ahora segundo */}
        <div className="mb-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[#1C3B5A]">Oportunidades para ti</h3>
          </div>

          <div className="space-y-0">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <OpportunityCard
                title="Certificado de Deposito a Termino (CDT)"
                description=""
                cta=""
                icon={<TrendingUp size={20} className="text-[#1C3B5A]" />}
                onClick={() => {
                  setIsInvestmentSimulatorOpen(true)
                  trackInteraction("click", "opportunity_card_investment")
                }}
              />

              <OpportunityCard
                title="Fondo de Inversión Colectiva (FIC)"
                description=""
                cta=""
                icon={<BookOpen size={20} className="text-[#1C3B5A]" />}
                onClick={() => {
                  window.alert("Abriendo artículo...")
                  trackInteraction("click", "opportunity_card_article")
                }}
              />

              <OpportunityCard
                title="Cuenta AFC"
                description=""
                cta=""
                icon={<BookOpen size={20} className="text-[#1C3B5A]" />}
                onClick={() => {
                  window.alert("Abriendo artículo...")
                  trackInteraction("click", "opportunity_card_article")
                }}
              />

            </div>
          </div>
        </div>

      </main>

    </>
  )
}
