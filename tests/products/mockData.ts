import type { Product, Variant } from "@/lib/generated/prisma/client";
import type { GetProductsResult } from "@/lib/models/product.model";

export const mockProduct: Product = {
  id: "product-1",
  title: "테스트 제품",
  handle: "test-product",
  description: "테스트 제품 설명",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-15"),
  vendor: "테스트 브랜드",
  type: "의류",
  tags: ["신상품", "베스트"],
  price: 50000,
  priceMin: 50000,
  priceMax: 60000,
  images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
  featuredImage: "https://example.com/image1.jpg",
  options: ["색상", "사이즈"],
  content: "테스트 제품 상세 설명",
};

export const mockProduct2: Product = {
  id: "product-2",
  title: "두번째 제품",
  handle: "second-product",
  description: "두번째 제품 설명",
  createdAt: new Date("2024-02-01"),
  updatedAt: new Date("2024-02-15"),
  vendor: "다른 브랜드",
  type: "가방",
  tags: ["할인"],
  price: 30000,
  priceMin: 30000,
  priceMax: 30000,
  images: ["https://example.com/image3.jpg"],
  featuredImage: "https://example.com/image3.jpg",
  options: ["색상"],
  content: "두번째 제품 상세 설명",
};

export const mockVariant: Variant = {
  id: "variant-1",
  title: "블랙 / M",
  option1: "블랙",
  option2: "M",
  option3: null,
  sku: "SKU-001",
  featuredImage: "https://example.com/variant1.jpg",
  name: "블랙 / M",
  options: ["블랙", "M"],
  price: 50000,
  productId: "product-1",
};

export const mockVariant2: Variant = {
  id: "variant-2",
  title: "화이트 / L",
  option1: "화이트",
  option2: "L",
  option3: null,
  sku: "SKU-002",
  featuredImage: null,
  name: "화이트 / L",
  options: ["화이트", "L"],
  price: 55000,
  productId: "product-1",
};

export function createMockProduct(overrides?: Partial<Product>): Product {
  return {
    ...mockProduct,
    id: `product-${Math.random().toString(36).slice(2, 8)}`,
    handle: `test-product-${Math.random().toString(36).slice(2, 8)}`,
    ...overrides,
  };
}

export function createMockGetProductsResult(
  overrides?: Partial<GetProductsResult>,
): GetProductsResult {
  return {
    products: [mockProduct, mockProduct2].map((p, i) => ({
      ...p,
      variants: i === 0 ? [mockVariant, mockVariant2] : [],
    })),
    pagination: {
      page: 1,
      limit: 10,
      total: 20,
      totalPages: 2,
      hasNext: true,
      hasPrev: false,
    },
    ...overrides,
  };
}

export const mockProductsWithVariants: GetProductsResult["products"] = [
  { ...mockProduct, variants: [mockVariant, mockVariant2] },
  { ...mockProduct2, variants: [] },
];

export const mockPagination = {
  page: 1,
  limit: 10,
  total: 20,
  totalPages: 2,
  hasNext: true,
  hasPrev: false,
};
