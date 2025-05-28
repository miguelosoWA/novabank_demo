"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Shield, Gift, Percent, Mic } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CreditCardApplication() {
  const router = useRouter()
  const [isStarting, setIsStarting] = useState(false)

  const handleStartApplication = () => {
    setIsStarting(true)
    // Redirigir al agente virtual
    router.push("/virtual-agent?context=credit-card-application")
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#1C3B5A] mb-8">Solicita tu Tarjeta de Crédito</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sección principal con botón de inicio */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Inicia tu Solicitud</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12 space-y-6">
              
              <Button 
                onClick={handleStartApplication}
                disabled={isStarting}
                className="w-full max-w-md bg-[#1C3B5A] hover:bg-[#2C4B6A] h-14 text-lg"
              >
                {isStarting ? (
                  "Iniciando..."
                ) : (
                  <>
                    <Mic className="w-5 h-5 mr-2" />
                    Iniciar Solicitud
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Beneficios de la tarjeta */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Beneficios de tu Tarjeta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                <Shield className="w-6 h-6 text-[#DEA742] mt-1" />
                <div>
                  <h3 className="font-semibold">Seguridad Avanzada</h3>
                  <p className="text-sm text-gray-600">Protección contra fraudes y seguro de compras</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Gift className="w-6 h-6 text-[#DEA742] mt-1" />
                <div>
                  <h3 className="font-semibold">Programa de Recompensas</h3>
                  <p className="text-sm text-gray-600">Gana puntos en todas tus compras</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Percent className="w-6 h-6 text-[#DEA742] mt-1" />
                <div>
                  <h3 className="font-semibold">Tasa Preferencial</h3>
                  <p className="text-sm text-gray-600">Tasa de interés competitiva desde el primer día</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <CreditCard className="w-6 h-6 text-[#DEA742] mt-1" />
                <div>
                  <h3 className="font-semibold">Línea de Crédito Flexible</h3>
                  <p className="text-sm text-gray-600">Línea de crédito adaptada a tus necesidades</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requisitos</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                <li>Ser mayor de 18 años</li>
                <li>Ingresos mínimos mensuales de $8,000</li>
                <li>Historial crediticio positivo</li>
                <li>Identificación oficial vigente</li>
                <li>Comprobante de ingresos</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
} 