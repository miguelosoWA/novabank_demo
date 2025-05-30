import Image from 'next/image'

interface LogoProps {
  size?: "sm" | "md" | "lg"
}

export function Logo({ size = "md" }: LogoProps) {
  const sizes = {
    sm: { width: 32, height: 32, textSize: "lg" },
    md: { width: 48, height: 48, textSize: "xl" },
    lg: { width: 64, height: 64, textSize: "2xl" },
  }

  if (size === "sm") {
    return (
      <div className="flex items-center">
        <Image
          src="/icon-192x192.png"
          alt="Insight Banking Logo"
          width={30}
          height={30}
        />
        <div className="ml-2 flex flex-col justify-center">
          <div>
            <span className="text-white font-bold text-lg leading-tight">INSIGHT</span>
            <span className="text-[#6ABE7A] font-light text-lg ml-1 leading-tight">BANKING</span>
          </div>
          <p className="text-xs text-white leading-tight">
            By <span className="font-semibold text-white">sofka</span><span className="text-[#F58220]">_</span>
          </p>
        </div>
      </div>
    )
  }

  const currentSize = sizes[size]
  return (
    <div className="flex items-center gap-2">
      <div className={`relative w-[${currentSize.width}px] h-[${currentSize.height}px]`}>
        <Image
          src="/icon-192x192.png"
          alt="Insight Banking Logo"
          width={currentSize.width}
          height={currentSize.height}
        />
      </div>
      <div
        className={`font-bold text-${currentSize.textSize} text-[#1C3B5A]`}
      >
        Insight Banking by Sofka
      </div>
    </div>
  )
}
