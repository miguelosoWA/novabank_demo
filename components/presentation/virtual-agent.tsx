"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { GeminiVirtualAgent, GeminiVirtualAgentRef } from "./gemini-virtual-agent"
import { useTransferStore } from '@/lib/store/transfer-store'
import { useCreditCardStore } from '@/lib/store/credit-card-store'

// Logger utility
const Logger = {
  info: (message: string, data?: any) => {
    console.log(`[VirtualAgent] ℹ️ ${message}`, data || '')
  },
  error: (message: string, error?: any) => {
    console.error(`[VirtualAgent] ❌ ${message}`, error || '')
  },
  warn: (message: string, data?: any) => {
    console.warn(`[VirtualAgent] ⚠️ ${message}`, data || '')
  },
  debug: (message: string, data?: any) => {
    console.debug(`[VirtualAgent] 🔍 ${message}`, data || '')
  },
  success: (message: string, data?: any) => {
    console.log(`[VirtualAgent] ✅ ${message}`, data || '')
  }
}

export function VirtualAgent() {
  const [isStreamReady, setIsStreamReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'error' | 'disconnected'>('disconnected')
  const geminiAgentRef = useRef<GeminiVirtualAgentRef>(null)
  const router = useRouter()
  const pathname = usePathname()
  const isMountedRef = useRef(true)
  const isTransfersPage = pathname === '/transfers' || pathname === '/transfers/confirmation'
  const isCreditCardPage = pathname === '/credit-card' || pathname === '/credit-card/confirmation'
  const setTransferData = useTransferStore((state) => state.setTransferData)
  const setCreditCardData = useCreditCardStore((state) => state.setCreditCardData)

  const handleStreamReady = () => {
    if (!isMountedRef.current) return
    Logger.info('Gemini stream ready for messages')
    setIsStreamReady(true)
    setConnectionState('connected')
    setError(null) // Clear any previous errors when connection is successful
  }

  const handleStreamError = (error: string) => {
    if (!isMountedRef.current) return
    
    Logger.error('Error in Gemini stream', { error })
    setError(error)
    setConnectionState('error')
  }

  // Log when component mounts
  useEffect(() => {
    Logger.info('Component VirtualAgent mounted')
    isMountedRef.current = true
    
    return () => {
      Logger.info('Component VirtualAgent unmounted')
      isMountedRef.current = false
    }
  }, [])

  // Log when error state changes
  useEffect(() => {
    if (error && isMountedRef.current) {
      Logger.error('Error updated', { error })
    }
  }, [error])

  // Log when stream state changes
  useEffect(() => {
    if (isMountedRef.current) {
      Logger.debug('Stream state updated', { isStreamReady })
    }
  }, [isStreamReady])

  return (
    <div className="h-full w-full flex items-end justify-center bg-white relative">
      {/* Show errors only in production or for real errors */}
      {error && process.env.NODE_ENV === 'production' && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg max-w-[80%] z-10">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <GeminiVirtualAgent
        ref={geminiAgentRef}
        apiKey={process.env.GEMINI_API_KEY || ""}
        onStreamReady={handleStreamReady}
        onStreamError={handleStreamError}
      />
    </div>
  )
}
