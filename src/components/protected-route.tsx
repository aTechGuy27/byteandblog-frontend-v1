"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Skeleton } from "@/components/ui/skeleton"

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login")
      } else if (adminOnly && !isAdmin) {
        router.push("/")
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, router, adminOnly])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-12 w-1/4 mb-6" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} className="h-32 rounded-lg" />
            ))}
        </div>
      </div>
    )
  }

  if (!isAuthenticated || (adminOnly && !isAdmin)) {
    return null
  }

  return <>{children}</>
}
