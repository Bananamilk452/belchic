import type { FavoriteProduct } from "@/lib/models/favorite.model";

export const USER_ID = "user-xyz-789";
export const PRODUCT_ID = "product-1";

export const mockFavoriteProduct: FavoriteProduct = {
  id: "product-1",
  title: "테스트 제품",
  handle: "test-product",
  description: "테스트 제품 설명",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  vendor: "테스트 브랜드",
  type: "의류",
  tags: ["신상품"],
  price: 50000,
  priceMin: 50000,
  priceMax: 60000,
  images: ["https://example.com/image1.jpg"],
  featuredImage: "https://example.com/image1.jpg",
  options: ["색상"],
  content: "상세 설명",
  variants: [
    {
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
    },
  ],
};

export const mockFavoriteProduct2: FavoriteProduct = {
  id: "product-2",
  title: "테스트 제품 2",
  handle: "test-product-2",
  description: "테스트 제품 2 설명",
  createdAt: new Date("2024-01-02"),
  updatedAt: new Date("2024-01-02"),
  vendor: "테스트 브랜드 2",
  type: "가방",
  tags: ["인기"],
  price: 80000,
  priceMin: 80000,
  priceMax: 80000,
  images: ["https://example.com/image2.jpg"],
  featuredImage: "https://example.com/image2.jpg",
  options: ["사이즈"],
  content: "상세 설명 2",
  variants: [
    {
      id: "variant-2",
      title: "FREE",
      option1: "FREE",
      option2: null,
      option3: null,
      sku: "SKU-002",
      featuredImage: null,
      name: "FREE",
      options: ["FREE"],
      price: 80000,
      productId: "product-2",
    },
  ],
};

export function createMockFavoriteItem(
  overrides?: Partial<{
    id: string;
    userId: string;
    productId: string;
    createdAt: Date;
    updatedAt: Date;
  }>,
) {
  return {
    id: "fav-1",
    userId: USER_ID,
    productId: PRODUCT_ID,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    ...overrides,
  };
}
