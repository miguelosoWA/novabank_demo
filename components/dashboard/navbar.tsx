"use client"
import { Bell } from "lucide-react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useMediaQuery } from "@/hooks/use-media-query"
import { UserMenu } from "@/components/dashboard/user-menu"

export function Navbar() {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Logo size="sm" />
          </div>

          <div className="flex items-center space-x-2">
            <Link href="/notifications">
              <Button variant="ghost" size="sm" className="relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
            </Link>

            {isDesktop && <UserMenu />}
          </div>
        </div>
      </div>
    </header>
  )
}
