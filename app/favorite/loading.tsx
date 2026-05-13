import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-[50px] py-[36px]">
      <div className="flex w-full items-center justify-between">
        <h1 className="mb-6 font-serif text-[40px]">관심 상품</h1>

        <Skeleton className="h-6 w-32" />
      </div>

      <div className="grid grid-cols-2 items-start justify-center gap-4 md:grid-cols-4">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="col-span-1 w-full">
            <Skeleton className="h-[300px] w-full" />
            <div className="py-[17px]">
              <Skeleton className="h-[14px] w-[80%]" />
              <Skeleton className="mt-1 h-[16px] w-[40%]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
