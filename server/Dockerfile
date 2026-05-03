# syntax=docker/dockerfile:1.7
# Build context: repository root (so the Dockerfile can read root package.json + bun.lock + workspace package.json files).
# Targets:
#   dev   – source mounted at runtime, bun --watch
#   build – type-checks via tsc (no emit)
#   prod  – minimal runtime, non-root, runs TS source via bun

ARG BUN_VERSION=1.3.1

###########################
# Base                    #
###########################
FROM oven/bun:${BUN_VERSION}-alpine AS base
ENV CI=true
WORKDIR /app
RUN apk add --no-cache wget openssl libc6-compat \
 && addgroup -g 1001 -S app \
 && adduser  -u 1001 -S app -G app

###########################
# Deps (workspace install) #
###########################
FROM base AS deps
COPY package.json bun.lock ./
COPY shared/package.json ./shared/package.json
COPY client/package.json ./client/package.json
COPY admin/package.json ./admin/package.json
COPY server/package.json ./server/package.json
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

###########################
# Prisma client gen        #
###########################
FROM deps AS prisma
COPY shared ./shared
COPY server/prisma ./server/prisma
RUN cd server && bunx prisma generate

###########################
# Dev                      #
###########################
FROM prisma AS dev
ENV NODE_ENV=development \
    PORT=8001
WORKDIR /app/server
EXPOSE 8001
# Dev runs as root because the workspace root (/app) is bind-mounted from the host.
# Prod target below switches to non-root.
# Re-run bun install (cheap with cache) so deps match host package.json,
# regenerate prisma client, then start in watch mode.
CMD ["sh", "-c", "bun install && bunx prisma generate && bun --watch src/index.ts"]

###########################
# Build (type check only)  #
###########################
FROM prisma AS build
WORKDIR /app/server
COPY server ./
RUN bunx tsc --noEmit

###########################
# Prod runtime             #
###########################
FROM oven/bun:${BUN_VERSION}-alpine AS prod
WORKDIR /app/server
RUN apk add --no-cache wget openssl libc6-compat \
 && addgroup -g 1001 -S app \
 && adduser  -u 1001 -S app -G app
ENV NODE_ENV=production \
    PORT=8001

# Hoisted workspace deps live at /app/node_modules; shared source resolved via workspace symlink
COPY --from=build --chown=app:app /app/node_modules /app/node_modules
COPY --from=build --chown=app:app /app/shared           /app/shared
COPY --from=build --chown=app:app /app/server/src        ./src
COPY --from=build --chown=app:app /app/server/prisma     ./prisma
COPY --from=build --chown=app:app /app/server/tsconfig.json ./tsconfig.json
COPY --from=build --chown=app:app /app/server/package.json ./package.json

USER app
EXPOSE 8001
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --quiet --tries=1 --spider "http://localhost:${PORT}/health" || exit 1
CMD ["bun", "src/index.ts"]
