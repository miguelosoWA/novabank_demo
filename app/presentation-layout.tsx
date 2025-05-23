import type React from "react"
import { PresentationMode } from "@/components/presentation/presentation-mode"

export default function PresentationLayout({ children }: { children: React.ReactNode }) {
  return <PresentationMode>{children}</PresentationMode>
}
