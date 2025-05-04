"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchComments, addComment, deleteComment } from "@/lib/api"

const commentSchema = z.object({
  content: z.string().min(3, { message: "Comment must be at least 3 characters" }),
})

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formattedDates, setFormattedDates] = useState<Record<string, string>>({})

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  })

  const loadComments = async () => {
    setIsLoading(true)
    try {
      const data = await fetchComments(postId)
      setComments(data)

      // Format dates on the client side
      const dates: Record<string, string> = {}
      data.forEach((comment: any) => {
        if (comment.createdAt) {
          dates[comment.id] = format(new Date(comment.createdAt), "MMM d, yyyy")
        }
      })
      setFormattedDates(dates)
    } catch (error) {
      console.error("Failed to fetch comments:", error)
      toast({
        title: "Error loading comments",
        description: "There was a problem loading the comments. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadComments()
  }, [postId])

  const onSubmit = async (values: z.infer<typeof commentSchema>) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to post a comment.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await addComment({
        content: values.content,
        postId: Number.parseInt(postId),
      })

      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      })

      form.reset()
      loadComments()
    } catch (error) {
      toast({
        title: "Failed to add comment",
        description: "There was an error adding your comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId)

      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted successfully.",
      })

      loadComments()
    } catch (error) {
      toast({
        title: "Failed to delete comment",
        description: "There was an error deleting your comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="mt-12">
      <h2 className="mb-6 text-2xl font-bold">Comments</h2>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Leave a comment</CardTitle>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <Textarea
              placeholder="Write your comment here..."
              {...form.register("content")}
              disabled={!isAuthenticated || isSubmitting}
            />
            {form.formState.errors.content && (
              <p className="mt-2 text-sm text-destructive">{form.formState.errors.content.message}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={!isAuthenticated || isSubmitting}>
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
            {!isAuthenticated && (
              <p className="ml-4 text-sm text-muted-foreground">
                Please{" "}
                <a href="/auth/login" className="text-primary hover:underline">
                  log in
                </a>{" "}
                to post a comment.
              </p>
            )}
          </CardFooter>
        </form>
      </Card>

      {isLoading ? (
        <div className="space-y-4">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="flex space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment: any) => (
            <div key={comment.id} className="flex space-x-4">
              <Avatar>
                <AvatarImage src={comment.author?.profileImage || "/placeholder.svg?height=40&width=40"} />
                <AvatarFallback>{comment.author?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{comment.author?.name || "Anonymous"}</h3>
                  <span className="text-xs text-muted-foreground">{formattedDates[comment.id] || ""}</span>
                </div>
                <p className="mt-1 text-muted-foreground">{comment.content}</p>
                {user && comment.author?.id === user.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 h-auto p-0 text-xs text-muted-foreground hover:text-destructive"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No comments yet. Be the first to comment!</p>
      )}
    </div>
  )
}
