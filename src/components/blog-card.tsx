"use client"

import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useState, useEffect } from "react"

interface BlogCardProps {
  post: {
    id: number
    title: string
    excerpt?: string
    content?: string
    coverImage?: string
    createdAt: string
    tags?: string[]
    author?: {
      name: string
      profileImage?: string
    }
  }
}

export function BlogCard({ post }: BlogCardProps) {
  const [formattedDate, setFormattedDate] = useState("")
  const [excerpt, setExcerpt] = useState("")

  useEffect(() => {
    if (post.createdAt) {
      setFormattedDate(format(new Date(post.createdAt), "MMM d, yyyy"))
    }

    // Generate excerpt from content if not provided
    if (!post.excerpt && post.content) {
      // Strip HTML tags and get first 150 characters
      const strippedContent = post.content.replace(/<[^>]*>/g, "")
      setExcerpt(strippedContent.substring(0, 150) + (strippedContent.length > 150 ? "..." : ""))
    } else {
      setExcerpt(post.excerpt || "")
    }
  }, [post.createdAt, post.excerpt, post.content])

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link href={`/blog/${post.id}`}>
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={post.coverImage || "/placeholder.svg?height=200&width=400"}
            alt={post.title}
            fill
            className="object-cover transition-transform hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      <CardHeader className="p-4">
        <div className="space-y-1">
          <Link href={`/blog/${post.id}`} className="hover:underline">
            <h3 className="line-clamp-2 text-xl font-bold">{post.title}</h3>
          </Link>
          <div className="flex flex-wrap gap-2">
            {post.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="px-2 py-0 text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="line-clamp-3 text-muted-foreground">{excerpt}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div className="flex items-center space-x-2">
          {post.author && (
            <>
              <div className="relative h-6 w-6 overflow-hidden rounded-full">
                <Image
                  src={post.author.profileImage || "/placeholder.svg?height=24&width=24"}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                  sizes="24px"
                />
              </div>
              <span className="text-xs text-muted-foreground">{post.author.name}</span>
            </>
          )}
        </div>
        <span className="text-xs text-muted-foreground">{formattedDate}</span>
      </CardFooter>
    </Card>
  )
}
