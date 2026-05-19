"use client";

import { useSearchParams } from "next/navigation";

import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SORT_OPTIONS } from "@/lib/models/product.model";
import { ProductSortSchema } from "@/lib/schemas/product.schema";
import { buildHref, getPaginationItems } from "@/lib/utils";

import type { GetProductsResult } from "@/lib/models/product.model";

type ProductListPaginationProps = {
  sort: string;
  onSortChange: (sort: string) => void;
  pagination: GetProductsResult["pagination"];
  page: number;
  onPageChange: (page: number) => void;
  defaultSort?: string;
  total: number;
  children: React.ReactNode;
};

export function ProductListPagination({
  sort,
  onSortChange,
  pagination,
  page,
  onPageChange,
  defaultSort,
  total,
  children,
}: ProductListPaginationProps) {
  const searchParams = useSearchParams();

  return (
    <>
      <div className="mb-4 flex w-full max-w-6xl items-center justify-end px-4">
        <span className="h-7.5 py-1 text-sm text-muted-foreground">정렬 기준 : </span>
        <NativeSelect
          value={sort}
          onChange={(e) => {
            const parsed = ProductSortSchema.safeParse(e.target.value);
            if (parsed.success) {
              onSortChange(parsed.data);
            }
          }}
          className="**:rounded-none **:bg-transparent"
          size="sm"
        >
          {SORT_OPTIONS.map((opt) => (
            <NativeSelectOption key={opt.value} value={opt.value}>
              {opt.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        <span className="text-sm text-muted-foreground">{total}개 제품</span>
      </div>

      {children}

      <Pagination className="mt-8">
        <PaginationContent>
          {pagination.hasPrev && (
            <PaginationItem>
              <PaginationPrevious
                href={buildHref(searchParams, page - 1, sort, defaultSort)}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page - 1);
                }}
              />
            </PaginationItem>
          )}
          {getPaginationItems(page, pagination.totalPages).map((item, index) => (
            <PaginationItem key={`${item}-${index}`}>
              {item === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={buildHref(searchParams, item as number, sort, defaultSort)}
                  isActive={item === page}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(item as number);
                  }}
                >
                  {item}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          {pagination.hasNext && (
            <PaginationItem>
              <PaginationNext
                href={buildHref(searchParams, page + 1, sort, defaultSort)}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page + 1);
                }}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </>
  );
}
