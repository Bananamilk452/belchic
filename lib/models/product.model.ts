import { Product, Variant } from "../generated/prisma/client";

export interface GetProductsParams {
  page?: number;
  limit?: number;
}

export interface GetProductsResult {
  products: (Product & { variants: Variant[] })[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface GetProductByHandleParams {
  handle: string;
}

export interface GetProductByHandleResult {
  product: Product & { variants: Variant[] };
}
