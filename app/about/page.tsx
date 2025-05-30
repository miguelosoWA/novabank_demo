"use client"

import Image from "next/image"
import { Mail, Phone } from "lucide-react"

export default function About() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-[#00994A] relative" style={{ backgroundImage: 'url(/pattern-bg.svg)', backgroundRepeat: 'repeat', backgroundSize: 'auto' }}>
      {/* Header con logo y nombre alineado como la imagen */}
      <div className="w-full flex items-center justify-center bg-[#104f2c] rounded-b-3xl shadow-lg" style={{ backgroundImage: 'url(/pattern-header.svg)', backgroundRepeat: 'repeat', backgroundSize: 'auto', minHeight: 300 }}>
        <div className="flex flex-row w-full max-w-lg px-6 py-10 gap-4 items-start">
          <div className="flex-shrink-0 flex items-center justify-center h-full mt-2">
            <Image src="/icon-512x512.png" alt="Logo" width={100} height={100} />
          </div>
          <div className="flex flex-col items-start justify-start flex-1 ml-2">
            <span className="text-5xl md:text-3xl font-bold text-white leading-tight" style={{ fontFamily: 'var(--font-clash-display)' }}>
              INSIGHT
            </span>
            <span className="text-5xl md:text-3xl leading-tight" style={{ fontFamily: 'var(--font-clash-display)', color: '#00C96B' }}>
              BANKING
            </span>
            <span className="text-base mt-2  " style={{ fontFamily: 'var(--font-roboto)', color: '#fff' }}>
              By <span className="text-white font-bold text-xl">sofka</span><span className="text-orange-400">_</span>
            </span>
          </div>
        </div>
      </div>

      {/* Mensaje principal */}
      <div className="w-full flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font text-white text-center mb-4" style={{ fontFamily: 'var(--font-clash-display)' }}>
          ¡Déjanos saber cómo podemos ayudarte!
        </h2>
        {/* QR en tarjeta blanca */}
        <div className="bg-white rounded-xl p-4 flex flex-col items-center shadow-md mb-6">
          <span className="text-gray-700 text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-clash-display)' }}>Escanea el código</span>
          <Image src="/qr-code.png" alt="QR Code" width={180} height={180} className="object-contain" />
        </div>
      </div>

      {/* Contacto */}
      <div className="w-full flex flex-col items-center mb-20">
        <h3 className="text-white text-2xl  mb-4" style={{ fontFamily: 'var(--font-clash-display)' }}>Contacto</h3>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <div className="flex items-center bg-[#104f2c] rounded-xl px-4 py-2 text-white mb-2">
            <Mail className="h-5 w-5 text-[#00C96B] mr-3" />
            <span className="text-base break-all" style={{ fontFamily: 'var(--font-roboto)' }}>sofka@sofka.com.co</span>
          </div>
          <div className="flex items-center bg-[#104f2c] rounded-xl px-4 py-2 text-white">
            <Phone className="h-5 w-5 text-[#00C96B] mr-3" />
            <span className="text-base" style={{ fontFamily: 'var(--font-roboto)' }}>3021268169</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-2 text-xs bg-[#104f2c] absolute bottom-0 left-0" style={{ fontFamily: 'var(--font-roboto)', color: '#00994A' }}>
        2024© Sofka Technologies | All Rights Reserved.
      </footer>
    </div>
  )
} 