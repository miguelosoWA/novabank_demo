import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#B2ECF2] focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-[0_2px_8px_rgba(0,56,101,0.08)]",
  {
    variants: {
      variant: {
        default: "bg-secondary text-primary hover:bg-[#d88912] active:bg-[#c27708]",
        primary: "bg-secondary text-primary hover:bg-[#d88912] active:bg-[#c27708]",
        secondary: "bg-accent text-white hover:bg-[#2D8C9E] active:bg-[#1d7787]",
        outline: "border-2 border-primary text-primary hover:bg-[#eaf3f5]",
        ghost: "text-primary hover:bg-[#eaf3f5] shadow-none",
        destructive: "bg-[#F13852] text-white hover:bg-[#d42e46] active:bg-[#ba2038]",
        dark: "border border-white/60 bg-primary text-white hover:bg-[#002747] active:bg-[#001d35]",
      },
      size: {
        default: "rounded-full px-5 py-2.5 text-base",
        sm: "rounded-full px-3 py-1.5 text-sm",
        md: "rounded-full px-5 py-2.5 text-base",
        lg: "rounded-full px-6 py-3 text-lg",
        icon: "h-10 w-10 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      size,
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && "w-full",
          isLoading && "cursor-not-allowed opacity-70",
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {leftIcon && <span>{leftIcon}</span>}
        <span className="flex items-center justify-center gap-2">
          {children}
          {isLoading && (
            <svg
              className="h-4 w-4 animate-spin text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
        </span>
        {rightIcon && <span>{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = "Button"
