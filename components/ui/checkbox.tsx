import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface CheckboxProps {
  label: ReactNode
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}

export function Checkbox({ label, checked, onChange, required }: CheckboxProps) {
  return (
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        required={required}
        className="h-4 w-4 rounded border-gray-300 text-[#1C3B5A] focus:ring-[#1C3B5A]"
      />
      {label}
    </label>
  )
}
