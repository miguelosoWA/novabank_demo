"use client"

import { useState, useEffect } from "react"
import { TrendingUp, ThumbsUp, ThumbsDown, X, BarChart2, LineChart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"

interface PersonalizedRecommendationProps {
  userName: string
  availableBalance: number
  onDismiss: () => void
  onAction: () => void
  onFeedback: (isHelpful: boolean) => void
}

export function PersonalizedRecommendation({
  userName,
  availableBalance,
  onDismiss,
  onAction,
  onFeedback,
}: PersonalizedRecommendationProps) {
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [currentSuggestion, setCurrentSuggestion] = useState(0)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount)
  }

  // Recommendations based on user behavior
  const recommendations = [
    {
      title: `${userName}, notamos que estás buscando mejores rendimientos`,
      description: `Con tu saldo disponible de ${formatCurrency(availableBalance)}, podrías obtener hasta ${formatCurrency(availableBalance * 0.12)} en 12 meses con nuestro depósito a plazo personalizado.`,
      cta: "Ver oferta personalizada",
      icon: <TrendingUp size={24} className="text-[#DEA742]" />,
    },
    {
      title: `Una estrategia de inversión adaptada a tu perfil`,
      description: `Basado en tu actividad reciente, creamos una estrategia de inversión que podría maximizar tus ahorros con bajo riesgo.`,
      cta: "Ver detalles",
      icon: <LineChart size={24} className="text-[#DEA742]" />,
    },
    {
      title: `Oportunidad exclusiva para ti, ${userName}`,
      description: `Hemos identificado un instrumento de inversión con rendimiento del 9.5% anual que se alinea perfectamente con tus hábitos financieros.`,
      cta: "Simular inversión",
      icon: <BarChart2 size={24} className="text-[#DEA742]" />,
    },
  ]

  // Rotate recommendations every 5 days
  useEffect(() => {
    // In a real app, this would be based on server-side data or local storage
    const date = new Date()
    const startOfYear = new Date(date.getFullYear(), 0, 0)
    const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
    setCurrentSuggestion(dayOfYear % recommendations.length)
  }, [recommendations.length])

  const handleFeedback = (isHelpful: boolean) => {
    onFeedback(isHelpful)
    setFeedbackSubmitted(true)

    // Hide feedback options after submission
    setTimeout(() => {
      setShowFeedback(false)
    }, 2000)
  }

  const currentRecommendation = recommendations[currentSuggestion]

  if (!isVisible) return null

  return (
    <Card className={`overflow-hidden transition-all duration-300 ${feedbackSubmitted ? "opacity-90" : ""}`}>
      <CardContent className="p-0">
        <div className="relative">
          {/* Personalized banner background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C3B5A] to-[#2a5580] opacity-90" />

          {/* Pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm10 10h10v10H10V10zM0 10h10v10H0V10z' fill='%23FFFFFF' fillOpacity='1' fillRule='evenodd'/%3E%3C/svg%3E\")",
              backgroundSize: "12px 12px",
            }}
          />

          {/* Content */}
          <div className="relative p-6 text-white">
            {/* Dismiss button */}
            <button
              onClick={onDismiss}
              className="absolute top-2 right-2 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X size={16} className="text-white" />
            </button>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                {currentRecommendation.icon}
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{currentRecommendation.title}</h3>
                <p className="text-sm text-white/80 mb-4">{currentRecommendation.description}</p>

                <div
                  className={`flex ${isDesktop ? "items-center" : "flex-col space-y-3"} ${showFeedback ? "justify-start" : "hidden"}`}
                >
                  {showFeedback && !feedbackSubmitted && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-white/80">¿Te fue útil?</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 rounded-full bg-white/10 hover:bg-white/20"
                        onClick={() => handleFeedback(true)}
                      >
                        <ThumbsUp size={14} className="text-white" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 rounded-full bg-white/10 hover:bg-white/20"
                        onClick={() => handleFeedback(false)}
                      >
                        <ThumbsDown size={14} className="text-white" />
                      </Button>
                    </div>
                  )}

                  {feedbackSubmitted && <span className="text-xs text-white/80">¡Gracias por tu opinión!</span>}

                  {/* CTA button removed as requested */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
