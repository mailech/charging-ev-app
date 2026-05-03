# syntax=docker/dockerfile:1.7
# Build context: repository root.
# Targets:
#   dev   – Vite dev server, source bind-mounted
#   build – produces static dist/
#   prod  – nginx serving compiled assets

ARG BUN_VERSION=1.3.1
ARG NGINX_VERSION=1.27

###########################
# Base                    #
###########################
FROM oven/bun:${BUN_VERSION}-alpine AS base
ENV CI=true
WORKDIR /app
RUN addgroup -g 1001 -S app \
 && adduser  -u 1001 -S app -G app

###########################
# Deps                    #
###########################
FROM base AS deps
COPY package.json bun.lock ./
COPY shared/package.json ./shared/package.json
COPY admin/package.json ./admin/package.json
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

###########################
# Dev (Vite hot-reload)   #
###########################
FROM deps AS dev
ENV NODE_ENV=development
WORKDIR /app/admin
EXPOSE 5174
# Dev runs as root because /app is bind-mounted from the host (host uid != container app uid).
# Re-run bun install (cheap with cache) so deps match the bind-mounted package.json, then dev server.
CMD ["sh", "-c", "bun install && bun run dev --host 0.0.0.0"]

###########################
# Build (static assets)   #
###########################
FROM deps AS build
WORKDIR /app
ARG VITE_API_URL=http://localhost:8001
ENV VITE_API_URL=${VITE_API_URL}
COPY shared ./shared
COPY admin ./admin
WORKDIR /app/admin
RUN bun run build

###########################
# Prod (nginx static)     #
###########################
FROM nginx:${NGINX_VERSION}-alpine AS prod
RUN apk add --no-cache wget
COPY --from=build /app/admin/dist /usr/share/nginx/html
COPY admin/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
