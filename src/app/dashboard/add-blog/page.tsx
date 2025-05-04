"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { createBlogPost } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ProtectedRoute } from "@/components/protected-route"

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  excerpt: z.string().min(10, { message: "Excerpt must be at least 10 characters" }),
  content: z.string().min(50, { message: "Content must be at least 50 characters" }),
  coverImage: z.string().url({ message: "Please enter a valid URL" }),
  coverImageCaption: z.string().optional(),
  tags: z.string().transform((val) => val.split(",").map((tag) => tag.trim())),
})

export default function AddBlogPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      coverImage: "",
      coverImageCaption: "",
      tags: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      await createBlogPost(values)

      toast({
        title: "Blog post created",
        description: "Your blog post has been created successfully.",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Failed to create blog post",
        description: "There was an error creating your blog post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="container mx-auto px-4 py-12">
        <Card className="mx-auto max-w-3xl">
          <CardHeader>
            <CardTitle>Add New Blog Post</CardTitle>
            <CardDescription>Create a new blog post to share with your audience</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter blog post title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter a short excerpt" rows={2} {...field} />
                      </FormControl>
                      <FormDescription>A brief summary of your blog post</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter blog post content" rows={10} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coverImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coverImageCaption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image Caption</FormLabel>
                      <FormControl>
                        <Input placeholder="Image caption (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="React, JavaScript, Web Development" {...field} />
                      </FormControl>
                      <FormDescription>Comma-separated list of tags</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Blog Post"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
