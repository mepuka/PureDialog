# syntax=docker/dockerfile:1

FROM node:22-slim AS build
WORKDIR /workspace

RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml tsconfig.base.json tsconfig.build.json ./
COPY packages ./packages

# Install all dependencies first (including workspace dependencies)
RUN pnpm install --frozen-lockfile

# Clean any stale build artifacts
RUN find . -name '.tsbuildinfo' -type d -exec rm -rf {} + 2>/dev/null || true
RUN find . -name 'build' -type d -exec rm -rf {} + 2>/dev/null || true

# Build workspace dependencies first
RUN pnpm --filter @puredialog/domain run clean && pnpm --filter @puredialog/domain build
RUN pnpm --filter @puredialog/ingestion run clean && pnpm --filter @puredialog/ingestion build
RUN pnpm --filter @puredialog/storage run clean && pnpm --filter @puredialog/storage build

# Now build the API
RUN pnpm --filter @puredialog/api run clean && pnpm --filter @puredialog/api build

# Prune dev dependencies
RUN CI=1 pnpm prune --prod

FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=8080

# Copy production node_modules and built artifacts
COPY --from=build /workspace/node_modules ./node_modules
COPY --from=build /workspace/packages/api/build ./build
COPY packages/api/package.json ./package.json

EXPOSE 8080
CMD ["node", "build/esm/index.js"]
