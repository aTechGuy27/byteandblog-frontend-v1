"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { getProxiedImageUrl } from "@/lib/api-utils"

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
    if (!src) {
      setError(true)
      setLoading(false)
      return
    }

    // Use our proxy function to get the correct URL
    const proxiedUrl = getProxiedImageUrl(src)
    setImageSrc(proxiedUrl)
    setLoading(false)
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
        unoptimized // Use unoptimized for external images
      />
    )
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={imageSrc || "/placeholder.svg"} alt={alt} className={className} onError={() => setError(true)} />
}
