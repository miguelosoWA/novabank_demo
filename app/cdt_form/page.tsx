"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { X, TrendingUp, Calendar, DollarSign, PiggyBank, HelpCircle, RefreshCw, User, Mail, Lock, Phone, MapPin, Building, Hash, Clock } from "lucide-react"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/dashboard/navbar"
import { useCDTStore } from "@/lib/store/cdt-store"

export default function CDTPage() {
  const router = useRouter()
  const { 
    firstName, lastName, email, amount, accountNumber, accountType, 
    phoneNumber, cdtTerm, renewalType, identificationType, setCDTData 
  } = useCDTStore()

  // Helper function to format the amount for display
  const formatAmountForDisplay = (numericString: string) => {
    if (!numericString) return "";
    const number = parseInt(numericString, 10);
    if (isNaN(number)) {
      return "";
    }
    return new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  // Handler for amount input change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    setCDTData({
      firstName, lastName, email, amount: numericValue, accountNumber, 
      accountType, phoneNumber, cdtTerm, renewalType, identificationType
    });
  };

  // Handler for updating any field
  const updateField = (field: string, value: string) => {
    setCDTData({
      firstName, lastName, email, amount, accountNumber, 
      accountType, phoneNumber, cdtTerm, renewalType, identificationType,
      [field]: value
    });
  };

  return (
    <div className="space-y-6 px-0 md:px-6 lg:px-8 pb-16 md:pb-20 max-w-screen-xl mx-auto bg-[#c9e6d4]">
      
      <div className="bg-[#2D7A4A] text-white py-6 px-6 shadow-m">
        <h1 className="text-xl text-center">Formulario de Apertura de Certificado de Depósito a Término (CDT)</h1>
      </div>

      <div className="space-y-6 bg-transparent p-0 md:p-8 rounded-lg" style={{ marginRight: "24px", marginLeft: "24px" }}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-[#074f2a]-700 mb-1">Nombres</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#074f2a]-400" />
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DEA742] focus:border-[#DEA742]"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-[#074f2a]-700 mb-1">Apellidos</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#074f2a]-400" />
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DEA742] focus:border-[#DEA742]"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-[#074f2a]-700 mb-1">Monto del CDT</label>
          <div className="relative">
            <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#074f2a]-400" />
            <input
              id="amount"
              type="text"
              value={amount ? formatAmountForDisplay(amount) : ""}
              onChange={handleAmountChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DEA742] focus:border-[#DEA742]"
              placeholder="0"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="cdtTerm" className="block text-sm font-medium text-[#074f2a]-700 mb-1">Plazo del CDT (días)</label>
            <div className="relative">
              <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#074f2a]-400" />
              <select
                id="cdtTerm"
                value={cdtTerm}
                onChange={(e) => updateField('cdtTerm', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DEA742] focus:border-[#DEA742]"
                required
              >
                <option value="90">90 días</option>
                <option value="180">180 días</option>
                <option value="360">360 días</option>
                <option value="540">540 días</option>
                <option value="720">720 días</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="renewalType" className="block text-sm font-medium text-[#074f2a]-700 mb-1">Tipo de Renovación</label>
            <div className="relative">
              <RefreshCw size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#074f2a]-400" />
              <select
                id="renewalType"
                value={renewalType}
                onChange={(e) => updateField('renewalType', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DEA742] focus:border-[#DEA742]"
                required
              >
                <option value="Capital + Intereses">Capital + Intereses</option>
                <option value="Solo Capital">Solo Capital</option>
                <option value="Solo Intereses">Solo Intereses</option>
                <option value="No Renovar">No Renovar</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-[#074f2a]-700 mb-1">No. de Cuenta de Débito</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#074f2a]-400" />
              <input
                id="accountNumber"
                type="text"
                value={accountNumber}
                onChange={(e) => updateField('accountNumber', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DEA742] focus:border-[#DEA742]"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="accountType" className="block text-sm font-medium text-[#074f2a]-700 mb-1">Tipo de Cuenta</label>
            <div className="relative">
              <Building size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#074f2a]-400" />
              <select
                id="accountType"
                value={accountType}
                onChange={(e) => updateField('accountType', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DEA742] focus:border-[#DEA742]"
                required
              >
                <option value="Ahorros">Ahorros</option>
                <option value="Corriente">Corriente</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#074f2a]-700 mb-1">Correo Electrónico</label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#074f2a]-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => updateField('email', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DEA742] focus:border-[#DEA742]"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-[#074f2a]-700 mb-1">Número de Teléfono</label>
          <div className="relative">
            <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#074f2a]-400" />
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => updateField('phoneNumber', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DEA742] focus:border-[#DEA742]"
              required
            />
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-[#f0f9f4] rounded-lg">
          <p className="text-sm text-[#003C1A] text-center">
            Los datos se guardan automáticamente cuando realizas cambios.
          </p>
        </div>
      </div>
    </div>
  )
}
