import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createMockGetProductsResult, mockProductsWithVariants } from "../../products/mockData";

vi.mock("@/app/collections/[collection]/loading", () => ({
  default: () => <div data-testid="collection-loading">Loading...</div>,
}));

vi.mock("@/components/product/ProductCard", () => ({
  ProductCard: ({ product }: { product: { title: string } }) => (
    <div data-testid="product-card">{product.title}</div>
  ),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

import { useQuery } from "@tanstack/react-query";

import { CollectionProductList } from "@/components/collection/CollectionProductList";

const mockUseQuery = vi.mocked(useQuery);

const defaultOptions = { page: 1, limit: 32, sort: "date_desc" as const };

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

function renderCollectionList(ui: React.ReactElement, searchParams = "") {
  const queryClient = createTestQueryClient();
  return render(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <NuqsTestingAdapter searchParams={searchParams}>{children}</NuqsTestingAdapter>
      </QueryClientProvider>
    ),
  });
}

describe("CollectionProductList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("로딩 상태", () => {
    it("isPending이면 CollectionLoading을 렌더링한다", () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        isPending: true,
        isError: false,
        isSuccess: false,
      } as never);

      renderCollectionList(<CollectionProductList defaultOptions={defaultOptions} />);

      expect(screen.getByTestId("collection-loading")).toBeInTheDocument();
      expect(screen.queryByText("상품을 불러오는 중 오류가 발생했습니다.")).not.toBeInTheDocument();
      expect(screen.queryByTestId("product-card")).not.toBeInTheDocument();
    });
  });

  describe("에러 상태", () => {
    it("isError면 오류 메시지를 렌더링한다", () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        isPending: false,
        isError: true,
        isSuccess: false,
      } as never);

      renderCollectionList(<CollectionProductList defaultOptions={defaultOptions} />);

      expect(screen.getByText("상품을 불러오는 중 오류가 발생했습니다.")).toBeInTheDocument();
    });
  });

  describe("데이터 없음", () => {
    it("data가 undefined면 null을 반환한다", () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        isPending: false,
        isError: false,
        isSuccess: false,
      } as never);

      const { container } = renderCollectionList(
        <CollectionProductList defaultOptions={defaultOptions} />,
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe("정상 데이터", () => {
    it("제품 목록을 ProductCard로 렌더링한다", () => {
      const mockResult = createMockGetProductsResult({
        products: mockProductsWithVariants,
        pagination: {
          page: 1,
          limit: 32,
          total: 2,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      });

      mockUseQuery.mockReturnValue({
        data: mockResult,
        isPending: false,
        isError: false,
        isSuccess: true,
      } as never);

      renderCollectionList(<CollectionProductList defaultOptions={defaultOptions} />);

      const cards = screen.getAllByTestId("product-card");
      expect(cards).toHaveLength(2);
      expect(cards[0]).toHaveTextContent("테스트 제품");
      expect(cards[1]).toHaveTextContent("두번째 제품");
    });

    it("제품 총 개수를 표시한다", () => {
      const mockResult = createMockGetProductsResult({
        products: mockProductsWithVariants,
        pagination: {
          page: 1,
          limit: 32,
          total: 42,
          totalPages: 2,
          hasNext: true,
          hasPrev: false,
        },
      });

      mockUseQuery.mockReturnValue({
        data: mockResult,
        isPending: false,
        isError: false,
        isSuccess: true,
      } as never);

      renderCollectionList(<CollectionProductList defaultOptions={defaultOptions} />);

      expect(screen.getByText("42개 제품")).toBeInTheDocument();
    });

    it("hasNext가 true면 다음 페이지 버튼을 렌더링한다", () => {
      const mockResult = createMockGetProductsResult({
        products: mockProductsWithVariants,
        pagination: {
          page: 1,
          limit: 32,
          total: 50,
          totalPages: 2,
          hasNext: true,
          hasPrev: false,
        },
      });

      mockUseQuery.mockReturnValue({
        data: mockResult,
        isPending: false,
        isError: false,
        isSuccess: true,
      } as never);

      renderCollectionList(<CollectionProductList defaultOptions={defaultOptions} />);

      const links = screen.getAllByRole("link");
      const nextLink = links.find((link) => link.getAttribute("href")?.includes("page=2"));
      expect(nextLink).toBeTruthy();
    });

    it("hasPrev가 true면 이전 페이지 버튼을 렌더링한다", () => {
      const mockResult = createMockGetProductsResult({
        products: mockProductsWithVariants,
        pagination: {
          page: 2,
          limit: 32,
          total: 50,
          totalPages: 2,
          hasNext: false,
          hasPrev: true,
        },
      });

      mockUseQuery.mockReturnValue({
        data: mockResult,
        isPending: false,
        isError: false,
        isSuccess: true,
      } as never);

      renderCollectionList(<CollectionProductList defaultOptions={defaultOptions} />);

      const links = screen.getAllByRole("link");
      const prevLink = links.find((link) => link.getAttribute("href")?.includes("page=1"));
      expect(prevLink).toBeTruthy();
    });
  });
});
