"use client";

import { debounce } from "es-toolkit";
import { Trash2Icon } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";

import { Button } from "../ui/button";
import { Quantity } from "../ui/quantity";
import { Spinner } from "../ui/Spinner";
import { parsePrice } from "@/lib/utils";

import type { CartWithDetails } from "@/lib/models/cart.model";

type CartItemProps = {
  item: CartWithDetails;
  isLoading?: boolean;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
};

export function CartItem({ item, isLoading, onQuantityChange, onRemove }: CartItemProps) {
  const debouncedOnQuantityChange = useMemo(
    () => debounce((id: string, quantity: number) => onQuantityChange(id, quantity), 500),
    [onQuantityChange],
  );

  const handleQuantityChange = useCallback(
    (quantity: number) => {
      debouncedOnQuantityChange(item.id, quantity);
    },
    [item.id, debouncedOnQuantityChange],
  );

  const handleRemove = () => {
    onRemove(item.id);
  };

  useEffect(() => {
    return () => {
      debouncedOnQuantityChange.cancel();
    };
  }, [debouncedOnQuantityChange]);

  return (
    <tr>
      <td>
        <div className="flex items-start gap-6">
          <img
            src={item.variant.featuredImage ?? item.variant.product.featuredImage}
            alt={item.variant.product.title}
            className="w-[100px] object-cover pt-[40px]"
          />
          <div className="flex w-[550px] flex-col pt-[40px] pl-[40px]">
            <div className="max-w-[300px]">
              <h3 className=" font-serif text-base">{item.variant.product.title}</h3>
              <p className="mt-1.5 text-sm text-gray-500">{parsePrice(item.variant.price)}</p>
              {item.variant.option1 && (
                <p className="mt-1.5 text-sm text-gray-500">
                  {item.variant.product.options[0]}: {item.variant.option1}
                </p>
              )}
              {item.variant.option2 && (
                <p className="mt-1.5 text-sm text-gray-500">
                  {item.variant.product.options[1]}: {item.variant.option2}
                </p>
              )}
              {item.variant.option3 && (
                <p className="mt-1.5 text-sm text-gray-500">
                  {item.variant.product.options[2]}: {item.variant.option3}
                </p>
              )}
            </div>
          </div>
        </div>
      </td>
      <td className="pt-[40px] pl-[60px] align-top">
        <div className="flex items-center gap-3">
          <Quantity value={item.quantity} onChange={handleQuantityChange} disabled={isLoading} />
          <Button variant="ghost" size="icon" onClick={handleRemove} disabled={isLoading}>
            <Trash2Icon className="size-4" />
          </Button>
        </div>
      </td>
      <td className="min-w-[300px] pt-[40px] pl-[40px] text-right align-top">
        {isLoading ? (
          <Spinner className="mx-auto size-6" />
        ) : (
          <p className="font-light">{parsePrice(item.quantity * item.variant.price)}</p>
        )}
      </td>
    </tr>
  );
}
