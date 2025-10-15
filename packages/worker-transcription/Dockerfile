# syntax=docker/dockerfile:1

FROM node:22-slim AS build
WORKDIR /workspace

RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml .npmrc tsconfig.base.json tsconfig.build.json ./
COPY packages ./packages

# Install all dependencies first
RUN pnpm install --frozen-lockfile

# Build workspace dependencies (no need to clean, starting fresh)
RUN cd packages/domain && pnpm build
RUN cd packages/ingestion && pnpm build
RUN cd packages/storage && pnpm build
RUN cd packages/llm && pnpm build

# Now build the worker
RUN cd packages/worker-transcription && pnpm build

# Prune dev dependencies
RUN pnpm prune --prod

FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=8080

# Copy entire workspace structure for proper package resolution
COPY --from=build /workspace/node_modules ./node_modules
COPY --from=build /workspace/package.json ./package.json
COPY --from=build /workspace/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Copy all workspace packages with their built outputs
COPY --from=build /workspace/packages ./packages

EXPOSE 8080
CMD ["node", "packages/worker-transcription/build/esm/index.js"]
