import type React from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "default"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-[#1C3B5A] text-white hover:bg-[#15304a] active:bg-[#0f253a]",
    secondary: "bg-[#DEA742] text-white hover:bg-[#c99539] active:bg-[#b38431]",
    outline: "border border-[#1C3B5A] text-[#1C3B5A] hover:bg-[#f0f5fa]",
    ghost: "text-[#1C3B5A] hover:bg-[#f0f5fa]",
    default: "bg-[#1C3B5A] text-white hover:bg-[#15304a] active:bg-[#0f253a]",
  }

  const sizes = {
    sm: "text-sm px-3 py-1.5 rounded-md",
    md: "text-base px-4 py-2 rounded-lg",
    lg: "text-lg px-6 py-3 rounded-xl",
  }

  return (
    <button
      className={cn(
        "font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#DEA742] focus:ring-offset-2 disabled:opacity-50",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        isLoading && "opacity-70 cursor-not-allowed",
        className,
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      <span className="flex items-center justify-center gap-2">
        {leftIcon && <span>{leftIcon}</span>}
        {children}
        {rightIcon && <span>{rightIcon}</span>}
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
      </span>
    </button>
  )
}
