import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ConditionalVirtualAgent } from "@/components/presentation/conditional-virtual-agent"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NovaBank - Banca Digital Personalizada",
  description: "Experimenta el poder de la hiperpersonalización en tu banca digital",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ConditionalVirtualAgent>{children}</ConditionalVirtualAgent>
      </body>
    </html>
  )
}
