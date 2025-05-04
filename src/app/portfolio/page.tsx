"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { PortfolioCard } from "@/components/portfolio-card"
import { Pagination } from "@/components/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchPortfolioItems } from "@/lib/api"

export default function PortfolioPage() {
  const searchParams = useSearchParams()
  const pageParam = searchParams.get("page")
  const [currentPage, setCurrentPage] = useState(pageParam ? Number.parseInt(pageParam) : 0)
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]) // Initialize as empty array
  const [totalPages, setTotalPages] = useState(1) // Default to 1 page
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const PAGE_SIZE = 9

  useEffect(() => {
    const loadPortfolioItems = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetchPortfolioItems(currentPage, PAGE_SIZE)

        // Handle different response formats
        if (Array.isArray(response)) {
          // Direct array response
          setPortfolioItems(response)
          // Calculate total pages based on array length and page size
          // This is an approximation since we don't have total count
          setTotalPages(Math.max(1, Math.ceil(response.length / PAGE_SIZE)))
        } else if (response && Array.isArray(response.content)) {
          // Paginated response with content array
          setPortfolioItems(response.content)
          setTotalPages(response.totalPages || 1)
        } else {
          // Unexpected response format
          console.error("Unexpected API response format:", response)
          setPortfolioItems([])
          setError("Received unexpected data format from API")
        }
      } catch (error) {
        console.error("Failed to fetch portfolio items:", error)
        setPortfolioItems([]) // Set to empty array on error
        setError("Failed to load portfolio items. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    loadPortfolioItems()
  }, [currentPage, PAGE_SIZE])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">Portfolio</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array(PAGE_SIZE)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-[300px] w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
        </div>
      ) : error ? (
        <div className="rounded-md bg-destructive/10 p-6 text-center">
          <p className="text-destructive">{error}</p>
        </div>
      ) : portfolioItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {portfolioItems.map((item: any) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-12">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        </>
      ) : (
        <div className="rounded-md bg-muted p-6 text-center">
          <p className="text-muted-foreground">No portfolio items found.</p>
        </div>
      )}
    </div>
  )
}
