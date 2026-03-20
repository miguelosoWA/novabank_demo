import { ArrowDownLeft, ArrowUpRight } from "lucide-react"

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
    <div className="bi-card bi-feature-radius p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold text-primary">Movimientos recientes</h2>
        <span className="rounded-full bg-[#e5f9fb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#2D8C9E]">
          Últimos 30 días
        </span>
      </div>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between border-b border-[#e5eef1] pb-4 last:border-b-0">
            <div className="flex items-center gap-4">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  transaction.type === "income" ? "bg-[#e5f9fb]" : "bg-[#fff3df]"
                }`}
              >
                {transaction.type === "income" ? (
                  <ArrowDownLeft size={18} className="text-accent-dark" />
                ) : (
                  <ArrowUpRight size={18} className="text-secondary" />
                )}
              </div>

              <div>
                <p className="text-base font-medium text-primary">{transaction.title}</p>
                <p className="text-sm text-[#4F5151]">{transaction.description}</p>
              </div>
            </div>

            <div className="text-right">
              <p
                className={`text-base font-semibold ${transaction.type === "income" ? "text-[#1EC771]" : "text-[#F13852]"}`}
              >
                {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
              </p>
              <p className="text-sm text-[#4F5151]">{transaction.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
