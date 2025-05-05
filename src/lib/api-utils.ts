/**
 * Converts a backend image URL to a proxied URL to avoid CORS issues
 * @param url The original image URL from the backend
 * @returns A proxied URL that can be used in the frontend
 */
export function getProxiedImageUrl(url: string | null): string {
    if (!url) return "/abstract-profile.png"
  
    try {
      // Check if it's already a relative URL
      if (url.startsWith("/")) {
        return url
      }
  
      // Parse the URL
      const parsedUrl = new URL(url)
  
      // Check if it's an uploads URL
      if (parsedUrl.pathname.includes("/uploads/")) {
        // Extract the path after /uploads/
        const path = parsedUrl.pathname.split("/uploads/")[1]
        return `/api/proxy/uploads/${path}`
      }
  
      // Return the original URL if it doesn't match our criteria
      return url
    } catch (error) {
      console.error("Error parsing image URL:", url, error)
      return "/abstract-profile.png"
    }
  }
  