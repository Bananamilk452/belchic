import { vi } from "vitest";

import { CART_SESSION_COOKIE } from "../cart/mockData";

export function createMockCookieStore(sessionId?: string) {
  const store = new Map<string, string>();
  if (sessionId) {
    store.set(CART_SESSION_COOKIE, sessionId);
  }

  return {
    get: vi.fn((name: string) => {
      const value = store.get(name);
      return value ? { name, value } : undefined;
    }),
    set: vi.fn((name: string, value: string) => {
      store.set(name, value);
    }),
    delete: vi.fn((name: string) => {
      store.delete(name);
    }),
  };
}
