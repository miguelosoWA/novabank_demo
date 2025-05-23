"use client"

import { useState } from "react"
import { Search, Filter, ArrowDownLeft, ArrowUpRight, ShoppingBag, Coffee, Home, CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface Transaction {
  id: string
  title: string
  description: string
  amount: number
  type: "income" | "expense"
  category: "transfer" | "shopping" | "food" | "housing" | "credit" | "other"
  date: string
  timestamp: number
}

interface TransactionHistoryProps {
  transactions: Transaction[]
  accountName: string
  accountType: "savings" | "checking" | "credit"
}

export function TransactionHistory({ transactions, accountName, accountType }: TransactionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<"all" | "income" | "expense">("all")
  const [selectedTimeframe, setSelectedTimeframe] = useState<"all" | "week" | "month" | "year">("month")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const getCategoryIcon = (category: Transaction["category"]) => {
    switch (category) {
      case "transfer":
        return <ArrowUpRight size={16} />
      case "shopping":
        return <ShoppingBag size={16} />
      case "food":
        return <Coffee size={16} />
      case "housing":
        return <Home size={16} />
      case "credit":
        return <CreditCard size={16} />
      default:
        return <CreditCard size={16} />
    }
  }

  // Filter transactions based on search term, type filter, and timeframe
  const filteredTransactions = transactions.filter((transaction) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase())

    // Type filter
    const matchesType = selectedFilter === "all" || transaction.type === selectedFilter

    // Timeframe filter
    let matchesTimeframe = true
    const now = Date.now()
    if (selectedTimeframe === "week") {
      matchesTimeframe = now - transaction.timestamp < 7 * 24 * 60 * 60 * 1000
    } else if (selectedTimeframe === "month") {
      matchesTimeframe = now - transaction.timestamp < 30 * 24 * 60 * 60 * 1000
    } else if (selectedTimeframe === "year") {
      matchesTimeframe = now - transaction.timestamp < 365 * 24 * 60 * 60 * 1000
    }

    return matchesSearch && matchesType && matchesTimeframe
  })

  // Calculate totals
  const totals = filteredTransactions.reduce(
    (acc, transaction) => {
      if (transaction.type === "income") {
        acc.income += transaction.amount
      } else {
        acc.expense += transaction.amount
      }
      return acc
    },
    { income: 0, expense: 0 },
  )

  return (
    <Card>
      <CardHeader className="px-4 sm:px-5 md:px-6 pb-4">
        <CardTitle className="text-lg">Movimientos de {accountName}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-5 md:px-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar transacciones..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" leftIcon={<Filter size={16} />}>
                  Filtrar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Tipo</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setSelectedFilter("all")}>Todos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("income")}>Ingresos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("expense")}>Gastos</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Periodo</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setSelectedTimeframe("week")}>Última semana</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedTimeframe("month")}>Último mes</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedTimeframe("year")}>Último año</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedTimeframe("all")}>Todo</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-green-50 border-0">
            <CardContent className="p-4">
              <p className="text-sm text-green-700">Ingresos</p>
              <p className="text-lg font-semibold text-green-700">{formatCurrency(totals.income)}</p>
            </CardContent>
          </Card>
          <Card className="bg-red-50 border-0">
            <CardContent className="p-4">
              <p className="text-sm text-red-700">Gastos</p>
              <p className="text-lg font-semibold text-red-700">{formatCurrency(totals.expense)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions list */}
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No se encontraron transacciones</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between border-b pb-4 mb-4 last:border-0 last:mb-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      transaction.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowDownLeft size={16} />
                    ) : (
                      getCategoryIcon(transaction.category)
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-[#1C3B5A]">{transaction.title}</p>
                    <p className="text-xs text-gray-500">{transaction.description}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`text-sm font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                  >
                    {transaction.type === "income" ? "+" : "-"} {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-xs text-gray-500">{transaction.date}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
