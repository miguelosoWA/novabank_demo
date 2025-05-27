"use client"

import type React from "react"

import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface OpportunityCardProps {
  title: string
  description: string
  cta: string
  icon: React.ReactNode
  onClick: () => void
}

export function OpportunityCard({ title, description, cta, icon, onClick }: OpportunityCardProps) {
  return (
    <Card className="border-l-1 border-l-[#DEA742]">
      <CardContent className="p-1">
        <div className="flex items-start gap-4">
          <div className="h-2 w-2 rounded-full bg-[#f0f5fa] flex items-center justify-center flex-shrink-0">
            {icon}
          </div>

          <div className="flex-1">
            <CardTitle className="text-base">{title}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">{description}</p>

            {cta && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-[#1C3B5A] hover:text-[#DEA742] p-0 h-auto"
                onClick={onClick}
              >
                {cta} <ArrowRight size={16} className="ml-1" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
