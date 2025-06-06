import BlogPostPageClient from "./BlogPostPageClient"

// This function tells Next.js which routes to pre-render at build time
export async function generateStaticParams() {
  try {
    // For static export, we'll pre-render a few common IDs
    // You can adjust this based on your needs
    return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }]
  } catch (error) {
    console.error("Error generating static params for blog posts:", error)
    // Return at least one ID to prevent build errors
    return [{ id: "1" }]
  }
}

export default function BlogPostPage() {
  return <BlogPostPageClient />
}
