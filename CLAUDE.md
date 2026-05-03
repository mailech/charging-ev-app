# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Active design docs

- [`docs/admin-plan.md`](docs/admin-plan.md) — phased plan for admin-controlled systems (RBAC + shared types foundations, Inquiry, Dashboard, Blog with rich editor + media). Read before starting work on any of those features.

## Stack & layout

Bun workspaces monorepo. Four workspaces:
- `shared/` — Zod schemas + TS types shared across server/admin/client. Imported as `@trio/shared` (or `@trio/shared/auth`, `@trio/shared/inquiry`). Source-only — no build step. Path alias resolves `.ts` files directly.
- `client/` — public marketing/booking site, Vite + React + TS + Tailwind + React Router + TanStack Query, host port 5173.
- `admin/` — admin console, same stack as `client/`, host port 5174. Auth via httpOnly cookie (`admin_session`) + CSRF (`csrf_token` cookie + `x-csrf-token` header). Login at `/login`, protected routes wrapped in `AuthGuard` which calls `GET /api/auth/me`.
- `server/` — Express + TS + Prisma + Postgres + Zod + pino, host port 8001.

Postgres runs via Docker Compose on host port 5433.

All workspaces use `@/*` → `src/*`. Server adds `@trio/shared` → workspace root.

## Common commands

Run from repo root unless noted.

```bash
# Dev — Docker (recommended): brings up db, server (8001), client (5173), admin (5174)
docker compose up -d
docker compose logs -f server     # tail one service
docker compose down -v            # tear down + wipe pgdata + node_modules volumes

# Dev — local (no Docker; needs a Postgres reachable from server/.env)
bun install
bun run dev:server                # bun --watch src/index.ts
bun run dev:client                # vite (5173)
bun run dev:admin                 # vite (5174)

# Build / lint / typecheck
bun run build                     # client + admin + server
bun run lint                      # all three workspaces
bun --cwd server run typecheck
bun --cwd client run typecheck
bun --cwd admin run typecheck

# Prisma — run from host (uses localhost:5433 from server/.env)
cd server && bunx prisma migrate dev --name <name>
bun --cwd server run db:generate
bun --cwd server run db:studio
bun --cwd server run db:seed

# Prisma — inside container (uses compose-network host db:5432)
docker compose exec \
  -e DATABASE_URL="postgresql://postgres:postgres@db:5432/trio?schema=public" \
  server bunx prisma migrate dev --name <name>

# Production images (different targets in same Dockerfiles)
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.yml -f docker-compose.prod.yml exec \
  -e DATABASE_URL="$DATABASE_URL" server bunx prisma migrate deploy
```

No test runner is wired up yet — there is no `test` script in either workspace.

## Server architecture

Entry: `server/src/index.ts` → `createApp()` in `server/src/app.ts`. The app builder wires helmet, cors (origin = `env.CORS_ORIGIN`), `express.json` (1mb cap), `pino-http`, mounts `GET /health`, then mounts the API at `/api` via `server/src/routes/index.ts`, then `notFoundHandler` and `errorHandler` last.

Feature code lives under `server/src/modules/<feature>/` as four files: `*.routes.ts`, `*.controller.ts`, `*.service.ts`, `*.schema.ts`. Schemas re-export from `@trio/shared/<feature>` so server and frontends share one Zod source of truth — never duplicate inquiry/auth schemas in the server module. Add a new feature by creating a module folder in this shape and mounting its router in `server/src/routes/index.ts`.

Routing layout:
- `/api/auth/*` — public auth (`csrf`, `register`, `login`, `logout`, `me`).
- `/api/inquiries` — public submit (POST only, rate-limited).
- `/api/admin/*` — guarded sub-router. Order: `requireAuth` → `requireAdmin` → `requireCsrf`. Sub-routers: `inquiries`, `users`. Add new admin features here.

Cross-cutting pieces:

- `config/env.ts` — Zod-validated env. `JWT_SECRET` ≥16 chars (fail-fast). `CORS_ORIGIN` parsed as comma-separated list → `string[]`.
- `middleware/auth.ts` — `requireAuth` reads JWT from `admin_session` cookie first, then `Authorization: Bearer` fallback. Attaches `req.user` (`{ sub, email, role }`).
- `middleware/requireAdmin.ts` — chain after `requireAuth`. 403 if `role !== 'ADMIN'`.
- `middleware/csrf.ts` — `issueCsrfToken` (mounted on `/api/auth/csrf`) sets non-httpOnly `csrf_token` cookie and returns the same value in JSON. `requireCsrf` enforces double-submit on mutating methods **only when the cookie is present** — Bearer-token clients without the cookie are exempt, since CSRF requires browser cookie auto-attachment.
- `middleware/validate.ts` — Zod request validation helper.
- `middleware/error.ts` — central error handler. `ZodError` → 400; `HttpError` (from `utils/http-error.ts`) → its `status`/`message`/`details`; else → 500. Throw `HttpError` factories (`unauthorized`, `forbidden`, `notFound`, `badRequest`, `conflict`).
- `lib/prisma.ts` — singleton Prisma client. Import from here.
- `lib/logger.ts` — pino instance. `pino-http` wired in `app.ts`.
- `utils/jwt.ts` — sign/verify. Payload: `{ sub, email, role }`.

Auth controller sets `admin_session` cookie only when the authenticated user has `role: ADMIN` — the public client app continues to use the JSON `token` for Bearer auth via localStorage.

Prisma schema is `server/prisma/schema.prisma` — `User` (with `Role`), `Inquiry`, `InquiryNote`. Seed via `bun --cwd server run db:seed` with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` (≥12 chars) env vars (idempotent upsert with `role: ADMIN`).

## Client architecture

Public marketing site. Entry: `client/src/main.tsx` wraps `RouterProvider` in `QueryClientProvider`, mounts `<Toaster />` (sonner) + `ReactQueryDevtools`.

- `routes/index.tsx` — React Router config. Pages in `routes/`. Layout is `RootLayout.tsx`.
- `routes/Contact.tsx` — public inquiry submit form (react-hook-form + zod resolver against `publicInquirySubmitSchema` from `@trio/shared/inquiry`). Honeypot field rendered visually-hidden via offscreen positioning.
- `lib/queryClient.ts` — shared TanStack Query client.
- `lib/axios.ts` — axios instance pointed at `import.meta.env.VITE_API_URL`. Bearer-token auth via localStorage `auth_token`.

## Admin architecture

Admin console. Entry: `admin/src/main.tsx` mounts `<Toaster />` + RQ devtools.

- `routes/index.tsx` — top-level routes. `/login` (lazy) is unguarded. All other routes are wrapped in `<AuthGuard>` + `<AdminShell>` (Sidebar + Topbar + `<Outlet />`). Each page is `React.lazy`-loaded and Suspense-wrapped.
- `routes/nav.ts` — single source of truth for sidebar nav items (label + path + icon). Add a new admin section by appending here and registering its lazy route.
- `components/ui/` — headless-ish primitives (`Button`, `Card`, `Badge`, `Input`, `Textarea`, `Select`, `Modal`, `Drawer`, `Skeleton`, `EmptyState`). Variants via `class-variance-authority`. Extend by adding a sibling file + exporting from `ui/index.ts`. Do **not** pull in a heavy UI kit — these primitives are intentionally tiny.
- `components/data/DataTable.tsx` — generic over `ColumnDef<T>[]` (TanStack Table). Use for any list page. `CursorPager` pairs with cursor-paginated APIs.
- `components/forms/` — `Form` wraps react-hook-form + zod resolver; `Field` renders label + error from form context. Compose for any page form.
- `components/layout/` — `AdminShell`, `Sidebar`, `Topbar`, `PageHeader`. New pages should always start with `<PageHeader title=... />` for visual consistency.
- `lib/axios.ts` — axios with `withCredentials: true`. Request interceptor primes the CSRF cookie via `GET /api/auth/csrf` on first mutating call, then sets `x-csrf-token` header from the cookie. 401s redirect to `/login` (except when already on `/login`).
- `features/<name>/` per-feature folder: `api.ts` (typed wrappers), `hooks.ts` (TanStack Query hooks + `inquiryKeys` query-key factory), `pages/` (route components), feature-specific small components alongside. Mirror this layout for new admin features.
- Mutation pattern: define a `useXMutation` hook with optimistic updates via `onMutate` / `onError` rollback / `onSettled` invalidate (see `useUpdateInquiryMutation`).

`VITE_API_URL` is **baked into the bundle at build time**, so prod images must be rebuilt when it changes.

## Docker specifics that affect dev work

- Compose maps Postgres to host **5433** (container 5432) to avoid colliding with a host-installed Postgres. `server/.env` (host) uses `localhost:5433`; inside the compose network services use `db:5432`. This is why Prisma from the host vs from inside the container needs different `DATABASE_URL`s.
- Source is bind-mounted (`./shared → /app/shared`, `./client → /app/client`, `./admin → /app/admin`, `./server → /app/server`) for hot reload. `node_modules` lives in named volumes (`client_node_modules`, `admin_node_modules`, `server_node_modules`) per workspace — after changing any `package.json`, run `docker compose down -v && docker compose up -d --build` to rebuild cleanly. `shared/` has no `node_modules` volume because it has no own deps beyond zod (resolved via root install).
- Dev containers run as **root** because `/app` is bind-mounted from a uid-1000 host but the image's `app` user is uid 1001. The prod target runs as non-root `app`.
- All three app Dockerfiles share an identical `deps` stage that copies the root `package.json` + `bun.lock` and **all** workspace `package.json`s (`shared/`, `client/`, `admin/`, `server/`) before `bun install --frozen-lockfile`. When adding a new workspace, every Dockerfile's `deps` stage must be updated to copy its `package.json`, otherwise `--frozen-lockfile` will fail. `client/` and `admin/` build stages also `COPY shared ./shared` so Vite's path alias can resolve at build time.
- Server Dockerfile stages: `base → deps → prisma → dev | build | prod`. `client/` and `admin/` Dockerfiles: `deps → dev | build | prod` where the prod stage is nginx serving `dist/`.
- Server `CORS_ORIGIN` is parsed as a comma-separated list (see `server/src/config/env.ts`). Dev compose sets it to `http://localhost:5173,http://localhost:5174`. For prod, set the env var to a comma list of all approved origins.
- Prod compose maps `client` to host **80** and `admin` to host **`${ADMIN_PORT:-81}`** (both are nginx containers internally on 80).

## Conventions

- 4-space indent, single quotes, semicolons, 100-char width (see `.prettierrc` / `.editorconfig`).
- Feature code uses the module quartet (`routes`/`controller`/`service`/`schema`) — keep new server features in that shape.
- Schemas live in `shared/src/<feature>.ts`; server module's `*.schema.ts` is a **re-export only** (don't re-declare types).
- Throw `HttpError` from `utils/http-error.ts` rather than handling responses inline; let the global error handler format them.
- Server validation goes through Zod schemas + the `validate` middleware, never ad-hoc `if`s on `req.body`.
- Admin pages: always `React.lazy`-imported. Use `DataTable` for lists, `Drawer` for detail panels overlaying a list, `Modal` for short confirmations. Reuse `PageHeader`. Don't introduce new UI primitives until the same pattern is needed in 3+ places.
- TanStack Query: define a `xKeys = { all, list(params), detail(id) }` factory in `features/<x>/hooks.ts` so query-key invalidations stay typo-free.
