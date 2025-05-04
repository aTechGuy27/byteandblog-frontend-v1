"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than or equal to maxPagesToShow
      for (let i = 0; i < totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always include first page
      pageNumbers.push(0)

      let startPage = Math.max(1, currentPage - 1)
      let endPage = Math.min(totalPages - 2, currentPage + 1)

      // Adjust if we're at the start
      if (currentPage <= 1) {
        endPage = 3
      }

      // Adjust if we're at the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 4
      }

      // Add ellipsis after first page if needed
      if (startPage > 1) {
        pageNumbers.push(-1) // -1 represents ellipsis
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 2) {
        pageNumbers.push(-2) // -2 represents ellipsis
      }

      // Always include last page
      pageNumbers.push(totalPages - 1)
    }

    return pageNumbers
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button variant="outline" size="icon" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0}>
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      {getPageNumbers().map((pageNumber, index) => {
        if (pageNumber < 0) {
          // Render ellipsis
          return (
            <span key={`ellipsis-${index}`} className="px-2">
              &hellip;
            </span>
          )
        }

        return (
          <Button
            key={pageNumber}
            variant={pageNumber === currentPage ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber + 1}
          </Button>
        )
      })}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  )
}
