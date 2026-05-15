"use client";

import { useQuery } from "@tanstack/react-query";
import { useQueryState, parseAsInteger, parseAsStringLiteral } from "nuqs";

import CollectionLoading from "@/app/collections/[collection]/loading";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductListPagination } from "@/components/shared/ProductListPagination";
import { SORT_VALUES } from "@/lib/models/product.model";
import { productsQueryOptions } from "@/lib/queries/product.query";

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
      <ProductListPagination
        sort={sort}
        onSortChange={(newSort) => {
          handleSortChange(newSort as (typeof SORT_VALUES)[number]);
        }}
        pagination={data.pagination}
        page={page}
        onPageChange={setPage}
        defaultSort={defaultOptions.sort}
        total={data.pagination.total}
      >
        <div className="grid max-w-6xl grid-cols-2 items-start justify-center gap-4 px-4 md:grid-cols-4">
          {data.products.map((product) => (
            <div key={product.id} className="col-span-1 w-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </ProductListPagination>
    </div>
  );
}
