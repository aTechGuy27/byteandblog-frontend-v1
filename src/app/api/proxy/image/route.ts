import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Get the API URL from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    if (!apiUrl) {
      console.error("NEXT_PUBLIC_API_URL is not defined")
      return new NextResponse("Server configuration error", { status: 500 })
    }

    // Get the image path from the URL
    const url = new URL(request.url)
    const imagePath = url.searchParams.get("path")

    if (!imagePath) {
      return new NextResponse("Image path is required", { status: 400 })
    }

    // Create the full URL to proxy
    let fullImageUrl = imagePath

    // If it's a relative path, prepend the API URL
    if (!imagePath.startsWith("http")) {
      fullImageUrl = `${apiUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`
    }

    console.log(`Proxying image request to: ${fullImageUrl}`)

    // Get the auth token
    const token = getToken()

    // Prepare headers for the backend request
    const headers: HeadersInit = {
      Accept: "image/*",
    }

    // Add authorization header if we have a token
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    // Fetch the image from the backend with auth headers
    const response = await fetch(fullImageUrl, {
      headers,
      cache: "no-store", // Disable caching to ensure fresh content
    })

    // If the response is not OK, throw an error
    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.status} ${response.statusText}`)
      // Return a fallback image instead of throwing
      return NextResponse.redirect(new URL("/abstract-profile.png", request.url))
    }

    // Get the content type from the response
    const contentType = response.headers.get("content-type") || "image/jpeg"

    // Get the response body as an array buffer
    const buffer = await response.arrayBuffer()

    // Return the response with the appropriate content type
    return new NextResponse(buffer, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error("Image proxy error:", error)
    // Return a fallback image on error
    return NextResponse.redirect(new URL("/abstract-profile.png", request.url))
  }
}
