import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import localFont from 'next/font/local'
import { Roboto } from 'next/font/google'
import "./globals.css"
import { ConditionalVirtualAgent } from "@/components/presentation/conditional-virtual-agent"
import { WebViewProvider } from "@/components/webview/webview-provider"

const inter = Inter({ subsets: ["latin"] })

const clashDisplay = localFont({
  src: [
    {
      path: '../public/fonts/ClashDisplayRegular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/ClashDisplayMedium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/ClashDisplayBold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-clash-display',
  display: 'swap',
})

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#000000',
}

export const metadata: Metadata = {
  title: "SofkaBank - Banca Digital Personalizada",
  description: "Experimenta el poder de la hiperpersonalización en tu banca digital",
  generator: 'v0.dev',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SofkaBank',
    startupImage: [
      {
        url: '/icon-512x512.png',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'msapplication-TileColor': '#000000',
    'msapplication-tap-highlight': 'no',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${clashDisplay.variable} ${roboto.variable} webview-fullscreen`}>
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={`${roboto.className} antialiased webview-fullscreen webview-touch-optimized webview-smooth-scroll safe-area-all`}>
        <WebViewProvider>
          <ConditionalVirtualAgent>{children}</ConditionalVirtualAgent>
        </WebViewProvider>
      </body>
    </html>
  )
}
