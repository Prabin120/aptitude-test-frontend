import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="h-screen flex flex-row dark items-center justify-center space-x-5">
        <div className="h-1/2 w-1/3 rounded-xl">
            <Skeleton className="h-full w-full rounded-xl" />
        </div>
      <div className="h-1/2 w-1/3 space-y-3">
        <Skeleton className="h-4 w-full rounded-xl" />
        <Skeleton className="h-4 w-full rounded-xl" />
        <Skeleton className="h-4 w-full rounded-xl" />
        <Skeleton className="h-4 w-full rounded-xl" />
        <Skeleton className="h-4 w-full rounded-xl" />
        <Skeleton className="h-4 w-full rounded-xl" />
        <Skeleton className="h-4 w-full rounded-xl" />
        <Skeleton className="h-4 w-full rounded-xl" />
        <Skeleton className="h-4 w-full rounded-xl" />
        <Skeleton className="h-4 w-full rounded-xl" />
      </div>
    </div>
  )
}
