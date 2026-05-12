import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";

import { CollectionProductList } from "@/components/collection/CollectionProductList";
import { getQueryClient } from "@/hooks/getQueryClient";
import { productsQueryOptions } from "@/lib/queries/product.query";

import type { GetProductsParams } from "@/lib/models/product.model";

const COLLECTION_DEFAULT_OPTIONS: Record<string, Partial<GetProductsParams>> = {
  belchic: { sort: "date_desc" },
};

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ page?: string }>;
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

  const { page: pageParam } = await searchParams;
  if (pageParam) {
    defaultOptions.page = Number(pageParam) || 1;
  }

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(productsQueryOptions(defaultOptions));

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CollectionProductList defaultOptions={defaultOptions} />
      </HydrationBoundary>
    </div>
  );
}
