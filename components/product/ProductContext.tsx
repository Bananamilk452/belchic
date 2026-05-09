"use client";

import { createContext, useContext, useState } from "react";

import { Variant } from "@/lib/generated/prisma/client";

import type { GetProductByHandleResult } from "@/lib/models/product.model";

type ProductContextValue = {
  product: GetProductByHandleResult["product"];
  selectedImageIndex: number;
  setSelectedImageIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedImage: string;
  selectedVariantIndex: number;
  setSelectedVariantIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedVariant: Variant;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
};

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

export function ProductProvider({
  children,
  product,
}: {
  children: React.ReactNode;
  product: GetProductByHandleResult["product"];
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(
    product.images.findIndex((img) => img === product.variants[0].featuredImage) ?? 0,
  );
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const selectedImage = product.images[selectedImageIndex];
  const selectedVariant = product.variants[selectedVariantIndex];
  const [quantity, setQuantity] = useState(1);

  return (
    <ProductContext.Provider
      value={{
        product,
        selectedImageIndex,
        setSelectedImageIndex,
        selectedImage,
        selectedVariantIndex,
        setSelectedVariantIndex,
        selectedVariant,
        quantity,
        setQuantity,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within ProductProvider");
  }
  return context;
}
