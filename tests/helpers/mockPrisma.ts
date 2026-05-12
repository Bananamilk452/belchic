import { vi } from "vitest";

export function createMockPrisma() {
  return {
    cart: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    product: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
    variant: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
  };
}

export type MockPrisma = ReturnType<typeof createMockPrisma>;
