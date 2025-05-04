"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { BlogCard } from "@/components/blog-card"
import { Pagination } from "@/components/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchBlogPosts } from "@/lib/api"

export default function BlogPage() {
  const searchParams = useSearchParams()
  const pageParam = searchParams.get("page")
  const [currentPage, setCurrentPage] = useState(pageParam ? Number.parseInt(pageParam) : 0)
  const [posts, setPosts] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetchBlogPosts(currentPage, 9)

        // Handle Spring HATEOAS format
        if (response && response._embedded && response._embedded.blogPostDtoList) {
          setPosts(response._embedded.blogPostDtoList)

          // Extract pagination info from the page property
          if (response.page) {
            setTotalPages(response.page.totalPages || 1)
          } else {
            setTotalPages(1)
          }
        }
        // Handle standard paginated response format
        else if (response && Array.isArray(response.content)) {
          setPosts(response.content)
          setTotalPages(response.totalPages || 1)
        }
        // Handle direct array response
        else if (Array.isArray(response)) {
          setPosts(response)
          setTotalPages(1)
        }
        // Handle unexpected response format
        else {
          console.error("Unexpected API response format:", response)
          setPosts([])
          setError("Received unexpected data format from API")
        }
      } catch (error) {
        console.error("Failed to fetch blog posts:", error)
        setPosts([])
        setError("Failed to load blog posts. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    loadPosts()
  }, [currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">Blog</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array(9)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
        </div>
      ) : error ? (
        <div className="rounded-md bg-destructive/10 p-6 text-center">
          <p className="text-destructive">{error}</p>
        </div>
      ) : posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          <div className="mt-12">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        </>
      ) : (
        <div className="rounded-md bg-muted p-6 text-center">
          <p className="text-muted-foreground">No blog posts found.</p>
        </div>
      )}
    </div>
  )
}
