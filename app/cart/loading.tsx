import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";

export default function CartLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-[50px] py-[36px]">
      <div className="flex w-full items-center justify-between">
        <h1 className="mb-6 font-serif text-[40px]">카트</h1>

        <Link href="/" className="text-lg text-gray-600 underline">
          쇼핑 계속하기
        </Link>
      </div>

      <div className="border-b border-gray-200 pb-[40px]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 font-serif text-xs text-gray-600">
              <th className="pb-4 text-left font-light">제품</th>
              <th className="pb-4 pl-[60px] text-left font-light">수량</th>
              <th className="pb-4 pl-[40px] text-right font-light">총계</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(3)].map((_, index) => (
              <tr key={index}>
                <td>
                  <div className="flex items-start gap-6">
                    <div className="pt-[40px]">
                      <Skeleton className="h-[120px] w-[100px]" />
                    </div>

                    <div className="flex w-[550px] flex-col pt-[40px] pl-[40px]">
                      <div className="max-w-[300px] space-y-2">
                        <Skeleton className="h-[16px] w-[200px]" />
                        <Skeleton className="h-[14px] w-[60px]" />
                        <Skeleton className="h-[14px] w-[120px]" />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="pt-[40px] pl-[60px] align-top">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-[32px] w-[100px]" />
                    <Skeleton className="size-8" />
                  </div>
                </td>
                <td className="min-w-[300px] pt-[40px] pl-[40px] text-right align-top">
                  <Skeleton className="ml-auto h-[20px] w-[80px]" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex justify-end">
        <div className="flex flex-col items-end gap-5">
          <Skeleton className="h-[24px] w-[200px]" />
          <Skeleton className="h-[16px] w-[300px]" />
          <Skeleton className="h-[44px] w-[350px]" />
        </div>
      </div>
    </div>
  );
}
