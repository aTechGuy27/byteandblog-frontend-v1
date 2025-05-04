import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Welcome to ByteAndBlog
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              A modern platform for developers to share their knowledge, showcase their work, and connect with the
              community.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button asChild size="lg">
              <Link href="/blog">Read the Blog</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/portfolio">View Portfolio</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
