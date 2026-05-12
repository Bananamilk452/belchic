import { Cart, Product, Variant } from "../generated/prisma/client";

export type CartWithDetails = Omit<Cart, "variant"> & {
  variant: Omit<Variant, "product"> & {
    product: Product;
  };
};

export type GetCartResult = {
  items: CartWithDetails[];
  total: number;
};

export type AddToCartResult = {
  item: CartWithDetails;
};

export type UpdateCartItemResult = {
  item: CartWithDetails;
};

export type RemoveFromCartResult = {
  success: boolean;
};

export type MergeGuestCartResult = {
  mergedCount: number;
};
