import { queryOptions } from "@tanstack/react-query";

import {
  getProductByHandleAction,
  getProductsAction,
  getRelatedProductsByHandleAction,
} from "../actions/product.action";
import { wrapQueryFn } from "../utils";

import type { GetProductsParams } from "../models/product.model";

export const productsQueryOptions = (params: GetProductsParams = { page: 1, limit: 10 }) =>
  queryOptions({
    queryKey: ["products", params],
    queryFn: wrapQueryFn(() => getProductsAction(params)),
  });

export const productByHandleQueryOptions = (handle: string) =>
  queryOptions({
    queryKey: ["product", handle],
    queryFn: wrapQueryFn(() => getProductByHandleAction(handle)),
  });

export const relatedProductsByHandleQueryOptions = (handle: string, limit = 10) =>
  queryOptions({
    queryKey: ["relatedProducts", handle, limit],
    queryFn: wrapQueryFn(() => getRelatedProductsByHandleAction({ handle, limit })),
  });
