"use server";

import { User } from "better-auth";
import { headers } from "next/headers";

import { auth } from "../auth";
import { withAction } from "../utils";

import type { ActionPromise } from "../types/action.types";

export async function getSessionAction(): ActionPromise<User | null> {
  return withAction(async () => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) return null;

    return session.user;
  });
}
