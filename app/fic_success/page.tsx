"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, DollarSign, TrendingUp, FileText, PieChart, Target, Users, BarChart3 } from "lucide-react"
import { useFICStore } from "@/lib/store/fic-store"

export default function FICSuccessPage() {
  const router = useRouter()
  const { 
    firstName, lastName, email, amount, accountNumber, accountType, 
    phoneNumber, address, city, state, resetFICData 
  } = useFICStore()

  // Los datos siempre estarán disponibles desde el store

  // Calcular datos del FIC basados en los datos del formulario
  const amountNumber = parseInt(amount) || 0
  const unitValue = 12567 // Valor por unidad del fondo
  const unitsAcquired = Math.floor(amountNumber / unitValue)
  const expectedReturn = 12.5 // porcentaje anual esperado
  const fondType = "Renta Variable"
  
  const ficData = {
    amount: amountNumber,
    unitValue,
    unitsAcquired,
    expectedReturn,
    ficNumber: `FIC-${Math.random().toString().substring(2,8)}`,
    investmentDate: new Date().toLocaleDateString('es-CO'),
    fondType,
    clientName: `${firstName} ${lastName}`,
    email,
    accountNumber,
    accountType,
    phoneNumber,
    address,
    city,
    state
  }

  const handleReturnToDashboard = () => {
    router.push('/dashboard')
    resetFICData()
  }

  return (
    <div className="px-2 py-2">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-[#15d05f] text-white p-6 rounded-t-2xl shadow-lg mt-5">
          <div className="flex items-center justify-center gap-3">
            <CheckCircle2 className="h-6 w-8" />
            <h1 className="text-xl font-semibold">Inversión en FIC Realizada Exitosamente</h1>
          </div>
        </div>

        {/* Mensaje de Confirmación */}
        <Card className="mt-3 border-0 shadow-lg rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'var(--font-clash-display)', color: '#003C1A' }}>
              <CheckCircle2 className="h-5 w-5 text-[#00C96B]" />
              Tu Inversión en Fondo de Inversión Colectiva
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-[#00C96B] mt-1" />
                <div>
                  <h3 className="font-semibold" style={{ fontFamily: 'var(--font-roboto)' }}>Número de Inversión</h3>
                  <p className="text-gray-600" style={{ fontFamily: 'var(--font-roboto)' }}>{ficData.ficNumber}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-[#00C96B] mt-1" />
                <div>
                  <h3 className="font-semibold" style={{ fontFamily: 'var(--font-roboto)' }}>Monto Invertido</h3>
                  <p className="text-gray-600" style={{ fontFamily: 'var(--font-roboto)' }}>${ficData.amount.toLocaleString('es-CO')} COP</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <BarChart3 className="h-5 w-5 text-[#00C96B] mt-1" />
                <div>
                  <h3 className="font-semibold" style={{ fontFamily: 'var(--font-roboto)' }}>Unidades Adquiridas</h3>
                  <p className="text-gray-600" style={{ fontFamily: 'var(--font-roboto)' }}>{ficData.unitsAcquired.toLocaleString('es-CO')} unidades</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-[#00C96B] mt-1" />
                <div>
                  <h3 className="font-semibold" style={{ fontFamily: 'var(--font-roboto)' }}>Valor por Unidad</h3>
                  <p className="text-gray-600" style={{ fontFamily: 'var(--font-roboto)' }}>${ficData.unitValue.toLocaleString('es-CO')} COP</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-[#00C96B] mt-1" />
                <div>
                  <h3 className="font-semibold" style={{ fontFamily: 'var(--font-roboto)' }}>Rentabilidad Esperada</h3>
                  <p className="text-gray-600" style={{ fontFamily: 'var(--font-roboto)' }}>{ficData.expectedReturn}% anual promedio</p>
                </div>
              </div>

              <div className="bg-[#f0f9f4] p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-[#003C1A] mb-2" style={{ fontFamily: 'var(--font-roboto)' }}>Datos del Inversionista</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nombre completo:</span>
                    <span className="font-medium">{ficData.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Correo electrónico:</span>
                    <span className="font-medium">{ficData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cuenta de débito:</span>
                    <span className="font-medium">{ficData.accountNumber} ({ficData.accountType})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dirección:</span>
                    <span className="font-medium">{ficData.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ciudad:</span>
                    <span className="font-medium">{ficData.city}, {ficData.state}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#f0f9f4] p-4 rounded-lg">
                <h3 className="font-semibold text-[#003C1A] mb-2" style={{ fontFamily: 'var(--font-roboto)' }}>Resumen de tu Inversión</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capital invertido:</span>
                    <span className="font-medium">${ficData.amount.toLocaleString('es-CO')} COP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Unidades adquiridas:</span>
                    <span className="font-medium text-[#00C96B]">{ficData.unitsAcquired.toLocaleString('es-CO')} unidades</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valor por unidad:</span>
                    <span className="font-medium">${ficData.unitValue.toLocaleString('es-CO')} COP</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Fecha de inversión:</span>
                    <span className="font-bold text-[#003C1A]">{ficData.investmentDate}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  onClick={handleReturnToDashboard}
                  className="w-full bg-[#00C96B] hover:bg-[#00A55A] text-white"
                >
                  Regresar al Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mensaje de Información */}
        <div className="mt-6 text-center text-sm text-gray-500" style={{ fontFamily: 'var(--font-roboto)' }}>
          <p>Tu inversión en el FIC ha sido procesada exitosamente. Recibirás un comprobante por correo electrónico.</p>
          <p className="mt-1">Podrás consultar el estado de tu inversión en el dashboard o en tu estado de cuenta mensual.</p>
          <p className="mt-1 text-xs">Las rentabilidades pasadas no garantizan rentabilidades futuras. Tu inversión puede subir o bajar de valor.</p>
        </div>
      </div>
    </div>
  )
} 