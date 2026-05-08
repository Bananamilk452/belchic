"use server";

import { getProductByHandle, getProducts } from "../services/product.service";

import type { GetProductsParams } from "../models/product.model";

export async function getProductsAction(params: GetProductsParams = {}) {
  return getProducts(params);
}

export async function getProductByHandleAction(handle: string) {
  return getProductByHandle(handle);
}
