"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useSession } from "@/hooks/useSession";
import { addToFavoriteAction, removeFromFavoriteAction } from "@/lib/actions/favorite.action";
import { FavoriteProduct, GetFavoriteResult } from "@/lib/models/favorite.model";
import { favoriteQueryOptions } from "@/lib/queries/favorite.query";

import type { Product, Variant } from "@/lib/generated/prisma/client";

type ProductItem = Product & { variants: Variant[] };

export function useFavorite(product: ProductItem) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const { data: favoriteData } = useQuery({
    ...favoriteQueryOptions(),
    enabled: !!session,
  });

  const isFavorite = favoriteData?.items.some((item) => item.id === product.id) ?? false;

  const addToFavoriteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const result = await addToFavoriteAction(productId);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["favorite"] });

      const previousFavorite = queryClient.getQueryData<GetFavoriteResult>(["favorite"]);

      queryClient.setQueryData<GetFavoriteResult>(["favorite"], (old) => {
        if (!old) return old;
        const alreadyExists = old.items.some((item) => item.id === productId);
        if (alreadyExists) return old;
        return { ...old, items: [...old.items, product as FavoriteProduct] };
      });

      return { previousFavorite };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousFavorite) {
        queryClient.setQueryData(["favorite"], context.previousFavorite);
      }
      toast.error("관심 상품에 추가하는 데 실패했습니다. 다시 시도해주세요.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite"] });
    },
  });

  const removeFromFavoriteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const result = await removeFromFavoriteAction(productId);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["favorite"] });

      const previousFavorite = queryClient.getQueryData<GetFavoriteResult>(["favorite"]);

      queryClient.setQueryData<GetFavoriteResult>(["favorite"], (old) => {
        if (!old) return old;
        return { ...old, items: old.items.filter((item) => item.id !== productId) };
      });

      return { previousFavorite };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousFavorite) {
        queryClient.setQueryData(["favorite"], context.previousFavorite);
      }
      toast.error("관심 상품에서 제거하는 데 실패했습니다. 다시 시도해주세요.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite"] });
    },
  });

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      router.push("/sign-in");
      return;
    }

    if (isFavorite) {
      removeFromFavoriteMutation.mutate(product.id);
    } else {
      addToFavoriteMutation.mutate(product.id);
    }
  };

  return { isFavorite, toggleFavorite };
}
