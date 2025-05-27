"use client"

import { useState } from "react"
import { Banknote, Send, User, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BackButton } from "@/components/navigation/back-button"

const accounts = [
  { id: 1, name: "Cuenta Corriente", number: "1234 5678 9012 3456", balance: 18500.75, currency: "MXN" },
  { id: 2, name: "Cuenta de Ahorro", number: "9876 5432 1098 7654", balance: 32000.0, currency: "MXN" },
]

export default function TransfersPage() {
  const [fromAccount, setFromAccount] = useState(accounts[0].id)
  const [toAccount, setToAccount] = useState("")
  const [amount, setAmount] = useState("")
  const [concept, setConcept] = useState("")
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!toAccount || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Por favor, ingresa una cuenta destino y un monto válido.")
      return
    }
    setSuccess(true)
  }

  return (
    <div className="space-y-8 px-4 md:px-6 lg:px-8 pb-16 md:pb-20 max-w-screen-md mx-auto">
      {/* Botón regresar */}
      <div className="pt-6">
        <BackButton label="Regresar al inicio" destination="/dashboard" />
      </div>

      {/* Header visual */}
      <div className="flex flex-col items-center text-center gap-2">
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full p-4 mb-2 shadow-lg">
          <Send className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1C3B5A]">Transferencias</h1>
        <p className="text-gray-600 max-w-md">Envía dinero de forma rápida y segura a cualquier cuenta.</p>
      </div>

      {/* Formulario de transferencia */}
      {!success ? (
        <form onSubmit={handleTransfer} className="bg-white rounded-2xl shadow-md p-6 space-y-6 max-w-lg mx-auto">
          <div>
            <label className="block text-sm font-medium text-[#1C3B5A] mb-1">Cuenta de origen</label>
            <select
              className="w-full border rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={fromAccount}
              onChange={e => setFromAccount(Number(e.target.value))}
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.number.slice(-4)}) - {acc.balance.toLocaleString("es-MX", { style: "currency", currency: acc.currency })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1C3B5A] mb-1">Cuenta destino</label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Número de cuenta o CLABE"
                value={toAccount}
                onChange={e => setToAccount(e.target.value)}
                className="pl-10"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1C3B5A] mb-1">Monto</label>
            <div className="relative">
              <Input
                type="number"
                min="1"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="pl-10"
              />
              <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1C3B5A] mb-1">Concepto (opcional)</label>
            <Input
              type="text"
              placeholder="Ej. Renta, regalo, pago..."
              value={concept}
              onChange={e => setConcept(e.target.value)}
            />
          </div>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <Button
            type="submit"
            size="lg"
            className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-all mt-2"
          >
            Transferir
          </Button>
        </form>
      ) : (
        <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center gap-4 max-w-lg mx-auto">
          <div className="bg-green-100 rounded-full p-4 mb-2">
            <Send className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-700 mb-2">¡Transferencia exitosa!</h2>
          <p className="text-gray-700">Tu dinero ha sido enviado correctamente.</p>
          <Button onClick={() => { setSuccess(false); setToAccount(""); setAmount(""); setConcept(""); }} className="mt-4">Realizar otra transferencia</Button>
        </div>
      )}
    </div>
  )
}
