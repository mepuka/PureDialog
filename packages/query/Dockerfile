# syntax=docker/dockerfile:1
FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /usr/src/app
COPY pnpm-lock.yaml .
RUN pnpm fetch
COPY . .
RUN pnpm install -r --offline
RUN pnpm run build --filter=@puredialog/query

FROM base AS runner
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/packages/query/package.json .
COPY --from=builder /usr/src/app/packages/query/dist ./dist
CMD [ "node", "dist/index.js" ]