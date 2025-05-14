import { Skeleton } from "~/components/ui/skeleton";

export default function VehicleDetailLoading() {
  return (
    <div className="container py-6">
      {/* Breadcrumbs skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Main content skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left column - Thumbnails */}
        <div className="md:col-span-1 hidden md:flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] w-full rounded-md" />
          ))}
        </div>

        {/* Right column - Main image and details */}
        <div className="md:col-span-3 space-y-6">
          {/* Main image skeleton */}
          <Skeleton className="aspect-[16/10] w-full rounded-lg" />

          {/* Mobile thumbnails skeleton */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:hidden">
            {[...Array(5)].map((_, i) => (
              <Skeleton
                key={i}
                className="w-20 h-16 flex-shrink-0 rounded-md"
              />
            ))}
          </div>

          {/* Hero info section skeleton */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-8 w-3/4" />
            </div>
            <Skeleton className="h-6 w-1/2" />
          </div>

          {/* Price section skeleton */}
          <Skeleton className="h-8 w-32" />

          {/* Key details grid skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex justify-between py-2 border-b">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>

          {/* Stats skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-md" />
              ))}
            </div>
          </div>

          {/* Features skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-36" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* CTA skeleton */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Skeleton className="h-12 w-full sm:w-40" />
            <Skeleton className="h-12 w-full sm:w-40" />
          </div>
        </div>
      </div>
    </div>
  );
}
