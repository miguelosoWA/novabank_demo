"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, MapPin, Phone } from "lucide-react"
import Image from "next/image"

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1C3B5A] to-[#2A4D6E] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">NovaBank</h1>
          <p className="text-xl text-gray-200">Tu banco del futuro, hoy</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Información de la empresa */}
          <Card className="bg-white/10 backdrop-blur-lg border-none">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Sobre Nosotros</h2>
              <p className="text-gray-200 mb-6 leading-relaxed">
                En NovaBank, estamos comprometidos con la innovación y la excelencia en el servicio financiero. 
                Nuestra misión es proporcionar soluciones bancarias modernas y accesibles que empoderen a nuestros 
                clientes para alcanzar sus metas financieras.
              </p>
              <p className="text-gray-200 mb-6 leading-relaxed">
                Fundada en 2024, NovaBank ha revolucionado la industria bancaria con nuestra plataforma digital 
                de vanguardia y nuestro enfoque centrado en el cliente. Nos enorgullece ofrecer servicios 
                financieros seguros, rápidos y convenientes.
              </p>
              
              <div className="space-y-4 mt-8">
                <div className="flex items-center text-gray-200">
                  <Mail className="w-5 h-5 mr-3" />
                  <span>contacto@novabank.com</span>
                </div>
                <div className="flex items-center text-gray-200">
                  <Phone className="w-5 h-5 mr-3" />
                  <span>+57 601 123 4567</span>
                </div>
                <div className="flex items-center text-gray-200">
                  <MapPin className="w-5 h-5 mr-3" />
                  <span>Bogotá, Colombia</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Código QR y contacto */}
          <Card className="bg-white/10 backdrop-blur-lg border-none">
            <CardContent className="p-8 flex flex-col items-center justify-center">
              <div className="bg-white p-4 rounded-lg mb-6">
                <Image
                  src="/qr-code.png"
                  alt="Código QR NovaBank"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>
              <p className="text-gray-200 text-center mb-6">
                Escanea el código QR para acceder a nuestra aplicación móvil y disfrutar de todos nuestros servicios
              </p>
              <Button 
                className="bg-white text-[#1C3B5A] hover:bg-gray-100"
                onClick={() => window.location.href = 'mailto:contacto@novabank.com'}
              >
                Contáctanos
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Valores de la empresa */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="bg-white/10 backdrop-blur-lg border-none">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold text-white mb-3">Innovación</h3>
              <p className="text-gray-200">
                Siempre a la vanguardia de la tecnología financiera
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-lg border-none">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold text-white mb-3">Seguridad</h3>
              <p className="text-gray-200">
                Protección de tus datos y transacciones
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-lg border-none">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold text-white mb-3">Confianza</h3>
              <p className="text-gray-200">
                Relaciones duraderas con nuestros clientes
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 