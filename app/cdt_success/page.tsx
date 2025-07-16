"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, DollarSign, Calendar, TrendingUp, FileText, Clock } from "lucide-react"
import { useCDTStore } from "@/lib/store/cdt-store"

export default function CDTSuccessPage() {
  const router = useRouter()
  const { 
    firstName, lastName, email, amount, accountNumber, accountType, 
    phoneNumber, cdtTerm, renewalType, resetCDTData 
  } = useCDTStore()

  // Los datos siempre estarán disponibles desde el store

  // Auto-redirect to dashboard after 10 seconds
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     resetCDTData()
  //     router.push('/dashboard')
  //   }, 10000) // 10 seconds

  //   return () => clearTimeout(timer) // Cleanup timer on component unmount
  // }, [resetCDTData, router])

  // Calcular datos del CDT basados en los datos del formulario
  const amountNumber = parseInt(amount) || 0
  const termDays = parseInt(cdtTerm) || 180
  const interestRate = 8.5 // porcentaje anual
  const estimatedReturn = Math.round(amountNumber * (interestRate/100) * (termDays/365))
  
  const cdtData = {
    amount: amountNumber,
    term: termDays,
    interestRate,
    cdtNumber: `CDT-${Math.random().toString().substring(2,8)}`,
    creationDate: new Date().toLocaleDateString('es-CO'),
    maturityDate: new Date(Date.now() + termDays * 24 * 60 * 60 * 1000).toLocaleDateString('es-CO'),
    renewalType,
    estimatedReturn,
    clientName: `${firstName} ${lastName}`,
    email,
    accountNumber,
    accountType,
    phoneNumber
  }

  const handleReturnToDashboard = () => {
    router.push('/dashboard')
    resetCDTData()
  }

  return (
    <div className="px-2 py-2">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-[#15d05f] text-white p-6 rounded-t-2xl shadow-lg mt-5">
          <div className="flex items-center justify-center gap-3">
            <CheckCircle2 className="h-6 w-8" />
            <h1 className="text-xl font-semibold">CDT Aperturado Exitosamente</h1>
          </div>
        </div>

        {/* Mensaje de Confirmación */}
        <Card className="mt-3 border-0 shadow-lg rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'var(--font-clash-display)', color: '#003C1A' }}>
              <CheckCircle2 className="h-5 w-5 text-[#00C96B]" />
              Tu Certificado de Depósito a Término
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-[#00C96B] mt-1" />
                <div>
                  <h3 className="font-semibold" style={{ fontFamily: 'var(--font-roboto)' }}>Número de CDT</h3>
                  <p className="text-gray-600" style={{ fontFamily: 'var(--font-roboto)' }}>{cdtData.cdtNumber}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-[#00C96B] mt-1" />
                <div>
                  <h3 className="font-semibold" style={{ fontFamily: 'var(--font-roboto)' }}>Monto Invertido</h3>
                  <p className="text-gray-600" style={{ fontFamily: 'var(--font-roboto)' }}>${cdtData.amount.toLocaleString('es-CO')} COP</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-[#00C96B] mt-1" />
                <div>
                  <h3 className="font-semibold" style={{ fontFamily: 'var(--font-roboto)' }}>Plazo</h3>
                  <p className="text-gray-600" style={{ fontFamily: 'var(--font-roboto)' }}>{cdtData.term} días</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-[#00C96B] mt-1" />
                <div>
                  <h3 className="font-semibold" style={{ fontFamily: 'var(--font-roboto)' }}>Tasa de Interés</h3>
                  <p className="text-gray-600" style={{ fontFamily: 'var(--font-roboto)' }}>{cdtData.interestRate}% EA</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-[#00C96B] mt-1" />
                <div>
                  <h3 className="font-semibold" style={{ fontFamily: 'var(--font-roboto)' }}>Fecha de Vencimiento</h3>
                  <p className="text-gray-600" style={{ fontFamily: 'var(--font-roboto)' }}>{cdtData.maturityDate}</p>
                </div>
              </div>

              <div className="bg-[#f0f9f4] p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-[#003C1A] mb-2" style={{ fontFamily: 'var(--font-roboto)' }}>Datos del Cliente</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nombre completo:</span>
                    <span className="font-medium">{cdtData.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Correo electrónico:</span>
                    <span className="font-medium">{cdtData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cuenta de débito:</span>
                    <span className="font-medium">{cdtData.accountNumber} ({cdtData.accountType})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo de renovación:</span>
                    <span className="font-medium">{cdtData.renewalType}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#f0f9f4] p-4 rounded-lg">
                <h3 className="font-semibold text-[#003C1A] mb-2" style={{ fontFamily: 'var(--font-roboto)' }}>Resumen de tu Inversión</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capital inicial:</span>
                    <span className="font-medium">${cdtData.amount.toLocaleString('es-CO')} COP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Intereses estimados:</span>
                    <span className="font-medium text-[#00C96B]">${cdtData.estimatedReturn.toLocaleString('es-CO')} COP</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Total al vencimiento:</span>
                    <span className="font-bold text-[#003C1A]">${(cdtData.amount + cdtData.estimatedReturn).toLocaleString('es-CO')} COP</span>
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
          <p>Tu CDT ha sido creado exitosamente. Recibirás un comprobante por correo electrónico.</p>
          <p className="mt-1">Los intereses se abonarán a tu cuenta al vencimiento del plazo.</p>
        </div>
      </div>
    </div>
  )
} 