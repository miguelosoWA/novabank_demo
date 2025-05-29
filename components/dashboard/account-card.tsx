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
      className={`p-3 overflow-hidden rounded-lg shadow-lg h-full flex flex-col ${type === "savings" ? "bg-[#00a29f]" : "bg-[#deb72b]"}`}
    >
      <CardContent className="p-0 flex-grow flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white text-lg font-semibold">{name}</p>
            <p className="text-white font-bold text-xl mt-1">{maskedNumber}</p>
          </div>
          <div
            className={`h-12 w-12 rounded-full flex items-center justify-center ${type === "savings" ? "bg-white/30" : "bg-white/30"}`}
          >
            {type === "savings" ? (
              <DollarSign size={28} className="text-white" />
            ) : (
              <div className="w-7 h-5 rounded bg-white border-2 border-gray-300" />
            )}
          </div>
        </div>

        <div className="mt-auto">
          <p className="text-white text-base">
            {type === "savings" ? "Saldo disponible" : "Saldo Actual"}
          </p>
          <p className="text-white text-xl font-bold mt-1">{formatCurrency(balance)}</p>

          {type === "credit" && limit && (
            <div className="mt-3">
              <div className="flex justify-between text-sm text-white">
                <span>Límite</span>
                <span>Disponible</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-white">
                <span>{formatCurrency(limit)}</span>
                <span>{formatCurrency(limit - balance)}</span>
              </div>
              <div className="mt-2 h-2.5 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white"
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
