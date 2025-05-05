"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { useParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CommentSection } from "@/components/comment-section"
import { fetchBlogPost } from "@/lib/api"
import BlogContent from "@/components/blog/blog-content" // Import the BlogContent component

export default function BlogPostPageClient() {
  const params = useParams()
  const id = params?.id as string

  const [post, setPost] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formattedDate, setFormattedDate] = useState("")

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return

      setIsLoading(true)
      try {
        const data = await fetchBlogPost(id)
        setPost(data)

        if (data?.createdAt) {
          setFormattedDate(format(new Date(data.createdAt), "MMMM d, yyyy"))
        }
      } catch (error) {
        console.error("Failed to fetch blog post:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPost()
  }, [id])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Skeleton className="h-[400px] w-full mb-8 rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold">Post not found</h1>
      </div>
    )
  }

  // Use coverImage if available, otherwise use image
  const imageUrl = post.coverImage || post.image || "/placeholder.svg?height=400&width=800"

  // Use tags if available, otherwise use an empty array
  const tags = post.tags || []

  return (
    <article className="container mx-auto px-4 py-12">
      <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>

      <div className="mb-8 flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={post.author?.profileImage || "/placeholder.svg?height=40&width=40"} />
          <AvatarFallback>{post.author?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{post.author?.name || "Anonymous"}</p>
          <p className="text-sm text-muted-foreground">{formattedDate || "Unknown date"}</p>
        </div>
      </div>

      <div className="relative mb-8 h-[400px] w-full overflow-hidden rounded-xl">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {post.coverImageCaption && (
        <p className="mb-8 text-center text-sm text-muted-foreground">{post.coverImageCaption}</p>
      )}

      <div className="mb-8 flex flex-wrap gap-2">
        {tags.map((tag: string, index: number) => (
          <Badge key={index} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Replace dangerouslySetInnerHTML with BlogContent component */}
      <BlogContent content={post.content} />

      <CommentSection postId={id} />
    </article>
  )
}
