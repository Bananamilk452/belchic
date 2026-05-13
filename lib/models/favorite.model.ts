import { Product, Variant } from "../generated/prisma/client";

export type FavoriteProduct = Product & { variants: Variant[] };

export type GetFavoriteResult = {
  items: FavoriteProduct[];
};

export type AddToFavoriteResult = {
  item: FavoriteProduct;
};

export type RemoveFromFavoriteResult = {
  success: boolean;
};
