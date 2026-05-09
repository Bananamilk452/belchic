"use server";

import { getProducts } from "../services/product.service";

import type { GetProductsParams } from "../models/product.model";

export async function getProductsAction(params: GetProductsParams = {}) {
  return getProducts(params);
}
