"use client"

import { useState, useEffect } from "react"
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
      <main className="min-h-screen p-0 bg-[#c9e6d4]">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="bg-[#2D7A4A] text-white py-6 px-6 shadow-m">
            <h1 className="text-2xl font-bold text-center">Oportunidades para ti</h1>
          </div>

          {/* Cards Container */}
          <div className="bg-transparent backdrop-blur-sm rounded-b-xl pt-4 p-6 space-y-4">
            {/* CDT Card */}
            <div className="flex items-center bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                 onClick={() => {
                   setIsInvestmentSimulatorOpen(true)
                   trackInteraction("click", "opportunity_card_investment")
                 }}>
              <div className="bg-[#074f2a] w-20 h-20 flex items-center justify-center">
                <span className="text-white font-bold text-lg">CDT</span>
              </div>
              <div className="flex-1 p-4">
                <h3 className="text-gray-800 font-semibold text-base leading-tight">
                  Certificado de Depósito a Termino
                </h3>
              </div>
            </div>

            {/* FIC Card */}
            <div className="flex items-center bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                 onClick={() => {
                   window.alert("Abriendo artículo...")
                   trackInteraction("click", "opportunity_card_article")
                 }}>
              <div className="bg-[#074f2a] w-20 h-20 flex items-center justify-center">
                <span className="text-white font-bold text-lg">FIC</span>
              </div>
              <div className="flex-1 p-4">
                <h3 className="text-gray-800 font-semibold text-base leading-tight">
                  Fondo de Inversión Colectiva
                </h3>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
