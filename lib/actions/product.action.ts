"use server";

import {
  getProductByHandle,
  getProducts,
  getRelatedProductsByHandle,
} from "../services/product.service";

import type { GetProductsParams, GetRelatedProductsByHandleParams } from "../models/product.model";

export async function getProductsAction(params: GetProductsParams = {}) {
  return getProducts(params);
}

export async function getProductByHandleAction(handle: string) {
  return getProductByHandle(decodeURIComponent(handle));
}

export async function getRelatedProductsByHandleAction(params: GetRelatedProductsByHandleParams) {
  return getRelatedProductsByHandle({
    handle: decodeURIComponent(params.handle),
    limit: params.limit ?? 10,
  });
}
