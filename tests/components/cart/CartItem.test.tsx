import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { createMockCartItem } from "../../cart/mockData";
import { renderWithProviders } from "../../helpers/renderWithProviders";
import { CartItem } from "@/components/cart/CartItem";

describe("CartItem", () => {
  const defaultProps = {
    item: createMockCartItem({
      id: "cart-1",
      quantity: 2,
      variant: {
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
        product: {
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
          options: ["사이즈"],
          content: "상세 설명",
        },
      },
    }),
    onQuantityChange: vi.fn(),
    onRemove: vi.fn(),
  };

  it("제품 이름을 렌더링한다", () => {
    renderWithProviders(<CartItem {...defaultProps} />);
    expect(screen.getByText("테스트 제품")).toBeInTheDocument();
  });

  it("variant 제목을 렌더링한다", () => {
    renderWithProviders(<CartItem {...defaultProps} />);
    expect(screen.getByText("블랙 / M")).toBeInTheDocument();
  });

  it("개별 가격을 렌더링한다", () => {
    renderWithProviders(<CartItem {...defaultProps} />);
    expect(screen.getByText("₩500")).toBeInTheDocument();
  });

  it("총 가격(수량 * 단가)을 렌더링한다", () => {
    renderWithProviders(<CartItem {...defaultProps} />);
    expect(screen.getByText("₩1,000")).toBeInTheDocument();
  });

  it("제품 이미지를 렌더링한다", () => {
    renderWithProviders(<CartItem {...defaultProps} />);
    const img = screen.getByAltText("테스트 제품");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/variant1.jpg");
  });

  it("삭제 버튼이 있다", () => {
    renderWithProviders(<CartItem {...defaultProps} />);
    const buttons = screen.getAllByRole("button");
    const trashButton = buttons.find((btn) => btn.querySelector("svg.lucide-trash-2"));
    expect(trashButton).toBeTruthy();
  });

  it("isLoading일 때 총 가격 대신 Spinner가 표시된다", () => {
    renderWithProviders(<CartItem {...defaultProps} isLoading={true} />);
    expect(screen.queryByText("₩100,000")).not.toBeInTheDocument();
  });
});
