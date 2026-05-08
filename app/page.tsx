import { Suspense } from "@suspensive/react";
import { dehydrate } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";

import { ProductList } from "@/components/product/ProductList";
import { getQueryClient } from "@/hooks/getQueryClient";
import { productsQueryOptions } from "@/lib/queries/product.query";

export default async function Home() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(productsQueryOptions());

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>Loading...</div>}>
          <ProductList />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
