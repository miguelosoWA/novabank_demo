"use client"

import { Mail, Phone, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function About() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pb-16 md:pb-20 bg-gradient-to-b from-[#003C1A] to-[#00C96B]">
      <div className="w-full max-w-xl px-4">
        <Card className="border-0 shadow-lg rounded-2xl bg-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'var(--font-clash-display)', color: '#FFFFFF' }}>
              <Image src="/novabank_logo.svg" alt="Logo" width={24} height={24} className="mr-2" />
              INSIGHT <span className="font-normal text-[#00C96B]">BANKING</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <span className="text-white text-lg font-light" style={{ fontFamily: 'var(--font-roboto)' }}>By <span className="font-bold">sofka</span><span className="text-orange-400 font-bold">_</span></span>
              <div className="bg-white/20 backdrop-blur-sm rounded-3xl shadow-lg p-6 flex flex-col items-center">
                <Image src="/qr-code.png" alt="QR Code" width={180} height={180} className="object-contain" />
              </div>
              <div className="w-full flex flex-col space-y-4">
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-white">
                  <Mail className="h-5 w-5 text-[#00C96B] mr-3" />
                  <span className="text-base" style={{ fontFamily: 'var(--font-roboto)' }}>contacto@novabank.com</span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4 w-full max-w-sm">
                <div className="group flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors duration-300">
                    <Mail className="h-5 w-5 text-orange-600" />
                  </div>
                  <a 
                    href="mailto:contacto@sofka.com.co" 
                    className="text-gray-700 hover:text-orange-600 transition-colors duration-300 font-medium"
                  >
                    contacto@sofka.com.co
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
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-white">
                  <Phone className="h-5 w-5 text-[#00C96B] mr-3" />
                  <span className="text-base" style={{ fontFamily: 'var(--font-roboto)' }}>+57 300 123 4567</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botón de Volver */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => router.push('/dashboard')}
            className="bg-white/20 hover:bg-white/30 text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
          >
            <ArrowLeft className="h-5 w-5" />
            Volver al Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
} 