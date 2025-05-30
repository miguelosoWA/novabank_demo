"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
// Remove InvestmentSimulator import as it's no longer used
// import { InvestmentSimulator } from "@/components/dashboard/investment-simulator"
import { X, TrendingUp, Calendar, DollarSign, PiggyBank, HelpCircle, RefreshCw, User, Mail, Lock, Phone, MapPin, Building, Hash } from "lucide-react" // Added new icons
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
// Navbar import might be kept or removed depending on final page structure, keeping for now
import { Navbar } from "@/components/dashboard/navbar"

export default function InvestmentsPage() {
  const router = useRouter()
  // const userName = "Carlos" // Kept for potential use in the personalized message

  // Updated state for the new form fields
  const [firstName, setFirstName] = useState("Carlos Alberto ")
  const [lastName, setLastName] = useState("Valderrama Palacio")
  const [email, setEmail] = useState("carlos@sofka.com.co")
  const [amount, setAmount] = useState("25630000")
  const [password, setPassword] = useState("194839203")
  const [confirmPassword, setConfirmPassword] = useState("Ahorros") // Or derive from image context if needed
  const [phoneNumber, setPhoneNumber] = useState("312 541 8596") // Or derive from image context if needed

  // Assuming the bottom three fields are City, State, Zip based on common form structures
  const [city, setCity] = useState("Envigado")
  const [state, setState] = useState("Antioquia")
  const [address, setAddress] = useState("Cr 41 No. 40BS-09")

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Handle form submission logic here
    console.log({
      firstName,
      lastName,
      email,
      amount,
      password,
      confirmPassword,
      phoneNumber,
      city,
      state,
      address,
    })
    setTimeout(() => setIsSubmitting(false), 2000) // Simulate API call
  }

  // Helper function to format the amount for display
  const formatAmountForDisplay = (numericString: string) => {
    if (!numericString) return "";
    const number = parseInt(numericString, 10);
    if (isNaN(number)) {
      return ""; // Or return numericString if you prefer to show the raw input on error
    }
    return new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  // Handler for amount input change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, ''); // Remove non-digits
    setAmount(numericValue);
  };

  return (
    <div className="space-y-6 px-0 md:px-6 lg:px-8 pb-16 md:pb-20 max-w-screen-xl mx-auto bg-[#c9e6d4]">
      {/* Title can be adjusted if needed */}

      <div className="bg-[#2D7A4A] text-white py-6 px-6 shadow-m">
            <h1 className="text-2xl text-center">Formulario de Vinculación a Fondo de Inversión Colectiva.</h1>
          </div>
        

      {/* Personalized message div can be kept or removed */}
      {/*
      <div className="bg-[#f0f5fa] rounded-lg p-4 mb-6">
        <p className="text-sm text-[#1C3B5A]">
          <strong>{userName}</strong>, welcome. Please fill out your details.
        </p>
      </div>
      */}

      <form onSubmit={handleSubmit} className="space-y-6 bg-transparent p-0 md:p-8 rounded-lg" style={{ marginRight: "24px", marginLeft: "24px" }}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-[#074f2a]-700 mb-1">Nombres</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#074f2a]-400" />
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
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
                onChange={(e) => setLastName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DEA742] focus:border-[#DEA742]"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-[#074f2a]-700 mb-1">Monto a Invertir</label>
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
            <label htmlFor="password" className="block text-sm font-medium text-[#074f2a]-700 mb-1">No. de Cuenta</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#074f2a]-400" />
              <input
                id="password"
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DEA742] focus:border-[#DEA742]"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#074f2a]-700 mb-1">Tipo de Cuenta</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#074f2a]-400" />
              <input
                id="confirmPassword"
                type="text"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DEA742] focus:border-[#DEA742]"
                required
              />
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
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DEA742] focus:border-[#DEA742]"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-[#074f2a]-700 mb-1">Dirección</label>
          <div className="relative">
            <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#074f2a]-400" />
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DEA742] focus:border-[#DEA742]"
            />
          </div>
        </div>

        {/* Assuming the next set of fields are for address details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            {/* Label changed from "First Name" to "City" for clarity */}
            <label htmlFor="city" className="block text-sm font-medium text-[#074f2a]-700 mb-1">Ciudad</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#074f2a]-400" />
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DEA742] focus:border-[#DEA742]"
              />
            </div>
          </div>
          <div>
            {/* Label changed from "Last Name" to "State/Province" for clarity */}
            <label htmlFor="state" className="block text-sm font-medium text-[#074f2a]-700 mb-1">Departamento/Provincia</label>
            <div className="relative">
              <Building size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#074f2a]-400" />
              <input
                id="state"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DEA742] focus:border-[#DEA742]"
              />
            </div>
          </div>
        </div>
        
        <div>
          {/* Label changed from "Email Address" to "Zip Code" for clarity */}
          <label htmlFor="zipCode" className="block text-sm font-medium text-[#074f2a]-700 mb-1">Número de Teléfono</label>
          <div className="relative">
            <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#074f2a]-400" />
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DEA742] focus:border-[#DEA742]"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-center pt-4">
          <Button
            type="submit"
            className="bg-[#074f2a] hover:bg-[#DEA742] text-white font-semibold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DEA742]"
            isLoading={isSubmitting}
            // Removed leftIcon, button text will change based on isSubmitting
          >
            {isSubmitting ? "Enviando..." : "Confirmar y Enviar"}
          </Button>
        </div>
      </form>
    </div>
  )
}
