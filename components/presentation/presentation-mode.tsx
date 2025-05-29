"use client"

import { ReactNode } from "react"

interface PresentationModeProps {
  children: ReactNode
}

export function PresentationMode({ children }: PresentationModeProps) {
  return (
    <div className="h-screen w-screen bg-black">
      {children}
    </div>
  )
} 