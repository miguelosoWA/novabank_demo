"use client"

import Image from "next/image"
import { Mail, Phone, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function About() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-primary relative">
        <div className="flex items-center justify-center w-full" style={{ minHeight: 140 }}>
          <Image src="/logo-bi-white.png" alt="Banco Industrial" width={220} height={96} className="h-auto w-[180px]" />
        </div>

      {/* Mensaje principal */}
      <div className="w-full flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font text-white text-center mb-4" style={{ fontFamily: 'var(--font-clash-display)' }}>
          ¡Déjanos saber cómo podemos ayudarte!
        </h2>
        {/* QR en tarjeta blanca */}
        <div className="bg-white rounded-xl p-4 flex flex-col items-center shadow-md mb-6">
          <span className="text-gray-900 text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-clash-display)' }}>Escanea el código</span>
          <Image src="/QR.png" alt="QR Code" width={300} height={300} className="object-contain" />
        </div>
      </div>

      {/* Contacto */}
      <div className="w-full flex flex-col items-center mb-20">
        <h3 className="text-white text-2xl  mb-4" style={{ fontFamily: 'var(--font-clash-display)' }}>Contacto</h3>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <div className="flex justify-center">
            <div className="flex items-center bg-[#002747] rounded-xl px-4 py-2 text-white mb-2">
              <Mail className="h-5 w-5 text-accent mr-3" />
              <span className="text-xl text-base break-all text-center">sofka@sofka.com.co</span>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="flex items-center bg-[#002747] rounded-xl px-4 py-2 text-white">
              <Phone className="h-5 w-5 text-accent mr-3" />
              <span className="text-xl text-base text-center" style={{ fontFamily: 'var(--font-roboto)' }}>+57 3021268169</span>
            </div>
          </div>
          {/* Botón de volver */}
          <div className="flex justify-center mt-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 bg-secondary hover:bg-[#d88912] text-primary font-semibold px-6 py-2 rounded-xl shadow transition-all"
              style={{ fontFamily: 'var(--font-roboto)' }}
            >
              <ArrowLeft className="h-5 w-5" />
                
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-2 text-xs bg-[#002747] absolute bottom-0 left-0 text-white/65">
        2026© Banco Industrial / Todos los derechos reservados.
      </footer>
    </div>
  )
} 