"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowUpRight, Github } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchPortfolioItem } from "@/lib/api"

export default function PortfolioItemClientPage() {
  // Use useParams hook instead of React.use
  const params = useParams()
  const id = params?.id as string

  const [item, setItem] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPortfolioItem = async () => {
      if (!id) return

      setIsLoading(true)
      try {
        const data = await fetchPortfolioItem(id)
        setItem(data)
      } catch (error) {
        console.error("Failed to fetch portfolio item:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPortfolioItem()
  }, [id])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Skeleton className="h-[500px] w-full mb-8 rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold">Portfolio item not found</h1>
      </div>
    )
  }

  // Use image or coverImage, whichever is available
  const imageUrl = item.image || item.coverImage || "/placeholder.svg?height=500&width=1000"

  // Use technologies or skills, whichever is available
  const technologies = item.technologies || item.skills || []

  // Use description or summary, whichever is available
  const description = item.description || item.summary || ""

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-4 text-4xl font-bold">{item.title}</h1>
      <p className="mb-8 text-xl text-muted-foreground">{description}</p>

      <div className="relative mb-8 h-[500px] w-full overflow-hidden rounded-xl">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {technologies.map((tech: string, index: number) => (
          <Badge key={index} variant="outline">
            {tech}
          </Badge>
        ))}
      </div>

      <div className="mb-8 flex flex-wrap gap-4">
        {item.liveUrl && (
          <Button asChild>
            <Link href={item.liveUrl} target="_blank" rel="noopener noreferrer">
              Live Demo <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}

        {item.githubUrl && (
          <Button variant="outline" asChild>
            <Link href={item.githubUrl} target="_blank" rel="noopener noreferrer">
              GitHub <Github className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-bold">The Challenge</h2>
          <p className="text-muted-foreground">{item.challenge || "No challenge description available."}</p>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold">The Solution</h2>
          <p className="text-muted-foreground">{item.solution || "No solution description available."}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-bold">Key Features</h2>
        <ul className="list-inside list-disc space-y-2">
          {(item.features || []).map((feature: string, index: number) => (
            <li key={index}>{feature}</li>
          ))}
          {(!item.features || item.features.length === 0) && <li>No features listed.</li>}
        </ul>
      </div>

      {item.content && (
        <div
          className="mt-8 prose prose-lg max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      )}
    </div>
  )
}