"use client"

import { useState } from "react"

// Define user activity types
export type UserBehavior = {
  // Pages/sections visited recently
  recentViews: {
    section: string
    timestamp: number
    frequency: number
  }[]
  // User interactions
  interactions: {
    type: string
    value: string
    timestamp: number
  }[]
  // Financial data
  financialContext: {
    availableBalance: number
    savingsGoals?: number
    riskProfile?: "conservative" | "moderate" | "aggressive"
  }
  // Preferences
  preferences: {
    hasDismissedSuggestion?: boolean
    preferredInvestmentTypes?: string[]
  }
}

export function useUserActivity() {
  // In a real app, this would be loaded from a database or local storage
  const [userActivity, setUserActivity] = useState<UserBehavior>({
    recentViews: [
      { section: "savings", timestamp: Date.now() - 1000 * 60 * 60 * 24, frequency: 3 },
      { section: "investments", timestamp: Date.now() - 1000 * 60 * 60 * 48, frequency: 5 },
      { section: "calculator", timestamp: Date.now() - 1000 * 60 * 60 * 72, frequency: 2 },
    ],
    interactions: [
      { type: "calculator", value: "interest", timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2 },
      { type: "search", value: "inversiones seguras", timestamp: Date.now() - 1000 * 60 * 60 * 24 * 1 },
    ],
    financialContext: {
      availableBalance: 35000,
      riskProfile: "moderate",
    },
    preferences: {
      hasDismissedSuggestion: false,
    },
  })

  // Function to add a new section view
  const trackSectionView = (section: string) => {
    setUserActivity((prev) => {
      const updatedViews = [...prev.recentViews]
      const existingViewIndex = updatedViews.findIndex((view) => view.section === section)

      if (existingViewIndex >= 0) {
        // Update existing section view
        updatedViews[existingViewIndex] = {
          ...updatedViews[existingViewIndex],
          timestamp: Date.now(),
          frequency: updatedViews[existingViewIndex].frequency + 1,
        }
      } else {
        // Add new section view
        updatedViews.push({
          section,
          timestamp: Date.now(),
          frequency: 1,
        })
      }

      return {
        ...prev,
        recentViews: updatedViews,
      }
    })
  }

  // Function to add a new interaction
  const trackInteraction = (type: string, value: string) => {
    setUserActivity((prev) => ({
      ...prev,
      interactions: [...prev.interactions, { type, value, timestamp: Date.now() }],
    }))
  }

  // Function to update financial context
  const updateFinancialContext = (updates: Partial<UserBehavior["financialContext"]>) => {
    setUserActivity((prev) => ({
      ...prev,
      financialContext: {
        ...prev.financialContext,
        ...updates,
      },
    }))
  }

  // Function to update preferences
  const updatePreferences = (updates: Partial<UserBehavior["preferences"]>) => {
    setUserActivity((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...updates,
      },
    }))
  }

  // Helper functions to analyze user behavior

  // Check if user has shown interest in a specific section
  const hasInterestIn = (section: string, threshold = 2): boolean => {
    const sectionView = userActivity.recentViews.find((view) => view.section === section)
    return !!sectionView && sectionView.frequency >= threshold
  }

  // Get user's most viewed sections
  const getMostViewedSections = (limit = 3): string[] => {
    return [...userActivity.recentViews]
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit)
      .map((view) => view.section)
  }

  // Check if user has available balance for investment
  const hasAvailableBalanceForInvestment = (minimumAmount = 5000): boolean => {
    return userActivity.financialContext.availableBalance >= minimumAmount
  }

  // Get investment recommendations based on user behavior
  const getInvestmentRecommendations = () => {
    const isInterestedInSavings = hasInterestIn("savings")
    const isInterestedInInvestments = hasInterestIn("investments")
    const hasUsedCalculator = userActivity.interactions.some((int) => int.type === "calculator")
    const availableBalance = userActivity.financialContext.availableBalance
    const riskProfile = userActivity.financialContext.riskProfile

    // Different recommendations based on behavior patterns
    if (isInterestedInInvestments && hasUsedCalculator && availableBalance > 20000) {
      return {
        type: "mixed_portfolio",
        title: "Portafolio de inversión mixto",
        description: "Basado en tu actividad reciente, recomendamos un portafolio diversificado.",
      }
    } else if (isInterestedInSavings && availableBalance > 10000) {
      return {
        type: "time_deposit",
        title: "Depósito a plazo fijo",
        description: "Maximiza tus ahorros con nuestro depósito a plazo personalizado.",
      }
    } else {
      return {
        type: "savings_account",
        title: "Cuenta de ahorro con rendimiento",
        description: "Comienza a hacer crecer tu dinero con nuestra cuenta de ahorro premium.",
      }
    }
  }

  return {
    userActivity,
    trackSectionView,
    trackInteraction,
    updateFinancialContext,
    updatePreferences,
    hasInterestIn,
    getMostViewedSections,
    hasAvailableBalanceForInvestment,
    getInvestmentRecommendations,
  }
}
