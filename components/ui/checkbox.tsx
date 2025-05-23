import type React from "react"
import { cn } from "@/lib/utils"

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <div className="relative">
        <input type="checkbox" className="sr-only" {...props} />
        <div
          className={cn(
            "h-5 w-5 border rounded transition-colors",
            props.checked ? "bg-[#1C3B5A] border-[#1C3B5A]" : "border-gray-300 bg-white",
            className,
          )}
        >
          {props.checked && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
      {label && <span className="text-sm text-[#1C3B5A]">{label}</span>}
    </label>
  )
}
