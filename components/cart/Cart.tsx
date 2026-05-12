"use client";

import { SuspenseQuery } from "@suspensive/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

import { Button } from "../ui/button";
import { CartItem } from "./CartItem";
import { updateCartItemAction, removeFromCartAction } from "@/lib/actions/cart.action";
import { GetCartResult } from "@/lib/models/cart.model";
import { cartQueryOptions } from "@/lib/queries/cart.query";
import { parsePrice } from "@/lib/utils";

export function Cart() {
  const queryClient = useQueryClient();
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const result = await updateCartItemAction(id, quantity);
      return result;
    },
    onMutate: async ({ id, quantity }) => {
      setLoadingItemId(id);

      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousData = queryClient.getQueryData(cartQueryOptions().queryKey);

      queryClient.setQueryData(cartQueryOptions().queryKey, (old: GetCartResult | undefined) => {
        if (!old) return old;

        return {
          ...old,
          items: old.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
          total: old.items.reduce((sum: number, item) => {
            const itemTotal =
              item.id === id ? quantity * item.variant.price : item.quantity * item.variant.price;
            return sum + itemTotal;
          }, 0),
        };
      });

      return { previousData };
    },
    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(cartQueryOptions().queryKey, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setLoadingItemId(null);
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await removeFromCartAction(id);
      return result;
    },
    onMutate: async (id) => {
      setLoadingItemId(id);

      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousData = queryClient.getQueryData(cartQueryOptions().queryKey);

      queryClient.setQueryData(cartQueryOptions().queryKey, (old: GetCartResult | undefined) => {
        if (!old) return old;

        const newItems = old.items.filter((item) => item.id !== id);
        const removedItem = old.items.find((item) => item.id === id);

        return {
          ...old,
          items: newItems,
          total: removedItem
            ? old.total - removedItem.quantity * removedItem.variant.price
            : old.total,
        };
      });

      return { previousData };
    },
    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(cartQueryOptions().queryKey, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setLoadingItemId(null);
    },
  });

  return (
    <SuspenseQuery {...cartQueryOptions()}>
      {({ data }) => (
        <div className="mx-auto max-w-7xl px-[50px] py-[36px]">
          <div className="flex w-full items-center justify-between">
            <h1 className="mb-6 font-serif text-[40px]">카트</h1>

            <Link href="/" className="text-lg text-gray-600 underline">
              쇼핑 계속하기
            </Link>
          </div>

          {data.items.length === 0 ? (
            <p className="py-12 text-center text-gray-500">카트가 비어있습니다.</p>
          ) : (
            <>
              <div className="border-b border-gray-200 pb-[40px]">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 font-serif text-xs text-gray-600">
                      <th className="pb-4 text-left font-light">제품</th>
                      <th className="pb-4 pl-[60px] text-left font-light">수량</th>
                      <th className="pb-4 pl-[40px] text-right font-light">총계</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        isLoading={loadingItemId === item.id}
                        onQuantityChange={(id, quantity) =>
                          updateQuantityMutation.mutate({ id, quantity })
                        }
                        onRemove={(id) => removeItemMutation.mutate(id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 flex justify-end">
                <div className="flex flex-col items-end gap-5">
                  <div className="font-serif text-lg">
                    소계: <span className="font-sans font-light">{parsePrice(data.total)}</span>
                  </div>

                  <p className="text-sm text-gray-600">
                    세금이 포함된 가격입니다. 결제 시 <span className="underline">배송료</span> 가
                    계산됨
                  </p>

                  <Button size="lg" className="w-[350px] px-12">
                    결제하기
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </SuspenseQuery>
  );
}
