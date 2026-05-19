import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <div className="flex w-full flex-col items-center py-10">
      <h2 className="py-4 font-serif text-2xl">검색 결과</h2>

      <div className="mt-[30px] mb-[35px] flex w-full justify-center px-12">
        <Skeleton className="h-[45px] w-[768px]" />
      </div>

      <div className="mb-4 flex w-full max-w-6xl items-center justify-end gap-2 px-4">
        <Skeleton className="h-[30px] w-[100px]" />
        <Skeleton className="h-[30px] w-[120px]" />
      </div>
      <div className="grid w-full max-w-6xl grid-cols-2 items-start justify-center gap-4 px-4 md:grid-cols-4">
        {[...Array(12)].map((_, index) => (
          <div key={index} className="col-span-1 w-full">
            <Skeleton className="aspect-265/400 w-full" />
            <div className="py-[17px]">
              <Skeleton className="h-[14px] w-[80%]" />
              <Skeleton className="mt-1 h-[16px] w-[40%]" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center gap-1">
        <Skeleton className="h-[40px] w-[40px]" />
        <Skeleton className="h-[40px] w-[40px]" />
        <Skeleton className="h-[40px] w-[40px]" />
        <Skeleton className="h-[40px] w-[40px]" />
        <Skeleton className="h-[40px] w-[40px]" />
        <Skeleton className="h-[40px] w-[40px]" />
      </div>
    </div>
  );
}
