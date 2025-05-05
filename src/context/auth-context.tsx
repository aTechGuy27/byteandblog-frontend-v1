"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { login as apiLogin, getUserProfile } from "@/lib/api"
import { setToken, removeToken, isTokenValid, getDecodedToken, isAdmin } from "@/lib/auth"
import { getProxiedImageUrl } from "@/lib/api-utils"

interface User {
  id: number
  name: string
  email: string
  profileImage?: string
  role?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUserProfile = async () => {
    if (!isTokenValid()) return

    try {
      const profileData = await getUserProfile()
      if (profileData) {
        // Process the profile image URL to use our proxy
        const profileImage = profileData.profileImage ? getProxiedImageUrl(profileData.profileImage) : undefined

        setUser({
          id: profileData.id,
          name: profileData.name || "User",
          email: profileData.email || "",
          role: profileData.role,
          profileImage,
        })
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      if (isTokenValid()) {
        try {
          // Extract basic user info from token
          const decodedToken = getDecodedToken()
          if (decodedToken) {
            setUser({
              id: Number.parseInt(decodedToken.sub),
              name: decodedToken.name || "User",
              email: decodedToken.email || "",
              role: decodedToken.role,
            })

            // Then fetch complete profile to get profile image
            await refreshUserProfile()
          }
        } catch (error) {
          console.error("Failed to decode token:", error)
          removeToken()
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await apiLogin(email, password)
    setToken(response.token)

    // If the login response includes user data, use it directly
    if (response.user) {
      // Process the profile image URL to use our proxy
      const profileImage = response.user.profileImage ? getProxiedImageUrl(response.user.profileImage) : undefined

      setUser({
        ...response.user,
        profileImage,
      })
    } else {
      // Otherwise, extract user data from the token
      const decodedToken = getDecodedToken()
      if (decodedToken) {
        setUser({
          id: Number.parseInt(decodedToken.sub),
          name: decodedToken.name || "User",
          email: decodedToken.email || email, // Use the email from login if not in token
          role: decodedToken.role,
        })
      }
    }

    // Fetch complete profile to get profile image
    await refreshUserProfile()
  }

  const logout = () => {
    removeToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: !!user && isAdmin(),
        isLoading,
        login,
        logout,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
