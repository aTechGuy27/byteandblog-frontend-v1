import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface PortfolioCardProps {
  item: {
    id: number
    title: string
    description?: string
    summary?: string
    image?: string
    coverImage?: string
    technologies?: string[]
    skills?: string[]
  }
}

export function PortfolioCard({ item }: PortfolioCardProps) {
  // Use either technologies or skills array, depending on what's available
  const techTags = item.technologies || item.skills || []

  // Use either description or summary, depending on what's available
  const description = item.description || item.summary || ""

  // Use either image or coverImage, depending on what's available
  // If no valid image is provided, use a placeholder
  const imageUrl = item.image || item.coverImage || "/placeholder.svg?height=300&width=600"

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link href={`/portfolio/${item.id}`}>
        <div className="relative aspect-video overflow-hidden">
          {/* Use next/image with unoptimized for external URLs if needed */}
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={item.title}
            fill
            className="object-cover transition-transform hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            // Add error handling to fall back to a placeholder if the image fails to load
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=300&width=600"
            }}
          />
        </div>
      </Link>
      <CardHeader className="p-4">
        <Link href={`/portfolio/${item.id}`} className="hover:underline">
          <h3 className="text-xl font-bold">{item.title}</h3>
        </Link>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="line-clamp-3 text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 p-4 pt-0">
        {techTags.slice(0, 5).map((tech, index) => (
          <Badge key={index} variant="outline" className="px-2 py-0 text-xs">
            {tech}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  )
}
