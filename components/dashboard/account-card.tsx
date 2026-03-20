import { CreditCard, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface AccountCardProps {
  type: "savings" | "credit"
  name: string
  number: string
  balance: number
  currency?: string
  limit?: number
}

export function AccountCard({ type, name, number, balance, currency = "USD", limit }: AccountCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: currency === "USD" ? 0 : 0,
    }).format(amount)
  }

  const maskedNumber = number

  return (
    <Card
      className={`bi-feature-radius flex h-full flex-col overflow-hidden border-0 p-4 shadow-[0_4px_16px_rgba(0,56,101,0.12)] ${
        type === "savings"
          ? "bg-[linear-gradient(135deg,#003865_0%,#2D8C9E_100%)]"
          : "bg-[linear-gradient(135deg,#F5A623_0%,#ffcf66_100%)]"
      }`}
    >
      <CardContent className="p-0 flex-grow flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <p className={`text-sm font-medium ${type === "savings" ? "text-white/80" : "text-primary/75"}`}>{name}</p>
            <p className={`mt-1 text-2xl font-semibold ${type === "savings" ? "text-white" : "text-primary"}`}>{maskedNumber}</p>
          </div>
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              type === "savings" ? "bg-white/20" : "bg-primary/10"
            }`}
          >
            {type === "savings" ? (
              <DollarSign size={28} className="text-white" />
            ) : (
              <CreditCard size={24} className="text-primary" />
            )}
          </div>
        </div>

        <div className="mt-auto">
          <p className={`text-sm ${type === "savings" ? "text-white/80" : "text-primary/75"}`}>
            {type === "savings" ? "Saldo disponible" : "Saldo Actual"}
          </p>
          <p className={`mt-1 text-2xl font-bold ${type === "savings" ? "text-white" : "text-primary"}`}>{formatCurrency(balance)}</p>

          {type === "credit" && limit && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-primary/75">
                <span>Límite</span>
                <span>Disponible</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-primary">
                <span>{formatCurrency(limit)}</span>
                <span>{formatCurrency(limit - balance)}</span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-primary/10">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(balance / limit) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
