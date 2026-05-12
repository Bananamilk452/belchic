import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware } from "better-auth/api";
import { cookies } from "next/headers";

import { prisma } from "./prisma";
import { mergeGuestCart } from "./services/cart.service";

const CART_SESSION_ID = "cart_session_id";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/sign-in/email")) {
        const session = ctx.context.newSession;
        if (session) {
          const cookieStore = await cookies();
          const cartSessionId = cookieStore.get(CART_SESSION_ID)?.value;

          if (cartSessionId) {
            try {
              await mergeGuestCart(cartSessionId, session.user.id);
              cookieStore.delete(CART_SESSION_ID);
            } catch (error) {
              console.error("Failed to merge guest cart:", error);
            }
          }
        }
      }
    }),
  },
});
