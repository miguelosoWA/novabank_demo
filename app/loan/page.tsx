"use client"

import { useState } from "react"

const loanOpportunities = [
  {
    id: 1,
    amount: 5000,
    term: 12,
    rate: 12.5,
    description: "Préstamo personal rápido"
  },
  {
    id: 2,
    amount: 20000,
    term: 24,
    rate: 10.2,
    description: "Préstamo para auto"
  },
  {
    id: 3,
    amount: 100000,
    term: 48,
    rate: 8.9,
    description: "Préstamo hipotecario"
  }
]

const userLoans = [
  {
    id: 101,
    amount: 8000,
    term: 18,
    rate: 11.0,
    status: "Activo",
    remaining: 12
  },
  {
    id: 102,
    amount: 15000,
    term: 36,
    rate: 9.5,
    status: "Activo",
    remaining: 30
  }
]

// Simulación de recomendaciones de préstamos
const loanRecommendations = [
  {
    id: 201,
    amount: 15000,
    term: 18,
    rate: 11.5,
    reason: "Ideal para consolidar deudas a menor tasa."
  },
  {
    id: 202,
    amount: 30000,
    term: 36,
    rate: 10.0,
    reason: "Perfecto para financiar estudios o proyectos personales."
  }
]

export default function LoanPage() {
  const [selectedLoan, setSelectedLoan] = useState<number | null>(null)

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Oportunidades de Préstamo</h1>
        <div className="space-y-4">
          {loanOpportunities.map(loan => (
            <div
              key={loan.id}
              className={`border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between ${selectedLoan === loan.id ? "border-[#1C3B5A] bg-blue-50" : ""}`}
            >
              <div>
                <div className="font-semibold text-lg">{loan.amount.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</div>
                <div className="text-sm text-gray-600">{loan.description}</div>
                <div className="text-xs text-gray-500">Plazo: {loan.term} meses • Tasa: {loan.rate}% anual</div>
              </div>
              <button
                className={`mt-2 md:mt-0 px-4 py-2 rounded ${selectedLoan === loan.id ? "bg-[#1C3B5A] text-white" : "bg-gray-200 text-[#1C3B5A] hover:bg-[#2C4B6A] hover:text-white"} transition`}
                onClick={() => setSelectedLoan(loan.id)}
              >
                {selectedLoan === loan.id ? "Seleccionado" : "Elegir"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Tus Préstamos Activos</h2>
        {userLoans.length === 0 ? (
          <div className="text-gray-500">No tienes préstamos activos.</div>
        ) : (
          <div className="space-y-4">
            {userLoans.map(loan => (
              <div key={loan.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-semibold text-lg">{loan.amount.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</div>
                  <div className="text-xs text-gray-500">Plazo: {loan.term} meses • Tasa: {loan.rate}% anual</div>
                  <div className="text-xs text-gray-500">Restan: {loan.remaining} meses</div>
                </div>
                <span className="mt-2 md:mt-0 px-3 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">{loan.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Recomendaciones de Préstamo</h2>
        <div className="space-y-4">
          {loanRecommendations.map(rec => (
            <div key={rec.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold text-lg">{rec.amount.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</div>
                <div className="text-xs text-gray-500">Plazo: {rec.term} meses • Tasa: {rec.rate}% anual</div>
                <div className="text-xs text-gray-500">Motivo: {rec.reason}</div>
              </div>
              <span className="mt-2 md:mt-0 px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold">
                Recomendado
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 