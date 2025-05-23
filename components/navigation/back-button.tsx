"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BackButtonProps {
  destination?: string
  label?: string
  className?: string
}

export function BackButton({
  destination = "/dashboard",
  label = "Regresar al inicio",
  className = "mb-4",
}: BackButtonProps) {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      leftIcon={<ChevronLeft size={16} />}
      onClick={() => router.push(destination)}
    >
      {label}
    </Button>
  )
}
