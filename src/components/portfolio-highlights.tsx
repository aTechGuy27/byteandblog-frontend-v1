"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { PortfolioCard } from "@/components/portfolio-card"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchPortfolioHighlights } from "@/lib/api"

export function PortfolioHighlights() {
  const [items, setItems] = useState<any[]>([]) // Initialize as empty array
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPortfolioHighlights = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchPortfolioHighlights(2)

        // Check if data is an array
        if (Array.isArray(data)) {
          setItems(data)
        } else {
          console.error("Unexpected API response format:", data)
          // Provide fallback data when API returns unexpected format
          setItems([
            {
              id: 1,
              title: "E-commerce Platform",
              description: "A full-featured e-commerce platform built with React and Node.js",
              image: "/placeholder.svg?height=300&width=600",
              technologies: ["React", "Node.js", "MongoDB", "Express"],
            },
            {
              id: 2,
              title: "Task Management App",
              description: "A productivity app for managing tasks and projects",
              image: "/placeholder.svg?height=300&width=600",
              technologies: ["Vue.js", "Firebase", "Tailwind CSS"],
            },
          ])
        }
      } catch (error) {
        console.error("Failed to fetch portfolio highlights:", error)
        // Provide fallback data when API is unavailable
        setItems([
          {
            id: 1,
            title: "E-commerce Platform",
            description: "A full-featured e-commerce platform built with React and Node.js",
            image: "/placeholder.svg?height=300&width=600",
            technologies: ["React", "Node.js", "MongoDB", "Express"],
          },
          {
            id: 2,
            title: "Task Management App",
            description: "A productivity app for managing tasks and projects",
            image: "/placeholder.svg?height=300&width=600",
            technologies: ["Vue.js", "Firebase", "Tailwind CSS"],
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    loadPortfolioHighlights()
  }, [])

  return (
    <section className="py-12 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Portfolio Highlights</h2>
          <Link
            href="/portfolio"
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
          >
            View all projects
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array(2)
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
          <div className="mt-8 rounded-md bg-destructive/10 p-6 text-center">
            <p className="text-destructive">{error}</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {items.map((item: any) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
