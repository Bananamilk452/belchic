"use server";

import { headers } from "next/headers";

import { auth } from "../auth";
import { withAction } from "../utils";

import type { ActionPromise } from "../types/action.types";

export async function getSessionAction(): ActionPromise<{ userId: string } | null> {
  return withAction(async () => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) return null;

    return { userId: session.user.id };
  });
}
