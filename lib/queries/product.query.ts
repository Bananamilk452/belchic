import { queryOptions } from "@tanstack/react-query";

import { getProductByHandleAction, getProductsAction } from "../actions/product.action";

import type { GetProductsParams } from "../models/product.model";

export const productsQueryOptions = (params: GetProductsParams = { page: 1, limit: 10 }) =>
  queryOptions({
    queryKey: ["products", params],
    queryFn: () => getProductsAction(params),
  });

export const productByHandleQueryOptions = (handle: string) =>
  queryOptions({
    queryKey: ["product", handle],
    queryFn: () => getProductByHandleAction(handle),
  });
