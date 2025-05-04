"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BlogCard } from "@/components/blog-card"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchFeaturedPosts } from "@/lib/api"

export function FeaturedPosts() {
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadFeaturedPosts = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetchFeaturedPosts(3)

        // Handle Spring HATEOAS format
        if (response && response._embedded && response._embedded.blogPostDtoList) {
          setPosts(response._embedded.blogPostDtoList)
        }
        // Handle direct array response
        else if (Array.isArray(response)) {
          setPosts(response)
        }
        // Handle other response formats
        else {
          console.error("Unexpected API response format:", response)
          // Provide fallback data
          setPosts([
            {
              id: 1,
              title: "Getting Started with React",
              excerpt: "Learn the basics of React and how to build your first component.",
              coverImage: "/placeholder.svg?height=200&width=400",
              createdAt: new Date().toISOString(),
              tags: ["React", "JavaScript", "Frontend"],
              author: {
                name: "John Doe",
                profileImage: "/placeholder.svg?height=40&width=40",
              },
            },
            {
              id: 2,
              title: "Building APIs with Node.js",
              excerpt: "A comprehensive guide to building RESTful APIs with Node.js and Express.",
              coverImage: "/placeholder.svg?height=200&width=400",
              createdAt: new Date().toISOString(),
              tags: ["Node.js", "API", "Backend"],
              author: {
                name: "Jane Smith",
                profileImage: "/placeholder.svg?height=40&width=40",
              },
            },
            {
              id: 3,
              title: "CSS Grid Layout",
              excerpt: "Master CSS Grid Layout to create complex web layouts with ease.",
              coverImage: "/placeholder.svg?height=200&width=400",
              createdAt: new Date().toISOString(),
              tags: ["CSS", "Web Design", "Frontend"],
              author: {
                name: "Alex Johnson",
                profileImage: "/placeholder.svg?height=40&width=40",
              },
            },
          ])
        }
      } catch (error) {
        console.error("Failed to fetch featured posts:", error)
        // Provide fallback data when API is unavailable
        setPosts([
          {
            id: 1,
            title: "Getting Started with React",
            excerpt: "Learn the basics of React and how to build your first component.",
            coverImage: "/placeholder.svg?height=200&width=400",
            createdAt: new Date().toISOString(),
            tags: ["React", "JavaScript", "Frontend"],
            author: {
              name: "John Doe",
              profileImage: "/placeholder.svg?height=40&width=40",
            },
          },
          {
            id: 2,
            title: "Building APIs with Node.js",
            excerpt: "A comprehensive guide to building RESTful APIs with Node.js and Express.",
            coverImage: "/placeholder.svg?height=200&width=400",
            createdAt: new Date().toISOString(),
            tags: ["Node.js", "API", "Backend"],
            author: {
              name: "Jane Smith",
              profileImage: "/placeholder.svg?height=40&width=40",
            },
          },
          {
            id: 3,
            title: "CSS Grid Layout",
            excerpt: "Master CSS Grid Layout to create complex web layouts with ease.",
            coverImage: "/placeholder.svg?height=200&width=400",
            createdAt: new Date().toISOString(),
            tags: ["CSS", "Web Design", "Frontend"],
            author: {
              name: "Alex Johnson",
              profileImage: "/placeholder.svg?height=40&width=40",
            },
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    loadFeaturedPosts()
  }, [])

  return (
    <section className="py-12">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Featured Posts</h2>
          <Link href="/blog" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
            View all posts
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array(3)
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
          <div className="mt-8 rounded-md bg-destructive/10 p-6 text-center">
            <p className="text-destructive">{error}</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
