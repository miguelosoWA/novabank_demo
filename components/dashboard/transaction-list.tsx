import { ArrowDownLeft, ArrowUpRight, ShoppingBag, Coffee, Home, CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Transaction {
  id: string
  title: string
  description: string
  amount: number
  type: "income" | "expense"
  category: "transfer" | "shopping" | "food" | "housing" | "credit"
  date: string
}

interface TransactionListProps {
  transactions: Transaction[]
}

export function TransactionList({ transactions }: TransactionListProps) {
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
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Movimientos recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    transaction.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}
                >
                  {transaction.type === "income" ? <ArrowDownLeft size={16} /> : getCategoryIcon(transaction.category)}
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
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
