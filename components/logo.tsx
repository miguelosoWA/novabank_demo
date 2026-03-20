import Image from "next/image"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  variant?: "light" | "dark"
}

export function Logo({ size = "md", variant = "light" }: LogoProps) {
  const sizes = {
    sm: { width: 58, height: 30 },
    md: { width: 156, height: 45 },
    lg: { width: 208, height: 60 },
  }

  const currentSize = sizes[size]
  const logoSrc = variant === "dark" ? "/logo-bi-white.png" : "/logo-bi-menu.webp"

  return (
    <div className="flex items-center">
      <Image
        src={logoSrc}
        alt="Banco Industrial"
        width={currentSize.width}
        height={currentSize.height}
        priority={size !== "sm"}
      />
    </div>
  )
}
