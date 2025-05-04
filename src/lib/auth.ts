import { jwtDecode } from "jwt-decode"

interface JwtPayload {
  sub: string
  name: string
  email: string
  role: string
  exp: number
  iat: number
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("authToken")
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem("authToken", token)
}

export function removeToken(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("authToken")
}

export function isTokenValid(): boolean {
  const token = getToken()
  if (!token) return false

  try {
    const decoded = jwtDecode<JwtPayload>(token)
    const currentTime = Date.now() / 1000
    return decoded.exp > currentTime
  } catch (error) {
    console.error("Invalid token:", error)
    return false
  }
}

export function getDecodedToken(): JwtPayload | null {
  const token = getToken()
  if (!token) return null

  try {
    return jwtDecode<JwtPayload>(token)
  } catch (error) {
    console.error("Failed to decode token:", error)
    return null
  }
}

export function isAdmin(): boolean {
  const decoded = getDecodedToken()
  return decoded?.role === "ADMIN"
}
