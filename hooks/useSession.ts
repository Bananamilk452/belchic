"use client";

import { useQuery } from "@tanstack/react-query";

import { getSessionAction } from "../lib/actions/auth.action";
import { wrapQueryFn } from "../lib/utils";

export const sessionQueryOptions = () => ({
  queryKey: ["session"] as const,
  queryFn: wrapQueryFn(() => getSessionAction()),
  staleTime: 1000 * 60 * 5,
});

export function useSession() {
  return useQuery(sessionQueryOptions());
}
