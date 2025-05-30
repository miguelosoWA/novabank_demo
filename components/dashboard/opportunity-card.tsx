"use client"

import type React from "react"
import { Card } from "@/components/ui/card"

interface OpportunityCardProps {
  title: string
  description: string
  iconText: string
  onClick: () => void
  iconBgColor: string
  iconTextColor: string
}

export function OpportunityCard({
  title,
  iconText,
  onClick,
  iconBgColor,
  iconTextColor,
}: OpportunityCardProps) {
  return (
    <Card
      className="rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={onClick}
    >
      <div className="flex">
        <div
          className="w-1/4 flex items-center justify-center p-4"
          style={{ backgroundColor: iconBgColor }}
        >
          <span
            className="font-semibold text-xl"
            style={{ color: iconTextColor }}
          >
            {iconText}
          </span>
        </div>
        <div className="flex-1 p-4 flex items-center bg-white">
          <h3 className="text-base font-medium text-gray-800">{title}</h3>
        </div>
      </div>
    </Card>
  )
}
