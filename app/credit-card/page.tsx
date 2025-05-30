"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Shield, Gift, Clock, CheckCircle2 } from "lucide-react"

interface UserCreditCard {
  id: string
  name: string
  number: string
  limit: number
  available: number
  dueDate: string
  status: 'active' | 'pending'
}

const userCards: UserCreditCard[] = [
  {
    id: "1",
    name: "Tarjeta Clásica",
    number: "**** **** **** 1234",
    limit: 5000000,
    available: 3500000,
    dueDate: "15/03/2024",
    status: 'active'
  },
  {
    id: "2",
    name: "Tarjeta Gold",
    number: "**** **** **** 5678",
    limit: 10000000,
    available: 7500000,
    dueDate: "20/03/2024",
    status: 'active'
  }
]

// Función para obtener el color de fondo según el nombre de la tarjeta
function getCardBgColor(name: string) {
  if (name.toLowerCase().includes('gold')) return 'bg-[#DEA742] text-white';
  if (name.toLowerCase().includes('clásica')) return 'bg-[#1C3B5A] text-white';
  if (name.toLowerCase().includes('platinum')) return 'bg-[#4B5563] text-white';
  return 'bg-white';
}

export default function CreditCardPage() {
  return (
    <div className="px-6 py-0" >
      <div className="max-w-4xl mx-auto">
  

        {/* Beneficios */}
        <Card className="mt-6 border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Gift className="h-5 w-5 text-green-600" />
              Beneficios de tu Tarjeta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold">Cashback en Compras</h3>
                  <p className="text-sm text-gray-600">Obtén hasta 2% de devolución en todas tus compras</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold">Seguros de Protección</h3>
                  <p className="text-sm text-gray-600">Seguro de compras y protección de viajes incluidos</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold">Programa de Recompensas</h3>
                  <p className="text-sm text-gray-600">Acumula puntos en cada compra y canjéalos por beneficios</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requisitos */}
        <Card className="mt-6 border-0 shadow-lg bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-yellow-600" />
              Requisitos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-yellow-500 mt-1" />
                <div>
                  <h3 className="font-semibold">Edad Mínima</h3>
                  <p className="text-sm text-gray-600">Mayor de 18 años</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-yellow-500 mt-1" />
                <div>
                  <h3 className="font-semibold">Ingresos Mínimos</h3>
                  <p className="text-sm text-gray-600">Ingresos mensuales superiores a 2 SMMLV</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-yellow-500 mt-1" />
                <div>
                  <h3 className="font-semibold">Historial Crediticio</h3>
                  <p className="text-sm text-gray-600">Sin reportes negativos en centrales de riesgo</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tarjetas del Usuario */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            Mis Tarjetas
          </h2>
          <div className="space-y-4">
            {userCards.map((card) => (
              <Card key={card.id} className={`border-0 shadow-lg rounded-2xl ${getCardBgColor(card.name)}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between" style={{ fontFamily: 'var(--font-roboto)' }}>
                    <span>{card.name}</span>
                    <span className="text-sm font-normal text-gray-200">{card.number}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-200">Línea de Crédito</span>
                      <span className="font-semibold">${card.limit.toLocaleString('es-CO')} COP</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-200">Disponible</span>
                      <span className="font-semibold text-green-200">${card.available.toLocaleString('es-CO')} COP</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-200">Fecha de Corte</span>
                      <span className="font-semibold">{card.dueDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 