"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getToken } from "@/lib/auth"
import Image from "next/image"

interface AuthenticatedImageProps {
  src: string | null
  alt: string
  className?: string
  width?: number
  height?: number
  fallback?: React.ReactNode
}

export function AuthenticatedImage({ src, alt, className, width, height, fallback }: AuthenticatedImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    let objectUrl: string | null = null

    const fetchImage = async () => {
      if (!src) {
        setError(true)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(false)

        const token = getToken()
        const response = await fetch(src, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status}`)
        }

        const blob = await response.blob()
        objectUrl = URL.createObjectURL(blob)

        if (isMounted) {
          setImageSrc(objectUrl)
          setLoading(false)
        }
      } catch (error) {
        console.error("Error loading image:", error)
        if (isMounted) {
          setError(true)
          setLoading(false)
        }
      }
    }

    fetchImage()

    return () => {
      isMounted = false
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [src])

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (error || !imageSrc) {
    return (
      fallback || (
        <div className={`flex items-center justify-center bg-muted ${className}`}>
          <span className="text-muted-foreground">Image not available</span>
        </div>
      )
    )
  }

  if (width && height) {
    return (
      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={() => setError(true)}
      />
    )
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={imageSrc || "/placeholder.svg"} alt={alt} className={className} onError={() => setError(true)} />
}
