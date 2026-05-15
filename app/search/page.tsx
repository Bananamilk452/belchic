import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { SearchProductList } from "@/components/search/SearchProductList";
import { getQueryClient } from "@/hooks/getQueryClient";
import { productsQueryOptions } from "@/lib/queries/product.query";
import { ProductSortSchema } from "@/lib/schemas/product.schema";

import type { GetProductsParams } from "@/lib/models/product.model";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; sort?: string }>;
}) {
  const { q: queryParam, page: pageParam, sort: sortParam } = await searchParams;

  const sortParsed = sortParam ? ProductSortSchema.safeParse(sortParam) : undefined;

  const defaultOptions: GetProductsParams = {
    page: 1,
    limit: 32,
    sort: sortParsed?.success ? sortParsed.data : "date_desc",
    ...(pageParam ? { page: Number(pageParam) || 1 } : {}),
    ...(queryParam ? { q: queryParam } : {}),
  };

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(productsQueryOptions(defaultOptions));

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SearchProductList defaultOptions={defaultOptions} />
      </HydrationBoundary>
    </div>
  );
}
