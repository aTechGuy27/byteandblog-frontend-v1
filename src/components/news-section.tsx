"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchNews } from "@/lib/api"

export function NewsSection() {
  const [news, setNews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState("technology")

  const categories = [
    { value: "world", label: "World" },
    { value: "business", label: "Business" },
    { value: "politics", label: "Politics" },
    { value: "science", label: "Science" },
    { value: "health", label: "Health" },
    { value: "education", label: "Education" },
    { value: "technology", label: "Technology" },
    { value: "economy", label: "Economy" },
    { value: "default", label: "General" },
  ]

  const loadNews = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetchNews(1, 10, category)

      // Handle the specific format where articles are in an "articles" array
      if (response && response.articles) {
        setNews(response.articles)
      }
      // Handle Spring HATEOAS format (fallback)
      else if (response && response._embedded && response._embedded.newsArticleDtoList) {
        setNews(response._embedded.newsArticleDtoList)
      }
      // Handle direct array response (fallback)
      else if (Array.isArray(response)) {
        setNews(response)
      }
      // Handle unexpected response format
      else {
        console.error("Unexpected API response format:", response)
        // Provide fallback data
        setNews([
          {
            id: 1,
            title: "New Features Released",
            description: "We've just released new features to improve your experience.",
            url: "#",
            imageUrl: "/placeholder.svg?height=200&width=400",
            urlToImage: "/placeholder.svg?height=200&width=400",
            publishedAt: new Date().toISOString(),
            source: { name: "Tech News" },
          },
          {
            id: 2,
            title: "Upcoming Webinar",
            description: "Join our webinar on modern web development techniques.",
            url: "#",
            imageUrl: "/placeholder.svg?height=200&width=400",
            urlToImage: "/placeholder.svg?height=200&width=400",
            publishedAt: new Date().toISOString(),
            source: { name: "Dev Community" },
          },
          {
            id: 3,
            title: "Community Spotlight",
            description: "Check out these amazing projects from our community members.",
            url: "#",
            imageUrl: "/placeholder.svg?height=200&width=400",
            urlToImage: "/placeholder.svg?height=200&width=400",
            publishedAt: new Date().toISOString(),
            source: { name: "ByteAndBlog" },
          },
        ])
      }
    } catch (error) {
      console.error("Failed to fetch news:", error)
      // Provide fallback data when API is unavailable
      setNews([
        {
          id: 1,
          title: "New Features Released",
          description: "We've just released new features to improve your experience.",
          url: "#",
          imageUrl: "/placeholder.svg?height=200&width=400",
          urlToImage: "/placeholder.svg?height=200&width=400",
          publishedAt: new Date().toISOString(),
          source: { name: "Tech News" },
        },
        {
          id: 2,
          title: "Upcoming Webinar",
          description: "Join our webinar on modern web development techniques.",
          url: "#",
          imageUrl: "/placeholder.svg?height=200&width=400",
          urlToImage: "/placeholder.svg?height=200&width=400",
          publishedAt: new Date().toISOString(),
          source: { name: "Dev Community" },
        },
        {
          id: 3,
          title: "Community Spotlight",
          description: "Check out these amazing projects from our community members.",
          url: "#",
          imageUrl: "/placeholder.svg?height=200&width=400",
          urlToImage: "/placeholder.svg?height=200&width=400",
          publishedAt: new Date().toISOString(),
          source: { name: "ByteAndBlog" },
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadNews()
  }, [category])

  const handleCategoryChange = (value: string) => {
    setCategory(value)
  }

  return (
    <section className="py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl mb-4 md:mb-0">Latest News</h2>
          <div className="w-full md:w-auto">
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <CardHeader>
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full mt-2" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : error ? (
          <div className="rounded-md bg-destructive/10 p-6 text-center">
            <p className="text-destructive">{error}</p>
          </div>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item: any) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={item.imageUrl || item.urlToImage || "/placeholder.svg?height=200&width=400"}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                  <CardDescription>{item.source?.name || "News Source"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-muted-foreground">{item.description}</p>
                </CardContent>
                <CardFooter>
                  <Link
                    href={item.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Read full article
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center p-6">
              <p className="text-center text-muted-foreground">No news available for this category at the moment.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}
