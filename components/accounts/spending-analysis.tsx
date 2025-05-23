"use client"

import { useState } from "react"
import { BarChart2, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Transaction } from "@/components/accounts/transaction-history"

interface SpendingAnalysisProps {
  transactions: Transaction[]
  accountType: "savings" | "checking" | "credit"
}

export function SpendingAnalysis({ transactions, accountType }: SpendingAnalysisProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<"month" | "quarter" | "year">("month")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  // Filter transactions by timeframe and only expenses
  const getFilteredTransactions = () => {
    const now = Date.now()
    let timeframeMs = 30 * 24 * 60 * 60 * 1000 // month in milliseconds

    if (selectedTimeframe === "quarter") {
      timeframeMs = 90 * 24 * 60 * 60 * 1000
    } else if (selectedTimeframe === "year") {
      timeframeMs = 365 * 24 * 60 * 60 * 1000
    }

    return transactions.filter(
      (transaction) => transaction.type === "expense" && now - transaction.timestamp < timeframeMs,
    )
  }

  const filteredTransactions = getFilteredTransactions()

  // Calculate spending by category
  const spendingByCategory = filteredTransactions.reduce(
    (acc, transaction) => {
      const category = transaction.category
      if (!acc[category]) {
        acc[category] = 0
      }
      acc[category] += transaction.amount
      return acc
    },
    {} as Record<string, number>,
  )

  // Sort categories by amount
  const sortedCategories = Object.entries(spendingByCategory).sort((a, b) => b[1] - a[1])

  // Calculate total spending
  const totalSpending = filteredTransactions.reduce((total, transaction) => total + transaction.amount, 0)

  // Get category name for display
  const getCategoryName = (category: string) => {
    switch (category) {
      case "transfer":
        return "Transferencias"
      case "shopping":
        return "Compras"
      case "food":
        return "Alimentación"
      case "housing":
        return "Vivienda"
      case "credit":
        return "Créditos"
      default:
        return "Otros"
    }
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "transfer":
        return "bg-blue-500"
      case "shopping":
        return "bg-purple-500"
      case "food":
        return "bg-yellow-500"
      case "housing":
        return "bg-green-500"
      case "credit":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader className="px-4 sm:px-5 md:px-6 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Análisis de gastos</CardTitle>
          <div className="flex gap-1">
            <Button
              variant={selectedTimeframe === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeframe("month")}
            >
              Mes
            </Button>
            <Button
              variant={selectedTimeframe === "quarter" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeframe("quarter")}
            >
              Trimestre
            </Button>
            <Button
              variant={selectedTimeframe === "year" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeframe("year")}
            >
              Año
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-5 md:px-6">
        {totalSpending === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay datos de gastos para mostrar</p>
          </div>
        ) : (
          <>
            {/* Visual representation */}
            <div className="mb-6">
              <div className="h-4 w-full rounded-full bg-gray-100 overflow-hidden flex">
                {sortedCategories.map(([category, amount]) => (
                  <div
                    key={category}
                    className={`${getCategoryColor(category)}`}
                    style={{ width: `${(amount / totalSpending) * 100}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Category breakdown */}
            <div className="space-y-3">
              {sortedCategories.map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${getCategoryColor(category)}`} />
                    <span className="text-sm text-[#1C3B5A]">{getCategoryName(category)}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#1C3B5A]">{formatCurrency(amount)}</p>
                    <p className="text-xs text-gray-500">{Math.round((amount / totalSpending) * 100)}%</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-[#1C3B5A]">Total de gastos</span>
                <span className="text-sm font-bold text-[#1C3B5A]">{formatCurrency(totalSpending)}</span>
              </div>
            </div>

            {/* Insights */}
            <div className="mt-4 bg-[#f0f5fa] rounded-lg p-3">
              <div className="flex items-start gap-2">
                <TrendingUp size={18} className="text-[#1C3B5A] mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#1C3B5A]">Análisis personalizado</p>
                  <p className="text-xs text-gray-600">
                    {sortedCategories.length > 0
                      ? `Tu mayor gasto es en ${getCategoryName(
                          sortedCategories[0][0],
                        )}. Considera establecer un presupuesto para esta categoría.`
                      : "Comienza a registrar tus gastos para obtener un análisis personalizado."}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="mt-4 flex justify-center">
          <Button variant="outline" size="sm" leftIcon={<BarChart2 size={16} />}>
            Ver análisis detallado
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
