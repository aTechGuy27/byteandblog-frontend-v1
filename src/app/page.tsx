import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Code, FileText, Briefcase, MessageSquare } from "lucide-react"
import { FeaturedPosts } from "@/components/featured-posts"
import { PortfolioHighlights } from "@/components/portfolio-highlights"
import { NewsSection } from "@/components/news-section"

export default function Home() {
  return (
    <div>
      {/* Hero Section - Simplified with background image */}
      <section className="relative h-[500px] flex items-center">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/welcome.png?height=500&width=1200"
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay to ensure text is readable */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Content */}
        <div className="container relative z-10 mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Welcome to ByteAndBlog</h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-primary hover:bg-gray-100">
              <Link href="/blog">Explore Blog</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
              <Link href="/portfolio">View Portfolio</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <FeaturedPosts />

      {/* Portfolio Highlights Section */}
      <PortfolioHighlights />

      {/* News Section */}
      <NewsSection />

      {/* Features Section */}
      <section className="py-16 bg-brand-light dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="card-hover-effect border-t-4 border-brand-primary">
              <CardContent className="pt-6">
                <div className="mb-4 bg-brand-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-brand-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Technical Blog</h3>
                <p className="text-muted-foreground">
                  In-depth articles and tutorials on the latest technologies and development practices.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover-effect border-t-4 border-brand-secondary">
              <CardContent className="pt-6">
                <div className="mb-4 bg-brand-secondary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-brand-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Portfolio Showcase</h3>
                <p className="text-muted-foreground">
                  Display your projects with detailed case studies and technical specifications.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover-effect border-t-4 border-brand-accent">
              <CardContent className="pt-6">
                <div className="mb-4 bg-brand-accent/10 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                  <Code className="h-6 w-6 text-brand-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2">Code Snippets</h3>
                <p className="text-muted-foreground">
                  Share useful code snippets and solutions to common programming challenges.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover-effect border-t-4 border-brand-dark">
              <CardContent className="pt-6">
                <div className="mb-4 bg-brand-dark/10 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-brand-dark" />
                </div>
                <h3 className="text-xl font-bold mb-2">Community</h3>
                <p className="text-muted-foreground">
                  Engage with other developers through comments and discussions on articles.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Share Your Knowledge?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join our community of developers and start sharing your expertise and projects today.
            </p>
            <Button size="lg" asChild className="bg-brand-primary hover:bg-brand-primary/90">
              <Link href="/auth/register">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
