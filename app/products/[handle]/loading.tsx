import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="mx-auto p-4 lg:w-3/4 xl:w-1/2 xl:p-6">
      <div className="flex flex-col gap-12 md:grid md:grid-cols-2">
        <div className="flex flex-col">
          <Skeleton className="h-96 w-full" />
          <div className="flex py-6">
            <div className="p-4">
              <Skeleton className="size-5" />
            </div>
            <div className="flex min-w-0 gap-4 overflow-x-auto">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="size-16 shrink-0" />
              ))}
            </div>
            <div className="p-4">
              <Skeleton className="size-5" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start">
          <Skeleton className="mb-4 h-8 w-3/4" />
          <Skeleton className="mb-4 h-6 w-1/2" />
          <div className="mb-4 flex flex-col gap-4">
            <div>
              <Skeleton className="mb-2 h-4 w-1/4" />
              <div className="flex flex-wrap gap-2">
                {[...Array(3)].map((_, index) => (
                  <Skeleton key={index} className="h-8 w-16 rounded-full" />
                ))}
              </div>
            </div>
          </div>
          <Skeleton className="h-7 w-1/2 py-4" />
          <Skeleton className="h-4 w-full text-sm" />
          <div className="flex items-center gap-1 py-4">
            <Skeleton className="size-4 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-12 w-32" />
          <Skeleton className="mt-6 h-12 w-full" />
          <div className="mt-6 space-y-3">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Skeleton className="mb-4 h-8 w-32" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex flex-col gap-2">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
