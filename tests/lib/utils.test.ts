import { describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({
  toast: { error: vi.fn() },
}));

import { toast } from "sonner";

import { wrapQueryFn, withAction } from "@/lib/utils";

describe("wrapQueryFn", () => {
  it("action이 성공하면 data를 반환한다", async () => {
    const actionFn = vi.fn().mockResolvedValue({ success: true, data: { result: "ok" } });
    const wrapped = wrapQueryFn(actionFn);

    const result = await wrapped();

    expect(result).toEqual({ result: "ok" });
  });

  it("action이 실패하면 toast.error를 호출하고 throw한다", async () => {
    const actionFn = vi.fn().mockResolvedValue({ success: false, error: "에러 발생" });
    const wrapped = wrapQueryFn(actionFn);

    await expect(wrapped()).rejects.toThrow("에러 발생");
    expect(toast.error).toHaveBeenCalledWith("에러 발생");
  });
});

describe("withAction", () => {
  it("fn이 성공하면 { success: true, data }를 반환한다", async () => {
    const fn = vi.fn().mockResolvedValue("result");

    const result = await withAction(fn);

    expect(result).toEqual({ success: true, data: "result" });
  });

  it("fn이 Error를 throw하면 { success: false, error }를 반환한다", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("에러"));

    const result = await withAction(fn);

    expect(result).toEqual({ success: false, error: "에러" });
  });
});
