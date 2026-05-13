import { Suspense } from "@suspensive/react";
import { dehydrate } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Favorite } from "@/components/favorite/Favorite";
import { getQueryClient } from "@/hooks/getQueryClient";
import { auth } from "@/lib/auth";
import { favoriteQueryOptions } from "@/lib/queries/favorite.query";

export default async function FavoritePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(favoriteQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <Favorite />
      </Suspense>
    </HydrationBoundary>
  );
}
