<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# belchic.shop Clone (Portfolio Demo)

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Database**: PostgreSQL with Prisma (custom adapter: @prisma/adapter-pg)
- **Auth**: better-auth (email/password)
- **State**: TanStack Query + @suspensive/react
- **UI**: Tailwind CSS v4, shadcn/ui (radix-luma), lucide-react
- **Payment**: Stripe (test mode) - to be implemented

## Key Commands

```bash
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm typecheck        # Run TypeScript checks (tsc --noEmit)
pnpm lint             # Run ESLint
pnpm format           # Format code with oxfmt (auto-runs on PR)
pnpm prisma generate  # Generate Prisma client (auto-runs on postinstall)
pnpm prisma migrate   # Run database migrations
```

**Order when changing code**: `format` → `typecheck` → `lint`

## Architecture Pattern (Layered)

When adding new features, follow this pattern:

1. `lib/schemas/` → Zod schemas (use Korean locale: `z.config(ko())`)
2. `lib/models/` → TypeScript types (infer from schemas)
3. `lib/services/` → Business logic + Prisma queries
4. `lib/actions/` → Server actions (`"use server"`) wrapping services with `withAction`
5. `lib/queries/` → TanStack Query options wrapping actions with `wrapQueryFn`
6. `components/` → UI components

## Data Fetching Pattern

- **Server**: Use `getQueryClient()` from `hooks/getQueryClient.ts`, prefetch queries, pass to `<HydrationBoundary>`
- **Client**: Use `<SuspenseQuery>` from `@suspensive/react-query` with query options
- **Query Options**: Always use query options from `lib/queries/` (e.g., `productsQueryOptions()`)

## Prisma Configuration

- Custom adapter: `@prisma/adapter-pg` (not default)
- Client output: `lib/generated/prisma` (custom path)
- Schema location: `prisma/schema.prisma`
- Config: `prisma.config.ts` (uses DATABASE_URL from env)
- After schema changes: `pnpm prisma generate` + `pnpm prisma migrate`

## Authentication

- Server: `lib/auth.ts` → `auth` instance with Prisma adapter
- Client: `lib/auth-client.ts` → `authClient` for React hooks
- API route: `app/api/auth/[...all]/route.ts` → `toNextJsHandler(auth)`
- Email/password enabled by default

## Styling & UI

- Tailwind CSS v4 with CSS imports (no tailwind.config.js)
- OKLCH color space
- shadcn/ui style: `radix-luma`, baseColor: `neutral`
- Custom icons in `resources/icons/` (lucide-react compatible)
- Font: Outfit (Latin) + Pretendard (Korean) - local font variable
- CN helper: `lib/utils.ts` (`cn(...inputs)`)

## Code Quality

- **Formatter**: oxfmt (not Prettier) - auto-formats imports and Tailwind classes
- **ESLint**: next.config (typescript + core-web-vitals) with custom ignores
- **CI**: Auto-format workflow runs on push to main/develop
- **Comments**: Only add comments for complex logic or unavoidable tricks (Korean only)

## File Structure

- `app/` - Next.js App Router pages
- `components/ui/` - shadcn/ui components
- `components/` - Feature components (e.g., `product/ProductCard.tsx`)
- `lib/schemas/` - Zod validation schemas
- `lib/models/` - TypeScript types
- `lib/services/` - Business logic
- `lib/actions/` - Server actions
- `lib/queries/` - TanStack Query options
- `lib/generated/prisma/` - Generated Prisma client (ignored in git)
- `prisma/migrations/` - Database migrations
- `resources/icons/` - Custom icons

## TypeScript Aliases

`@/*` maps to project root (configured in tsconfig.json)
