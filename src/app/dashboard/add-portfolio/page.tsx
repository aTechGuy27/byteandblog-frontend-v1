"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { createPortfolioItem } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ProtectedRoute } from "@/components/protected-route"

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  content: z.string().min(50, { message: "Content must be at least 50 characters" }),
  image: z.string().url({ message: "Please enter a valid URL" }),
  technologies: z.string().transform((val) => val.split(",").map((tech) => tech.trim())),
  features: z.string().transform((val) => val.split(",").map((feature) => feature.trim())),
  liveUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  githubUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  challenge: z.string().min(10, { message: "Challenge description must be at least 10 characters" }),
  solution: z.string().min(10, { message: "Solution description must be at least 10 characters" }),
})

export default function AddPortfolioPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      image: "",
      technologies: "",
      features: "",
      liveUrl: "",
      githubUrl: "",
      challenge: "",
      solution: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      await createPortfolioItem(values)

      toast({
        title: "Portfolio item created",
        description: "Your portfolio item has been created successfully.",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Failed to create portfolio item",
        description: "There was an error creating your portfolio item. Please try again.",
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
            <CardTitle>Add New Portfolio Item</CardTitle>
            <CardDescription>Create a new portfolio item to showcase your work</CardDescription>
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
                        <Input placeholder="Enter portfolio item title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter a short description" rows={2} {...field} />
                      </FormControl>
                      <FormDescription>A brief summary of your portfolio item</FormDescription>
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
                        <Textarea placeholder="Enter detailed content" rows={10} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="technologies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technologies</FormLabel>
                      <FormControl>
                        <Input placeholder="React, Node.js, MongoDB" {...field} />
                      </FormControl>
                      <FormDescription>Comma-separated list of technologies used</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="features"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Features</FormLabel>
                      <FormControl>
                        <Input placeholder="Authentication, Real-time updates, Responsive design" {...field} />
                      </FormControl>
                      <FormDescription>Comma-separated list of key features</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="liveUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Live URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormDescription>URL to the live project (optional)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="githubUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://github.com/username/repo" {...field} />
                        </FormControl>
                        <FormDescription>URL to the GitHub repository (optional)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="challenge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Challenge</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the challenge you faced" rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="solution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Solution</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your solution" rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Portfolio Item"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
