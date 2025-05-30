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
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-[#103B3C] mb-6 text-left">Movimientos recientes</h2>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between pb-2 border-b border-gray-200 last:border-b-0">
            <div className="flex items-center gap-4">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  transaction.type === "income" ? "bg-green-200" : "bg-pink-200"
                }`}
              >
                {/* Icons are not present in the image for transactions, so this part is removed or can be customized if needed */}
              </div>

              <div>
                <p className="text-base font-medium text-[#1C3B5A]">{transaction.title}</p>
                <p className="text-sm text-gray-500">{transaction.description}</p>
              </div>
            </div>

            <div className="text-right">
              <p
                className={`text-base font-semibold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
              >
                {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
              </p>
              <p className="text-sm text-gray-500">{transaction.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
