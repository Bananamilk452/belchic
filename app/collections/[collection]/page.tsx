import { Suspense } from "@suspensive/react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { CollectionProductList } from "@/components/collection/CollectionProductList";
import { getQueryClient } from "@/hooks/getQueryClient";
import { productsQueryOptions } from "@/lib/queries/product.query";

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { collection } = await params;
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(productsQueryOptions({ page, limit: 32 }));

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>Loading...</div>}>
          <CollectionProductList collection={collection} />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
