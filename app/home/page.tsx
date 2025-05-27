"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, ArrowDownLeft, CreditCard, Wallet, TrendingUp, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"


interface Account {
  id: number
  type: string
  number: string
  balance: number
  currency: string
}

interface BankCard {
    id: number
    type: "Débito" | "Crédito"
    number: string
    balance?: number
    currency: string
    status: string
    limit?: number
    available?: number
    brand: string
    color: string
}

interface Transaction {
  id: number
  type: string
  amount: number
  description: string
  date: string
  category: string
}

interface UserData {
  name: string
  email: string
  accounts: Account[]
  cards: BankCard[]
  recentTransactions: Transaction[]
}

// Datos de ejemplo - En una aplicación real, estos vendrían de una API
const userData: UserData = {
  name: "Carlos",
  email: "carlos@email.com",
  accounts: [
    {
      id: 1,
      type: "Cuenta Corriente",
      number: "1234 5678 9012 3456",
      balance: 18500.75,
      currency: "COP",
    },
    {
      id: 2,
      type: "Cuenta de Ahorro",
      number: "9876 5432 1098 7654",
      balance: 32000.0,
      currency: "COP",
    },
  ],
  cards: [
    {
      id: 1,
      type: "Débito",
      number: "4321 8765 2109 6543",
      balance: 18500.75,
      available: 18500.75,
      currency: "COP",
      brand: "Visa",
      color: "from-gradient-to-r from-indigo-600 via-purple-600 to-blue-600",
      status: "Activa",
    },
    {
      id: 2,
      type: "Crédito",
      number: "5678 1234 8765 4321",
      balance: 12000.0,
      available: 8000.0,
      limit: 10000000,
      currency: "COP",
      brand: "Mastercard",
      color: "from-gradient-to-r from-rose-500 via-pink-500 to-orange-500",
      status: "Activa"
    },
  ],
  recentTransactions: [
    {
      id: 1,
      type: "Transferencia",
      amount: -500000,
      description: "Transferencia a María García",
      date: "2024-03-15",
      category: "Transferencia"
    },
    {
      id: 2,
      type: "Depósito",
      amount: 1000000,
      description: "Depósito de salario",
      date: "2024-03-10",
      category: "Ingreso"
    },
    {
      id: 3,
      type: "Pago",
      amount: -200000,
      description: "Pago de servicios",
      date: "2024-03-05",
      category: "Alimentos"
    },
    {
      id: 4,
      type: "Pago",
      amount: -200000,
      description: "Pago de servicios",
      date: "2024-03-05",
      category: "Pagos"
    }
  ]
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showBalance, setShowBalance] = useState(true)
  const router = useRouter()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const totalBalance = userData.accounts.reduce((acc, account) => acc + account.balance, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Header mejorado */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-3xl"></div>
          <div className="absolute inset-0 bg-black/10 rounded-3xl"></div>
          <div className="relative p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-4xl font-bold text-white">
                      ¡Hola, {userData.name}! 👋
                    </h1>
                    <p className="text-white/80 text-lg">Tu banca digital personal</p>
                  </div>
                </div>
                <p className="text-white/60 text-sm">{userData.email}</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-white/80 text-sm font-medium">Patrimonio total</span>
                  <button 
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white">
                  {showBalance ? formatCurrency(totalBalance) : "••••••••"}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Botón para hablar con el asistente */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold text-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18v2m0 0a4 4 0 01-4-4h8a4 4 0 01-4 4zm0 0V6m0 0a4 4 0 014 4v4a4 4 0 01-8 0V10a4 4 0 014-4z" /></svg>
            Habla con tu asistente
          </button>
        </div>

        {/* Tabs mejoradas */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-sm border-0 p-1 rounded-2xl shadow-lg">
            <TabsTrigger value="overview" className="rounded-xl font-medium data-[state=active]:bg-white data-[state=active]:shadow-md">
              Resumen
            </TabsTrigger>
            <TabsTrigger value="accounts" className="rounded-xl font-medium data-[state=active]:bg-white data-[state=active]:shadow-md">
              Cuentas
            </TabsTrigger>
            <TabsTrigger value="cards" className="rounded-xl font-medium data-[state=active]:bg-white data-[state=active]:shadow-md">
              Tarjetas
            </TabsTrigger>
            <TabsTrigger value="transactions" className="rounded-xl font-medium data-[state=active]:bg-white data-[state=active]:shadow-md">
              Movimientos
            </TabsTrigger>
          </TabsList>

          {/* Resumen mejorado */}
          <TabsContent value="overview" className="space-y-6">
            <div className="max-h-[450px] md:max-h-[900px] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cuentas */}
                <div className="lg:col-span-2">
                  <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-indigo-600" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-800">Mis Cuentas</h2>
                    </div>
                    <div className="space-y-4">
                      {userData.accounts.map((account, index) => (
                        <div 
                          key={account.id} 
                          className="group p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-blue-50 transition-all duration-300 hover:shadow-md cursor-pointer border border-gray-100"
                          style={{
                            animationDelay: `${index * 0.1}s`
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <div className="space-y-1">
                              <p className="font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors">
                                {account.type}
                              </p>
                              <p className="text-sm text-gray-500 font-mono">
                                •••• •••• •••• {account.number.slice(-4)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-gray-800">
                                {formatCurrency(account.balance)}
                              </p>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">
                                {account.currency}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4">
                  <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-gray-800">Ingresos</span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(2800000)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Este mes</p>
                  </Card>

                  <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <ArrowDownLeft className="w-5 h-5 text-red-500" />
                        <span className="font-semibold text-gray-800">Gastos</span>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-red-500">
                      {formatCurrency(660000)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Este mes</p>
                  </Card>
                </div>
              </div>

              {/* Transacciones recientes en resumen */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Movimientos Recientes</h3>
                <div className="space-y-3">
                  {userData.recentTransactions.slice(0, 3).map((transaction, index) => (
                    <div 
                      key={transaction.id} 
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                      style={{
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.amount > 0 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.amount > 0 ? 
                            <ArrowUpRight className="w-5 h-5" /> : 
                            <ArrowDownLeft className="w-5 h-5" />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                      <p className={`font-bold ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Cuentas mejoradas */}
          <TabsContent value="accounts">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userData.accounts.map((account, index) => (
                <Card 
                  key={account.id} 
                  className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                  style={{
                    animationDelay: `${index * 0.2}s`
                  }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{account.type}</h3>
                          <p className="text-sm text-gray-500">Bancolombia</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500 font-mono tracking-wider">
                        {account.number.replace(/(\d{4})/g, '$1 ').trim()}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-800">
                          {formatCurrency(account.balance)}
                        </span>
                        <span className="text-sm text-gray-500 uppercase tracking-wide">
                          {account.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tarjetas mejoradas */}
          <TabsContent value="cards">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {userData.cards.map((card, index) => (
                <div
                  key={card.id}
                  className="relative group perspective-1000"
                  style={{
                    animationDelay: `${index * 0.2}s`
                  }}
                >
                  <div className="relative w-full h-56 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-3xl shadow-2xl transform group-hover:rotate-y-5 transition-all duration-500 overflow-hidden">
                    {/* Efectos de fondo */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                    <div className="absolute top-4 right-4 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
                    <div className="absolute bottom-4 left-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                    
                    <div className="relative p-8 h-full flex flex-col justify-between text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm opacity-80 uppercase tracking-widest font-medium">
                            {card.type}
                          </p>
                          <p className="text-xs opacity-60 mt-1">{card.status}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{card.brand}</p>
                          <CreditCard className="w-8 h-8 mt-1 opacity-80" />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <p className="text-xl font-mono tracking-[0.2em] opacity-90">
                          {card.number.replace(/(\d{4})/g, '$1 ').trim()}
                        </p>
                        
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-xs opacity-60 mb-1">
                              {card.type === "Crédito" ? "Disponible" : "Saldo"}
                            </p>
                            <p className="text-2xl font-bold">
                              {formatCurrency(card.available || card.balance || 0)}
                            </p>
                          </div>
                          {card.type === "Crédito" && card.limit && (
                            <div className="text-right">
                              <p className="text-xs opacity-60">Límite</p>
                              <p className="text-sm font-medium">
                                {formatCurrency(card.limit)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Transacciones mejoradas */}
          <TabsContent value="transactions">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Historial de Movimientos</h2>
              </div>
              {/* Lista de movimientos sin scroll interno ni alto máximo */}
              <div className="space-y-4">
                {userData.recentTransactions.map((transaction, index) => (
                  <div 
                    key={transaction.id} 
                    className="group p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-blue-50 transition-all duration-300 hover:shadow-md cursor-pointer border border-gray-100"
                    style={{
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        transaction.amount > 0 
                          ? 'bg-green-100 text-green-600 group-hover:bg-green-200' 
                          : 'bg-red-100 text-red-600 group-hover:bg-red-200'
                      } transition-colors`}>
                        {transaction.amount > 0 ? 
                          <ArrowUpRight className="w-6 h-6" /> : 
                          <ArrowDownLeft className="w-6 h-6" />
                        }
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors">
                          {transaction.description}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <span>{transaction.date}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span>{transaction.type}</span>
                        </div>
                        {/* Segunda línea: categoría y valor */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2 gap-1">
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full w-max">{transaction.category}</span>
                          <span className={`text-base font-bold md:text-right ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}> 
                            {transaction.amount > 0 ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 