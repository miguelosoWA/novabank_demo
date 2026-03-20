"use client"

import { useRouter } from "next/navigation"
import { X, TrendingUp, Calendar, DollarSign, PiggyBank, HelpCircle, RefreshCw, User, Mail, Lock, Phone, MapPin, Building, Hash } from "lucide-react"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/dashboard/navbar"
import { useFICStore } from "@/lib/store/fic-store"

export default function FICFormPage() {
  const router = useRouter()
  const { 
    firstName, lastName, email, amount, accountNumber, accountType,
    phoneNumber, address, city, state, setFICData 
  } = useFICStore()

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

  // Update store function
  const updateStoreField = (field: string, value: string) => {
    setFICData({
      firstName,
      lastName,
      email,
      amount,
      accountNumber,
      accountType,
      phoneNumber,
      address,
      city,
      state,
      [field]: value
    });
  };

  // Handler for amount input change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    updateStoreField('amount', numericValue);
  };

  return (
    <div className="space-y-6 px-0 md:px-6 lg:px-8 pb-16 md:pb-20 max-w-screen-xl mx-auto bg-background">
      <div className="bg-primary text-white py-6 px-6 shadow-[0_4px_16px_rgba(0,56,101,0.12)]">
        <h1 className="text-2xl text-center font-display">Formulario de Vinculación a Fondo de Inversión Colectiva.</h1>
      </div>

      <div className="space-y-6 bg-transparent p-0 md:p-8 rounded-lg" style={{ marginRight: "24px", marginLeft: "24px" }}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-primary mb-1">Nombres</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => updateStoreField('firstName', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B2ECF2] focus:border-accent"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-primary mb-1">Apellidos</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => updateStoreField('lastName', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B2ECF2] focus:border-accent"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-primary mb-1">Monto a Invertir</label>
          <div className="relative">
            <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="amount"
              type="text"
              value={amount ? formatAmountForDisplay(amount) : ""}
              onChange={handleAmountChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B2ECF2] focus:border-accent"
              placeholder="0"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-primary mb-1">No. de Cuenta</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="accountNumber"
                type="text"
                value={accountNumber}
                onChange={(e) => updateStoreField('accountNumber', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B2ECF2] focus:border-accent"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="accountType" className="block text-sm font-medium text-primary mb-1">Tipo de Cuenta</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="accountType"
                type="text"
                value={accountType}
                onChange={(e) => updateStoreField('accountType', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B2ECF2] focus:border-accent"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-primary mb-1">Correo Electrónico</label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => updateStoreField('email', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B2ECF2] focus:border-accent"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-primary mb-1">Dirección</label>
          <div className="relative">
            <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => updateStoreField('address', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B2ECF2] focus:border-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-primary mb-1">Ciudad</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => updateStoreField('city', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B2ECF2] focus:border-accent"
              />
            </div>
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-primary mb-1">Departamento/Provincia</label>
            <div className="relative">
              <Building size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="state"
                type="text"
                value={state}
                onChange={(e) => updateStoreField('state', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B2ECF2] focus:border-accent"
              />
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-primary mb-1">Número de Teléfono</label>
          <div className="relative">
            <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => updateStoreField('phoneNumber', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B2ECF2] focus:border-accent"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
