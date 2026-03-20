"use client"

import { useState, useEffect } from "react"
import { Lightbulb, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ContextualNotificationProps {
  message: string
  onDismiss: () => void
  onAction: () => void
  delay?: number
}

export function ContextualNotification({ message, onDismiss, onAction, delay = 3000 }: ContextualNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Delay the appearance for a more natural feel
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 max-w-xs z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-secondary">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-neutral flex items-center justify-center flex-shrink-0">
            <Lightbulb size={16} className="text-secondary" />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <p className="text-sm text-primary pr-6">{message}</p>
              <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600 -mt-1 -mr-1">
                <X size={16} />
              </button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-accent p-0 h-auto mt-2 text-xs"
              onClick={onAction}
            >
              Ver detalles
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
