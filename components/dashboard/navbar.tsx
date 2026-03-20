"use client"
import { Bell } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { UserMenu } from "@/components/dashboard/user-menu"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

export function Navbar() {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-primary shadow-[0_4px_16px_rgba(0,56,101,0.18)]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Logo size="sm" variant="dark" />
          </div>

          <div className="flex items-center space-x-2">
            <Link href="/notifications">
              <Button variant="ghost" size="sm" className="relative text-white shadow-none hover:bg-white/10 hover:text-white focus-visible:ring-offset-0 focus-visible:ring-transparent">
                <Bell size={20} />
                <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-secondary"></span>
              </Button>
            </Link>

            {isDesktop && <UserMenu />}
          </div>
        </div>
      </div>
    </header>
  )
}
