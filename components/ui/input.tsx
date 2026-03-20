import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && <label className="text-sm font-semibold text-primary">{label}</label>}
        <div className="relative">
          {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
          <input
            ref={ref}
            className={cn(
              "w-full rounded-md border border-[#cfd8dc] bg-white px-4 py-3 text-primary transition-colors placeholder:text-slate-400 shadow-[0_2px_8px_rgba(0,56,101,0.06)] focus:border-accent focus:outline-none focus:ring-2 focus:ring-[#b2ecf2]",
              icon && "pl-12",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-[#F13852]">{error}</p>}
      </div>
    )
  }
)

Input.displayName = "Input"
