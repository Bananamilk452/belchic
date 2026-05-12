import type { CartWithDetails } from "@/lib/models/cart.model";

export const mockProduct = {
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
  images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
  featuredImage: "https://example.com/image1.jpg",
  options: ["사이즈"],
  content: "테스트 제품 상세 설명",
};

export const mockVariant = {
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
  product: mockProduct,
};

export const mockVariant2 = {
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
  product: mockProduct,
};

export function createMockCartItem(overrides?: Partial<CartWithDetails>): CartWithDetails {
  return {
    id: "cart-1",
    userId: null,
    variantId: "variant-1",
    quantity: 2,
    sessionId: "session-123",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    variant: mockVariant,
    ...overrides,
  } as CartWithDetails;
}

export const mockCartItems: CartWithDetails[] = [
  createMockCartItem({
    id: "cart-1",
    variantId: "variant-1",
    quantity: 2,
    variant: mockVariant,
  }),
  createMockCartItem({
    id: "cart-2",
    variantId: "variant-2",
    quantity: 1,
    variant: mockVariant2,
  }),
];

export const SESSION_ID = "session-abc-123";
export const USER_ID = "user-xyz-789";
export const CART_SESSION_COOKIE = "cart_session_id";
