import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";

import { CollectionProductList } from "@/components/collection/CollectionProductList";
import { getQueryClient } from "@/hooks/getQueryClient";
import { productsQueryOptions } from "@/lib/queries/product.query";
import { ProductSortSchema } from "@/lib/schemas/product.schema";

import type { GetProductsParams } from "@/lib/models/product.model";

const COLLECTION_DEFAULT_OPTIONS: Record<string, Partial<GetProductsParams>> = {
  belchic: { sort: "date_desc" },
  new: { sort: "date_desc" },
};

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}) {
  const { collection } = await params;
  const mapped = COLLECTION_DEFAULT_OPTIONS[collection];

  if (!mapped) {
    notFound();
  }

  const defaultOptions: GetProductsParams = {
    page: 1,
    limit: 32,
    ...mapped,
  };

  const { page: pageParam, sort: sortParam } = await searchParams;

  const options: GetProductsParams = {
    ...defaultOptions,
    ...(pageParam ? { page: Number(pageParam) || 1 } : {}),
    ...(sortParam && ProductSortSchema.safeParse(sortParam).success
      ? { sort: ProductSortSchema.parse(sortParam) }
      : {}),
  };

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(productsQueryOptions(options));

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CollectionProductList defaultOptions={options} />
      </HydrationBoundary>
    </div>
  );
}
