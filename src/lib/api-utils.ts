import { getToken } from "./auth"

/**
 * Converts a backend image URL to a proxied URL to avoid CORS issues
 * @param url The original image URL from the backend
 * @returns A proxied URL that can be used in the frontend
 */
export function getProxiedImageUrl(url: string | null): string {
  if (!url) return "/abstract-profile.png"

  try {
    // Check if it's already a relative URL that doesn't need proxying
    if (url.startsWith("/") && !url.startsWith("/uploads/") && !url.startsWith("/api/")) {
      return url
    }

    // For absolute URLs that are already on our domain, don't proxy
    if (typeof window !== "undefined" && url.startsWith("http")) {
      try {
        const urlObj = new URL(url)
        if (urlObj.hostname === window.location.hostname) {
          return url
        }
      } catch (e) {
        // Not a valid URL, continue with proxying
      }
    }

    // Create a proxied URL
    return `/api/proxy/image?path=${encodeURIComponent(url)}`
  } catch (error) {
    console.error("Error parsing image URL:", url, error)
    return "/abstract-profile.png"
  }
}

/**
 * Creates an authenticated URL for fetching resources that require authentication
 * @param url The original URL
 * @returns A URL with authentication token included
 */
export function createAuthenticatedUrl(url: string | null): string | null {
  if (!url) return null

  try {
    // Use the image proxy for image URLs
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg|avif|JPG|JPEG|PNG|GIF)$/i)) {
      return getProxiedImageUrl(url)
    }

    const token = getToken()
    if (!token) return url

    // For non-image URLs, add the token as a query parameter
    const parsedUrl = new URL(url)
    parsedUrl.searchParams.append("token", token)
    return parsedUrl.toString()
  } catch (error) {
    console.error("Error creating authenticated URL:", error)
    return url
  }
}
