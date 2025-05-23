"use client"

import { Home, CreditCard, ArrowRightLeft, TrendingUp, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function MobileNavbar() {
  const pathname = usePathname()

  const navItems = [
    {
      label: "Inicio",
      href: "/dashboard",
      icon: Home,
    },
    {
      label: "Cuentas",
      href: "/accounts",
      icon: CreditCard,
    },
    {
      label: "Transferir",
      href: "/transfers",
      icon: ArrowRightLeft,
    },
    {
      label: "Inversiones",
      href: "/investments",
      icon: TrendingUp,
    },
    {
      label: "Perfil",
      href: "/profile",
      icon: User,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full ${
                isActive ? "text-[#DEA742]" : "text-[#1C3B5A]"
              }`}
            >
              <Icon size={20} className={isActive ? "text-[#DEA742]" : "text-[#1C3B5A]"} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
