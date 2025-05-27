interface LogoProps {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "white"
}

export function Logo({ size = "md", variant = "default" }: LogoProps) {
  const sizes = {
    sm: "h-8",
    md: "h-12",
    lg: "h-16",
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${sizes[size]}`} style={{ aspectRatio: "1" }}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Stylized N with shield-like shape */}
          <path
            d="M20 20L20 80H35L80 20V80H65"
            stroke={variant === "default" ? "#1C3B5A" : "#FFFFFF"}
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Accent elements */}
          <path
            d="M20 80L80 80"
            stroke={variant === "default" ? "#DEA742" : "#DEA742"}
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Digital element - horizontal lines */}
          <path
            d="M30 90L70 90"
            stroke={variant === "default" ? "#DEA742" : "#DEA742"}
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Small accent dot */}
          <circle cx="50" cy="15" r="5" fill={variant === "default" ? "#DEA742" : "#DEA742"} />
        </svg>
      </div>
      <div
        className={`font-bold text-${size === "sm" ? "lg" : size === "md" ? "xl" : "2xl"} ${variant === "default" ? "text-[#1C3B5A]" : "text-white"}`}
      >
        SofkaBank
      </div>
    </div>
  )
}
