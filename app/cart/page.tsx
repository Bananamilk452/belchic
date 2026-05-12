import { Suspense } from "@suspensive/react";
import { dehydrate } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";

import { Cart } from "@/components/cart/Cart";
import { getQueryClient } from "@/hooks/getQueryClient";
import { cartQueryOptions } from "@/lib/queries/cart.query";

export default async function CartPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(cartQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <Cart />
      </Suspense>
    </HydrationBoundary>
  );
}
