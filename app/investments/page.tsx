"use client"

import { useState } from "react"

const investmentOpportunities = [
  {
    id: 1,
    name: "CDT a 6 meses",
    rate: 9.2,
    minAmount: 1000000,
    description: "Certificado de Depósito a Término fijo, plazo 6 meses."
  },
  {
    id: 2,
    name: "Fondo de inversión moderado",
    rate: 12.5,
    minAmount: 500000,
    description: "Fondo diversificado, riesgo medio, liquidez mensual."
  },
  {
    id: 3,
    name: "Acciones Colombia",
    rate: 18.0,
    minAmount: 200000,
    description: "Portafolio de acciones de empresas colombianas."
  }
]

const userInvestments = [
  {
    id: 201,
    name: "CDT a 6 meses",
    amount: 2000000,
    rate: 9.2,
    status: "Activo",
    monthsLeft: 4
  },
  {
    id: 202,
    name: "Fondo de inversión moderado",
    amount: 1000000,
    rate: 12.5,
    status: "Activo",
    monthsLeft: 10
  }
]

// Simulación de acciones invertidas por el usuario
const userStocks = [
  {
    symbol: "ECOPETROL",
    name: "Ecopetrol S.A.",
    shares: 50,
    currentPrice: 2600,
    invested: 120000,
    change: 0.12 // 12% de ganancia
  },
  {
    symbol: "BVC",
    name: "Bolsa de Valores de Colombia",
    shares: 30,
    currentPrice: 900,
    invested: 30000,
    change: -0.08 // -8% de pérdida
  }
]

// Simulación de recomendaciones de acciones
const stockRecommendations = [
  {
    symbol: "PFBCOLOM",
    name: "Bancolombia Preferencial",
    reason: "Buen desempeño trimestral y dividendo atractivo.",
    currentPrice: 35000,
    expectedGrowth: 0.10 // 10% esperado
  },
  {
    symbol: "ISA",
    name: "Interconexión Eléctrica S.A.",
    reason: "Crecimiento estable y sector estratégico.",
    currentPrice: 18000,
    expectedGrowth: 0.07 // 7% esperado
  }
]

export default function InvestmentsPage() {
  const [selectedInvestment, setSelectedInvestment] = useState<number | null>(null)

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Oportunidades de Inversión</h1>
        <div className="space-y-4">
          {investmentOpportunities.map(inv => (
            <div
              key={inv.id}
              className={`border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between ${selectedInvestment === inv.id ? "border-[#1C3B5A] bg-blue-50" : ""}`}
            >
              <div>
                <div className="font-semibold text-lg">{inv.name}</div>
                <div className="text-sm text-gray-600">{inv.description}</div>
                <div className="text-xs text-gray-500">Tasa: {inv.rate}% anual • Mínimo: {inv.minAmount.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</div>
              </div>
              <button
                className={`mt-2 md:mt-0 px-4 py-2 rounded ${selectedInvestment === inv.id ? "bg-[#1C3B5A] text-white" : "bg-gray-200 text-[#1C3B5A] hover:bg-[#2C4B6A] hover:text-white"} transition`}
                onClick={() => setSelectedInvestment(inv.id)}
              >
                {selectedInvestment === inv.id ? "Seleccionado" : "Invertir"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Tus Inversiones Activas</h2>
        {userInvestments.length === 0 ? (
          <div className="text-gray-500">No tienes inversiones activas.</div>
        ) : (
          <div className="space-y-4">
            {userInvestments.map(inv => (
              <div key={inv.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-semibold text-lg">{inv.name}</div>
                  <div className="text-xs text-gray-500">Monto: {inv.amount.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</div>
                  <div className="text-xs text-gray-500">Tasa: {inv.rate}% anual</div>
                  <div className="text-xs text-gray-500">Restan: {inv.monthsLeft} meses</div>
                </div>
                <span className="mt-2 md:mt-0 px-3 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">{inv.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Tus Acciones</h2>
        {userStocks.length === 0 ? (
          <div className="text-gray-500">No tienes acciones en tu portafolio.</div>
        ) : (
          <div className="space-y-4">
            {userStocks.map(stock => (
              <div key={stock.symbol} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-semibold text-lg">{stock.name} ({stock.symbol})</div>
                  <div className="text-xs text-gray-500">Acciones: {stock.shares}</div>
                  <div className="text-xs text-gray-500">Valor actual: {stock.currentPrice.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</div>
                  <div className="text-xs text-gray-500">Invertido: {stock.invested.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</div>
                </div>
                <span className={`mt-2 md:mt-0 px-3 py-1 rounded text-xs font-semibold ${stock.change >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {stock.change >= 0 ? "+" : ""}{(stock.change * 100).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recomendaciones de acciones */}
      <div>
        <h2 className="text-xl font-bold mb-4">Recomendaciones de Acciones</h2>
        <div className="space-y-4">
          {stockRecommendations.map(rec => (
            <div key={rec.symbol} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold text-lg">{rec.name} ({rec.symbol})</div>
                <div className="text-xs text-gray-500">Precio actual: {rec.currentPrice.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</div>
                <div className="text-xs text-gray-500">Motivo: {rec.reason}</div>
              </div>
              <span className="mt-2 md:mt-0 px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold">
                Potencial: +{(rec.expectedGrowth * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
