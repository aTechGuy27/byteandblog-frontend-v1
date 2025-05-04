"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { PlusCircle, Edit, FileText, Briefcase } from "lucide-react"
import { fetchBlogPosts, fetchDashboardStats, fetchRecentComments } from "@/lib/api"
import { format } from "date-fns"

// Define interface for dashboard stats
interface DashboardStats {
  totalPosts: number
  totalComments: number
  totalPortfolioItems: number
  totalUploads: number
  recentPostsGrowth: number
  recentCommentsGrowth: number
  recentPortfolioGrowth: number
  recentUploadsGrowth: number
}

// Default stats for fallback
const defaultStats: DashboardStats = {
  totalPosts: 0,
  totalComments: 0,
  totalPortfolioItems: 0,
  totalUploads: 0,
  recentPostsGrowth: 0,
  recentCommentsGrowth: 0,
  recentPortfolioGrowth: 0,
  recentUploadsGrowth: 0,
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [posts, setPosts] = useState<any[]>([]) // Initialize as empty array
  const [comments, setComments] = useState<any[]>([]) // Initialize as empty array
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const [isLoadingComments, setIsLoadingComments] = useState(true)
  const [stats, setStats] = useState<DashboardStats>(defaultStats)
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoadingPosts(true)
      try {
        const response = await fetchBlogPosts(0, 5)
        console.log("Posts response:", response)

        // Handle different response formats
        if (Array.isArray(response)) {
          setPosts(response)
        } else if (response && response.content && Array.isArray(response.content)) {
          setPosts(response.content)
        } else if (response && response._embedded && response._embedded.blogPostDtoList) {
          setPosts(response._embedded.blogPostDtoList)
        } else {
          console.error("Unexpected posts response format:", response)
          setPosts([])
        }
      } catch (error) {
        console.error("Failed to fetch blog posts:", error)
        setPosts([]) // Ensure posts is always an array even on error
      } finally {
        setIsLoadingPosts(false)
      }
    }

    const loadComments = async () => {
      setIsLoadingComments(true)
      try {
        const response = await fetchRecentComments(5)
        console.log("Comments response:", response)

        // Handle different response formats
        if (Array.isArray(response)) {
          setComments(response)
        } else if (response && response.content && Array.isArray(response.content)) {
          setComments(response.content)
        } else if (response && response._embedded && response._embedded.commentDtoList) {
          setComments(response._embedded.commentDtoList)
        } else {
          console.error("Unexpected comments response format:", response)
          setComments([])
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error)
        setComments([]) // Ensure comments is always an array even on error
      } finally {
        setIsLoadingComments(false)
      }
    }

    const loadStats = async () => {
      setIsLoadingStats(true)
      try {
        const statsData = await fetchDashboardStats()
        setStats(statsData)
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
        // Keep the default stats on error
      } finally {
        setIsLoadingStats(false)
      }
    }

    if (isAuthenticated) {
      loadPosts()
      loadComments()
      loadStats()
    }
  }, [isAuthenticated])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-12 w-1/4 mb-6" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} className="h-32 rounded-lg" />
            ))}
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalPosts}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.recentPostsGrowth > 0 ? "+" : ""}
                  {stats.recentPostsGrowth} from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalComments}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.recentCommentsGrowth > 0 ? "+" : ""}
                  {stats.recentCommentsGrowth} from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Items</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalPortfolioItems}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.recentPortfolioGrowth > 0 ? "+" : ""}
                  {stats.recentPortfolioGrowth} from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Uploads</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalUploads}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.recentUploadsGrowth > 0 ? "+" : ""}
                  {stats.recentUploadsGrowth} from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
            <CardDescription>Create and manage your content</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button asChild className="w-full">
              <Link href="/dashboard/add-blog">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Blog Post
              </Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/dashboard/add-portfolio">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Portfolio Item
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Manage your content</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button variant="outline" asChild className="justify-start">
              <Link href="/blog">
                <FileText className="mr-2 h-4 w-4" />
                View All Blog Posts
              </Link>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <Link href="/portfolio">
                <Briefcase className="mr-2 h-4 w-4" />
                View All Portfolio Items
              </Link>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <Link href="/dashboard/profile">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent" className="mt-8">
        <TabsList>
          <TabsTrigger value="recent">Recent Posts</TabsTrigger>
          <TabsTrigger value="comments">Recent Comments</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Posts</CardTitle>
              <CardDescription>Your most recent blog posts</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPosts ? (
                <div className="space-y-4">
                  {Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                    ))}
                </div>
              ) : posts && posts.length > 0 ? (
                <div className="space-y-4">
                  {posts.map((post: any) => (
                    <div key={post.id} className="flex items-center justify-between">
                      <div>
                        <Link href={`/blog/${post.id}`} className="hover:underline">
                          <h3 className="font-medium">{post.title}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {post.createdAt ? format(new Date(post.createdAt), "MMM d, yyyy") : "No date"}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {post.commentCount || post.comments?.length || 0} comments
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No posts found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="comments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Comments</CardTitle>
              <CardDescription>Recent comments on your posts</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingComments ? (
                <div className="space-y-4">
                  {Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                    ))}
                </div>
              ) : comments && comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment: any) => (
                    <div key={comment.id} className="flex items-start space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {comment.author?.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium">{comment.author?.name || "Anonymous"}</p>
                          <span className="mx-2 text-muted-foreground">•</span>
                          <Link href={`/blog/${comment.postId}`} className="text-sm text-primary hover:underline">
                            View Post
                          </Link>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{comment.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {comment.createdAt ? format(new Date(comment.createdAt), "MMM d, yyyy") : "No date"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No comments found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
