"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AuthenticatedImage } from "@/components/authenticated-image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMobile } from "@/hooks/use-mobile"

export default function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { user, logout, isAdmin } = useAuth()
  const isMobile = useMobile()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Only show after component is mounted to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

   // Function to get initials from name
   const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ]

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <div className="relative h-10 w-20">
                {/* Placeholder for logo */}
                <div className="h-10 w-20" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Placeholder for theme toggle */}
            <div className="h-9 w-9" />
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-700/20 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white shadow-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            {/* Logo added here */}
            <div className="relative h-20 w-40">
              <Image src="/logo2.png?height=40&width=80" alt="Logo" fill className="object-contain" />
            </div>
          </Link>

          {!isMobile && (
            <nav className="hidden gap-6 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-white hover:opacity-100 ${
                    pathname === item.href ? "text-white" : "text-white/80 hover:underline hover:underline-offset-4"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative text-white hover:bg-white/10 hover:text-white"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-white/10">
                  <Avatar className="h-8 w-8">
                    {/* Replace AvatarImage with AuthenticatedImage */}
                    <div className="h-full w-full overflow-hidden rounded-full">
                      <AuthenticatedImage
                        src={user.profileImage || null}
                        alt={user.name}
                        className="h-full w-full object-cover"
                        fallback={
                          <AvatarFallback className="text-xs">
                            {user.name ? getInitials(user.name) : "U"}
                          </AvatarFallback>
                        }
                      />
                    </div>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">Profile</Link>
                </DropdownMenuItem>

                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/add-blog">Add Blog Post</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/add-portfolio">Add Portfolio Item</Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            !isMobile && (
              <div className="hidden gap-2 md:flex">
                <Button variant="ghost" asChild className="text-white hover:bg-white/10">
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild className="bg-white text-blue-600 hover:bg-blue-50">
                  <Link href="/auth/register">Register</Link>
                </Button>
              </div>
            )
          )}

          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-white/10"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div className="container pb-4 bg-gradient-to-b from-blue-500/0 to-blue-600/50">
          <nav className="flex flex-col space-y-4 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-white ${
                  pathname === item.href ? "text-white" : "text-white/80"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {!user && (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-white/80 transition-colors hover:text-white"
                >
                  Login
                </Link>
                <Link href="/auth/register">
                  <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">Register</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
