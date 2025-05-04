import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Skeleton className="h-12 w-1/4 mb-6" />
      <div className="grid gap-8 md:grid-cols-3">
        <Skeleton className="h-80 rounded-lg" />
        <Skeleton className="h-80 md:col-span-2 rounded-lg" />
        <Skeleton className="h-60 md:col-span-3 rounded-lg" />
      </div>
    </div>
  )
}
