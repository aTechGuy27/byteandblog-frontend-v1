import { getToken } from "./auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080');
//const API_URL = 'https://byteandblog.com';
// Helper function to handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `Error ${response.status}: ${response.statusText}`)
  }
  return response.json()
}

// Helper function to get auth headers
function getAuthHeaders(token?: string) {
  const authToken = token || getToken();
  return authToken ? { Authorization: `Bearer ${authToken}` } : { Authorization: "" };
}

// Authentication
export async function register(userData: { name: string; email: string; password: string }) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
  return handleResponse(response)
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
  return handleResponse(response)
}

export async function forgotPassword(email: string) {
  try {
    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    // Some APIs return 202 Accepted for this type of request
    if (response.status === 200 || response.status === 201 || response.status === 202 || response.status === 204) {
      // If the API doesn't return JSON for successful requests (e.g., returns empty body)
      if (response.headers.get("content-type")?.includes("application/json")) {
        return response.json()
      } else {
        // Return a success object if no JSON is returned
        return { success: true }
      }
    }

    // Try to parse error as JSON, but don't fail if it's not JSON
    const errorData = await response.json().catch(() => ({
      message: "An unknown error occurred",
    }))

    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
  } catch (error) {
    // If this is already an Error object, rethrow it
    if (error instanceof Error) throw error
    // Otherwise wrap it in an Error
    throw new Error(String(error))
  }
}

export async function resetPassword(token: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password }),
    })

    // Handle various success status codes
    if (response.status === 200 || response.status === 201 || response.status === 202 || response.status === 204) {
      // If the API doesn't return JSON for successful requests (e.g., returns empty body)
      if (response.headers.get("content-type")?.includes("application/json")) {
        return response.json()
      } else {
        // Return a success object if no JSON is returned
        return { success: true }
      }
    }

    // Try to parse error as JSON, but don't fail if it's not JSON
    const errorData = await response.json().catch(() => ({
      message: "An unknown error occurred",
    }))

    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
  } catch (error) {
    // If this is already an Error object, rethrow it
    if (error instanceof Error) throw error
    // Otherwise wrap it in an Error
    throw new Error(String(error))
  }
}
// Remove the getUserProfile function since there's no corresponding endpoint

// Blog Posts
export async function fetchBlogPosts(page = 0, size = 10) {
  const response = await fetch(`${API_URL}/api/blog?page=${page}&size=${size}`)
  return handleResponse(response)
}

export async function fetchBlogPost(id: string) {
  const response = await fetch(`${API_URL}/api/blog/${id}`)
  return handleResponse(response)
}

export async function fetchFeaturedPosts(limit = 3) {
  try {
    const response = await fetch(`${API_URL}/api/blog/featured?limit=${limit}`)
    return handleResponse(response)
  } catch (error) {
    console.error("Network error when fetching featured posts:", error)
    throw new Error("Failed to connect to the API server. Please check your connection or try again later.")
  }
}

export async function createBlogPost(postData: any) {
  const response = await fetch(`${API_URL}/api/blog`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(postData),
  })
  return handleResponse(response)
}

export async function updateBlogPost(id: number, postData: any) {
  const response = await fetch(`${API_URL}/api/blog/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(postData),
  })
  return handleResponse(response)
}

export async function deleteBlogPost(id: number) {
  const response = await fetch(`${API_URL}/api/blog/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  })
  return handleResponse(response)
}

// Portfolio
export async function fetchPortfolioItems(page = 0, size = 10) {
  const response = await fetch(`${API_URL}/api/portfolio?page=${page}&size=${size}`)
  return handleResponse(response)
}

export async function fetchPortfolioItem(id: string) {
  const response = await fetch(`${API_URL}/api/portfolio/${id}`)
  return handleResponse(response)
}

export async function fetchPortfolioHighlights(limit = 3) {
  try {
    const response = await fetch(`${API_URL}/api/portfolio/highlights?limit=${limit}`)
    return handleResponse(response)
  } catch (error) {
    console.error("Network error when fetching portfolio highlights:", error)
    throw new Error("Failed to connect to the API server. Please check your connection or try again later.")
  }
}

export async function createPortfolioItem(itemData: any) {
  const response = await fetch(`${API_URL}/api/portfolio`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(itemData),
  })
  return handleResponse(response)
}

export async function updatePortfolioItem(id: number, itemData: any) {
  const response = await fetch(`${API_URL}/api/portfolio/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(itemData),
  })
  return handleResponse(response)
}

export async function deletePortfolioItem(id: number) {
  const response = await fetch(`${API_URL}/api/portfolio/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  })
  return handleResponse(response)
}

// Comments
export async function fetchComments(postId: string) {
  const response = await fetch(`${API_URL}/api/comments?postId=${postId}`)
  return handleResponse(response)
}

export async function addComment(commentData: { content: string; postId: number }) {
  const response = await fetch(`${API_URL}/api/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(commentData),
  })
  return handleResponse(response)
}

export async function deleteComment(id: number) {
  const response = await fetch(`${API_URL}/api/comments/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  })
  return handleResponse(response)
}

// News
export async function fetchNews(page = 1, pageSize = 10, category = "technology") {
  try {
    const response = await fetch(
      `${API_URL}/api/news/top-headlines?page=${page}&pageSize=${pageSize}&category=${category}`,
    )
    return handleResponse(response)
  } catch (error) {
    console.error("Network error when fetching news:", error)
    throw new Error("Failed to connect to the API server. Please check your connection or try again later.")
  }
}

// File Uploads
export async function uploadFile(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${API_URL}/api/uploads`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  })
  return handleResponse(response)
}

export async function getUserUploads() {
  const response = await fetch(`${API_URL}/api/uploads`, {
    headers: {
      ...getAuthHeaders(),
    },
  })
  return handleResponse(response)
}

export async function getUserUploadsPaginated(page = 0, size = 10) {
  const response = await fetch(`${API_URL}/api/uploads/pageable?page=${page}&size=${size}`, {
    headers: {
      ...getAuthHeaders(),
    },
  })
  return handleResponse(response)
}

// Dashboard Stats
export async function fetchDashboardStats() {
  try {
    const response = await fetch(`${API_URL}/api/dashboard/stats`, {
      headers: {
        ...getAuthHeaders(),
      },
    })
    return handleResponse(response)
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error)
    // Return default stats if the API endpoint doesn't exist or fails
    return {
      totalPosts: 0,
      totalComments: 0,
      totalPortfolioItems: 0,
      totalUploads: 0,
      recentPostsGrowth: 0,
      recentCommentsGrowth: 0,
      recentPortfolioGrowth: 0,
      recentUploadsGrowth: 0,
    }
  }
}

//contact
// Contact form
export async function sendContactMessage(contactData: {
  name: string
  email: string
  subject: string
  message: string
}) {
  try {
    const response = await fetch(`${API_URL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    })

    if (response.ok) {
      const data = await response.json()
      return data
    }

    const errorData = await response.json().catch(() => ({
      message: "Failed to send message. Please try again later.",
    }))

    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
  } catch (error) {
    console.error("Contact form error:", error)
    throw error
  }
}

// Get user profile
export async function getUserProfile() {
  const response = await fetch(`${API_URL}/api/users/profile`, {
    headers: {
      ...getAuthHeaders(),
    },
  })
  return handleResponse(response)
}

// Update user profile
export async function updateUserProfile(profileData: {
  name?: string
  age?: number
  address?: string
}) {
  const response = await fetch(`${API_URL}/api/users/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(profileData),
  })
  return handleResponse(response)
}

// Upload profile picture
export async function uploadProfilePicture(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${API_URL}/api/users/profile/picture`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  })
  return handleResponse(response)
}

// Recent Comments
export async function fetchRecentComments(limit = 5) {
  try {
    const response = await fetch(`${API_URL}/api/comments/recent?limit=${limit}`, {
      headers: {
        ...getAuthHeaders(),
      },
    })
    return handleResponse(response)
  } catch (error) {
    console.error("Failed to fetch recent comments:", error)
    // Return empty array on error
    return []
  }
}

export function getProfileImageUrl(filename: string | null): string {
  if (!filename) return "/abstract-profile.png";
  return `/api/images/profile/${filename}`;
}
