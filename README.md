# trio-ev

Monorepo: Vite + React client, Express + Prisma server, Postgres. Bun + Docker Compose.

## Stack

| Side    | Tools                                                                  |
| ------- | ---------------------------------------------------------------------- |
| Client  | Vite, React, TypeScript, Tailwind, React Router, TanStack Query, axios |
| Server  | Node + Express, TypeScript, Prisma, Postgres, JWT, Zod, pino           |
| Tooling | Bun, Docker Compose, ESLint, Prettier                                  |

## Layout

```
.
├── client/                   Vite React TS app
│   ├── Dockerfile            Multi-stage: deps → dev / build / prod (nginx)
│   ├── nginx.conf            Static SPA config used by the prod stage
│   └── .dockerignore
├── server/                   Express TS API
│   ├── Dockerfile            Multi-stage: deps → prisma → dev / build / prod (Bun runtime)
│   └── .dockerignore
├── docker-compose.yml        Dev stack: builds `dev` targets, bind-mounts source
├── docker-compose.prod.yml   Prod override: builds `prod` targets, no bind mounts
└── package.json              Bun workspaces root
```

## Exposed ports

| Service          | Host port | Container port | URL                                              |
| ---------------- | --------- | -------------- | ------------------------------------------------ |
| client           | 5173      | 5173           | http://localhost:5173                            |
| server           | 8001      | 8001           | http://localhost:8001                            |
| db (Postgres 16) | 5433      | 5432           | postgres://postgres:postgres@localhost:5433/trio |

Postgres is mapped to **5433** on the host to avoid clashing with a host-installed Postgres on 5432. Inside the compose network, services still talk to `db:5432`.

## Prerequisites

- Docker Engine 24+ and Docker Compose v2 (`docker compose version`)
- Bun >= 1.3 (only needed for local dev outside Docker, or to run Prisma from the host)
- Free host ports: **5173, 8001, 5433**

---

## Docker — step by step

### 1. Clone and enter the repo

```bash
git clone <repo-url> trio-ev
cd trio-ev
```

### 2. Create the `.env` files

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Edit `server/.env` and replace `JWT_SECRET` with a long random string (>= 16 chars). For local dev the example value is fine; for any shared environment, generate one:

```bash
openssl rand -hex 32
```

### 3. Build the dev images (first time, or after Dockerfile / package.json changes)

```bash
docker compose build
```

This runs `client/Dockerfile` and `server/Dockerfile` up to their `dev` target:

| Stage                  | What it does                                                                                                                      |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `base`                 | Bun + alpine + non-root `app` user                                                                                                |
| `deps`                 | Copies root `package.json`, `bun.lock`, and each workspace's `package.json`, then `bun install --frozen-lockfile` (cache-mounted) |
| `prisma` (server only) | Copies `prisma/` and runs `bunx prisma generate`                                                                                  |
| `dev`                  | Final dev image — source is **bind-mounted at runtime**, so this layer just sets workdir + CMD                                    |

### 4. Start the stack

```bash
docker compose up -d
```

What happens:

- `db` container starts first; healthcheck waits until Postgres accepts connections.
- `server` container starts: runs `bun install` (cheap with cache) → `bunx prisma generate` → `bun --watch src/index.ts`. Container has its own healthcheck on `/health`.
- `client` container starts: runs `bun install` → `bun run dev --host 0.0.0.0`.
- Source is bind-mounted (`./client → /app/client`, `./server → /app/server`), so file edits hot-reload inside the container.
- `node_modules` for each workspace lives in a named volume (`client_node_modules`, `server_node_modules`) so host and container do not collide.

First boot takes ~30–90 seconds while Bun installs dependencies.

### 5. Watch the logs (optional)

```bash
docker compose logs -f             # all services
docker compose logs -f server      # just server
docker compose logs -f client      # just client
```

When the server is ready you see something like:

```
Server listening on http://localhost:8001
```

### 6. Run the initial Prisma migration

The first time only, create the schema:

```bash
cd server
bunx prisma migrate dev --name init
cd ..
```

This runs from the **host** against the exposed Postgres on `localhost:5433` (URL already in `server/.env`). It creates `server/prisma/migrations/<timestamp>_init/`.

For later schema changes, repeat with a different name:

```bash
cd server && bunx prisma migrate dev --name add_posts && cd ..
```

If you prefer to run Prisma inside the container, override the URL so it uses the compose network:

```bash
docker compose exec \
  -e DATABASE_URL="postgresql://postgres:postgres@db:5432/trio?schema=public" \
  server bunx prisma migrate dev --name init
```

### 7. Verify everything is exposed

```bash
curl -s http://localhost:8001/health
# {"status":"ok","uptime":12.34}

curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5173
# 200
```

Then open http://localhost:5173 in a browser. The Home page renders the result of `GET /health` via TanStack Query.

### 8. Smoke test the auth endpoints

```bash
# Register
curl -s -X POST http://localhost:8001/api/auth/register \
  -H 'content-type: application/json' \
  -d '{"email":"a@b.com","password":"password123","name":"A"}'

# Login (capture token)
TOKEN=$(curl -s -X POST http://localhost:8001/api/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"a@b.com","password":"password123"}' | jq -r .token)

# Me
curl -s http://localhost:8001/api/auth/me -H "authorization: Bearer $TOKEN"
```

### 9. Common operations

```bash
docker compose ps                  # status of all services
docker compose restart server      # bounce server only
docker compose exec server sh      # shell into server container
docker compose exec db psql -U postgres -d trio   # psql shell
```

### 10. Tear down

```bash
docker compose down                # stop containers, keep DB volume + node_modules
docker compose down -v             # also wipe pgdata + node_modules volumes
```

### 11. Rebuild after dependency changes

If `client/package.json` or `server/package.json` change, the named-volume `node_modules` may be stale. Force a clean install:

```bash
docker compose down -v
docker compose up -d --build
```

---

## Production build (`docker-compose.prod.yml`)

The base compose file targets `dev`. For prod-style images, use the override:

```bash
# Required env vars (or put them in a .env file at repo root)
export DATABASE_URL=postgresql://postgres:STRONG_PW@db:5432/trio?schema=public
export JWT_SECRET=$(openssl rand -hex 32)
export POSTGRES_PASSWORD=STRONG_PW
export VITE_API_URL=https://api.example.com   # baked into client bundle at build time

docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

What changes vs dev:

| Service | Dev                                              | Prod                                                        |
| ------- | ------------------------------------------------ | ----------------------------------------------------------- |
| client  | Vite dev server on 5173                          | nginx serving static `dist/` on **80**                      |
| server  | `bun --watch src/index.ts`                       | `bun dist/index.js` (compiled, runs as non-root `app` user) |
| volumes | Source bind-mounted, named-volume `node_modules` | None — image is self-contained                              |
| db      | Port 5433 exposed to host                        | Not exposed to host (compose-network only)                  |
| env     | Hardcoded dev values in compose                  | Read from your shell / secret store, fail-fast if missing   |

Run migrations against the prod database:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml exec \
  -e DATABASE_URL="$DATABASE_URL" \
  server bunx prisma migrate deploy
```

`prisma migrate deploy` is the **production** migration command — it applies pending migrations without prompting.

---

## Troubleshooting

| Symptom                                                         | Cause                                                                      | Fix                                                                                                                       |
| --------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `port is already allocated` on 5173/8001/5433                   | Another process holds the port                                             | `ss -tlnp \| grep <port>` to find it; stop or change the host port in `docker-compose.yml`                                |
| Prisma `P1001 Can't reach database server at db:5432` from host | You are running Prisma from the host but using the container hostname `db` | Use `localhost:5433` in `server/.env`, or run Prisma inside the container with `-e DATABASE_URL=...db:5432...`            |
| Prisma `P1000 Authentication failed` against `localhost:5432`   | A different host-installed Postgres is on 5432                             | Compose maps to **5433** on purpose; make sure `DATABASE_URL` uses port `5433`                                            |
| Server logs show env validation error and exit                  | `server/.env` missing or `JWT_SECRET` < 16 chars                           | Re-copy from `.env.example`, set a longer secret                                                                          |
| Client cannot reach API (CORS / network error)                  | `VITE_API_URL` and `CORS_ORIGIN` mismatch                                  | Client must point to `http://localhost:8001`; server `CORS_ORIGIN` must be `http://localhost:5173`                        |
| Hot reload doesn't fire on Vite                                 | File watcher polling needed in some VMs                                    | `vite.config.ts` already sets `watch.usePolling: true`; check the bind mount works (`docker compose exec client ls /app`) |

---

## Local dev (no Docker)

Install deps in each app:

```bash
bun install
```

Run a Postgres yourself (or use the compose `db` container):

```bash
docker compose up -d db
```

Start services in two terminals:

```bash
bun run dev:server
bun run dev:client
```

`server/.env` `DATABASE_URL` should point to wherever your Postgres lives.

---

## Server scripts

```bash
bun --cwd server run dev            # watch mode
bun --cwd server run build          # tsc build to dist
bun --cwd server run start          # run built output
bun --cwd server run db:migrate     # prisma migrate dev
bun --cwd server run db:generate    # prisma generate
bun --cwd server run db:studio      # prisma studio UI
bun --cwd server run lint
bun --cwd server run typecheck
```

## Client scripts

```bash
bun --cwd client run dev
bun --cwd client run build
bun --cwd client run preview
bun --cwd client run lint
bun --cwd client run typecheck
```

## API surface

- `GET  /health` health check
- `POST /api/auth/register` create user, returns `{ user, token }`
- `POST /api/auth/login` returns `{ user, token }`
- `GET  /api/auth/me` requires `Authorization: Bearer <token>`

## Environment

Server (`server/.env`):

```
NODE_ENV=development
PORT=8001
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/trio?schema=public
JWT_SECRET=replace_with_long_random_string
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=debug
```

Client (`client/.env`):

```
VITE_API_URL=http://localhost:8001
```

## Notes

- Compose uses bind mounts for hot reload. `node_modules` are kept in named volumes so host and container do not collide.
- Server uses path alias `@/*` -> `src/*`. Same for client.
- Prisma client is generated on container start (`bunx prisma generate`) for dev; baked into the image for prod.
- Dev containers run as **root** because `/app` is bind-mounted from the host and the app user (uid 1001) cannot write to host-owned dirs (uid 1000). The prod target runs as the non-root `app` user.
- The `client/Dockerfile` and `server/Dockerfile` use `context: .` (repo root) so they can copy the workspace `package.json` files and root `bun.lock` for a frozen, deterministic install.
- Cache mount `--mount=type=cache,target=/root/.bun/install/cache` is used by the `deps` stage so repeated builds reuse Bun's package cache.
