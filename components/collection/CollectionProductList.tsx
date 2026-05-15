"use client";

import { useQuery } from "@tanstack/react-query";
import { useQueryState, parseAsInteger, parseAsStringLiteral } from "nuqs";

import CollectionLoading from "@/app/collections/[collection]/loading";
import { ProductCard } from "@/components/product/ProductCard";
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
import { productsQueryOptions } from "@/lib/queries/product.query";
import { ProductSortSchema } from "@/lib/schemas/product.schema";
import { SORT_OPTIONS, SORT_VALUES } from "@/lib/types/search.types";
import { buildHref, getPaginationItems } from "@/lib/utils";

import type { GetProductsParams } from "@/lib/models/product.model";

export function CollectionProductList({ defaultOptions }: { defaultOptions: GetProductsParams }) {
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(defaultOptions.page ?? 1),
  );
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsStringLiteral(SORT_VALUES).withDefault(defaultOptions.sort ?? "date_desc"),
  );

  const { data, isPending, isError } = useQuery(
    productsQueryOptions({ ...defaultOptions, page, sort }),
  );

  if (isPending) {
    return <CollectionLoading />;
  }

  if (isError) {
    return (
      <div className="w-full p-4">
        <span>상품을 불러오는 중 오류가 발생했습니다.</span>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const handleSortChange = (newSort: (typeof SORT_VALUES)[number]) => {
    setSort(newSort);
    setPage(1);
  };

  return (
    <div className="flex w-full flex-col items-center py-10">
      <div className="mb-4 flex w-full max-w-6xl items-center justify-end px-4">
        <span className="h-7.5 py-1 text-sm text-muted-foreground">정렬 기준 : </span>
        <NativeSelect
          value={sort}
          onChange={(e) => {
            const parsed = ProductSortSchema.safeParse(e.target.value);
            if (parsed.success) {
              handleSortChange(parsed.data);
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
        <span className="text-sm text-muted-foreground">{data.pagination.total}개 제품</span>
      </div>
      <div className="grid max-w-6xl grid-cols-2 items-start justify-center gap-4 px-4 md:grid-cols-4">
        {data.products.map((product) => (
          <div key={product.id} className="col-span-1 w-full">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      <Pagination className="mt-8">
        <PaginationContent>
          {data.pagination.hasPrev && (
            <PaginationItem>
              <PaginationPrevious
                href={buildHref(page - 1, sort, defaultOptions.sort)}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page - 1);
                }}
              />
            </PaginationItem>
          )}
          {getPaginationItems(page, data.pagination.totalPages).map((item, index) => (
            <PaginationItem key={`${item}-${index}`}>
              {item === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={buildHref(item as number, sort, defaultOptions.sort)}
                  isActive={item === page}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(item as number);
                  }}
                >
                  {item}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          {data.pagination.hasNext && (
            <PaginationItem>
              <PaginationNext
                href={buildHref(page + 1, sort, defaultOptions.sort)}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
