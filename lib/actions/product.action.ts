"use server";

import {
  GetProductByHandleParamsSchema,
  GetProductsParamsSchema,
  GetRelatedProductsByHandleParamsSchema,
} from "../schemas/product.schema";
import {
  getProductByHandle,
  getProducts,
  getRelatedProductsByHandle,
} from "../services/product.service";
import { withAction } from "../utils";

import type {
  GetProductsResult,
  GetProductByHandleResult,
  GetRelatedProductsByHandleResult,
  GetRelatedProductsByHandleParams,
} from "../models/product.model";
import type { ActionPromise } from "../types/action.types";

export async function getProductsAction(params = {}): ActionPromise<GetProductsResult> {
  return withAction(async () => {
    const validatedParams = GetProductsParamsSchema.parse(params);
    return getProducts(validatedParams);
  });
}

export async function getProductByHandleAction(
  handle: string,
): ActionPromise<GetProductByHandleResult> {
  return withAction(async () => {
    const validatedParams = GetProductByHandleParamsSchema.parse({ handle });
    return getProductByHandle(decodeURIComponent(validatedParams.handle));
  });
}

export async function getRelatedProductsByHandleAction(
  params: GetRelatedProductsByHandleParams,
): ActionPromise<GetRelatedProductsByHandleResult> {
  return withAction(async () => {
    const validatedParams = GetRelatedProductsByHandleParamsSchema.parse(params);
    return getRelatedProductsByHandle({
      handle: decodeURIComponent(validatedParams.handle),
      limit: validatedParams.limit ?? 10,
    });
  });
}
