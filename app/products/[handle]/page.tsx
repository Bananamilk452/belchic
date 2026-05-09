import { Suspense } from "@suspensive/react";
import { dehydrate } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";

import { ProductDetail } from "@/components/product/ProductDetail";
import { getQueryClient } from "@/hooks/getQueryClient";
import {
  productByHandleQueryOptions,
  relatedProductsByHandleQueryOptions,
} from "@/lib/queries/product.query";

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;

  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(productByHandleQueryOptions(handle)),
    queryClient.prefetchQuery(relatedProductsByHandleQueryOptions(handle)),
  ]);

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>Loading...</div>}>
          <ProductDetail handle={handle} />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
