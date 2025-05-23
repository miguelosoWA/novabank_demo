"use client"

import type React from "react"

import { useState } from "react"
import { X, TrendingUp, Calendar, DollarSign, PiggyBank } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InvestmentModalProps {
  isOpen: boolean
  onClose: () => void
}

export function InvestmentModal({ isOpen, onClose }: InvestmentModalProps) {
  const [amount, setAmount] = useState("10000")
  const [term, setTerm] = useState("12")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulación de envío
    setTimeout(() => {
      setIsSubmitting(false)
      onClose()
    }, 1500)
  }

  if (!isOpen) return null

  const calculateReturn = () => {
    const principal = Number.parseFloat(amount) || 0
    const months = Number.parseInt(term) || 0
    const annualRate = 0.12 // 12% anual
    const monthlyRate = annualRate / 12

    const futureValue = principal * Math.pow(1 + monthlyRate, months)
    const interest = futureValue - principal

    return {
      futureValue: futureValue.toFixed(2),
      interest: interest.toFixed(2),
      monthlyRate: (annualRate * 100).toFixed(2),
    }
  }

  const { futureValue, interest, monthlyRate } = calculateReturn()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#f0f5fa] flex items-center justify-center">
              <TrendingUp size={18} className="text-[#1C3B5A]" />
            </div>
            <h2 className="text-lg font-semibold text-[#1C3B5A]">Depósito a Plazo Personalizado</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>

        <div className="p-4">
          <div className="bg-[#f0f5fa] rounded-lg p-4 mb-4">
            <p className="text-sm text-[#1C3B5A]">
              <strong>Carlos</strong>, hemos creado esta oferta especialmente para ti basada en tu perfil financiero.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1C3B5A] mb-1">Monto a invertir</label>
              <div className="relative">
                <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DEA742]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1C3B5A] mb-1">Plazo (meses)</label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={term}
                  onChange={(e) => setTerm(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DEA742]"
                />
              </div>
            </div>

            <div className="bg-[#f0f5fa] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Tasa anual:</span>
                <span className="text-sm font-medium text-[#1C3B5A]">{monthlyRate}%</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Interés estimado:</span>
                <span className="text-sm font-medium text-[#1C3B5A]">
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  }).format(Number.parseFloat(interest))}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Monto al vencimiento:</span>
                <span className="text-sm font-medium text-[#1C3B5A]">
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  }).format(Number.parseFloat(futureValue))}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" fullWidth isLoading={isSubmitting} leftIcon={<PiggyBank size={18} />}>
                Invertir ahora
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
