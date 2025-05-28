"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone } from "lucide-react"
import Image from "next/image"

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12">
            <div className="flex flex-col items-center space-y-12">
              {/* Logo and Title */}
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                  NovaBank
                </h1>
                <p className="text-gray-500">Tu banco del futuro, hoy</p>
              </div>

              {/* QR Code with decorative elements */}
              <div className="relative">
                <div className="absolute -inset-8 bg-gradient-to-r from-orange-200 to-orange-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative w-64 h-64 bg-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <Image 
                    src="/qr-code.png" 
                    alt="QR Code" 
                    width={300}
                    height={300}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4 w-full max-w-sm">
                <div className="group flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors duration-300">
                    <Mail className="h-5 w-5 text-orange-600" />
                  </div>
                  <a 
                    href="mailto:contacto@novabank.com" 
                    className="text-gray-700 hover:text-orange-600 transition-colors duration-300 font-medium"
                  >
                    contacto@novabank.com
                  </a>
                </div>

                <div className="group flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors duration-300">
                    <Phone className="h-5 w-5 text-orange-600" />
                  </div>
                  <a 
                    href="tel:+573001234567" 
                    className="text-gray-700 hover:text-orange-600 transition-colors duration-300 font-medium"
                  >
                    +57 300 123 4567
                  </a>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-40 h-40 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 