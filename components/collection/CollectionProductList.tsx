"use client";

import { useQuery } from "@tanstack/react-query";
import { useQueryState, parseAsInteger } from "nuqs";

import { ProductCard } from "@/components/product/ProductCard";
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

function getPaginationItems(current: number, total: number): (number | string)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 3) {
    return [1, 2, 3, 4, "ellipsis", total];
  }

  if (current >= total - 2) {
    return [1, "ellipsis", total - 3, total - 2, total - 1, total];
  }

  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}

export function CollectionProductList({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  collection,
}: {
  collection: string;
}) {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const { data, isPending } = useQuery(productsQueryOptions({ page, limit: 32 }));

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="flex w-full flex-col items-center py-10">
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
                href={`?page=${page - 1}`}
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
                  href={`?page=${item}`}
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
                href={`?page=${page + 1}`}
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
