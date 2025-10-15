# syntax=docker/dockerfile:1

FROM node:22-slim AS build
WORKDIR /workspace

RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-workspace.yaml tsconfig.base.json tsconfig.build.json ./
COPY packages ./packages

# Install all dependencies using npm workspaces
RUN npm install --include=dev

# Clean any stale build artifacts
RUN find . -name '.tsbuildinfo' -type d -exec rm -rf {} + 2>/dev/null || true
RUN find . -name 'build' -type d -exec rm -rf {} + 2>/dev/null || true

# Build workspace dependencies first
RUN npm run clean --workspace=@puredialog/domain && npm run build --workspace=@puredialog/domain
RUN npm run clean --workspace=@puredialog/ingestion && npm run build --workspace=@puredialog/ingestion
RUN npm run clean --workspace=@puredialog/storage && npm run build --workspace=@puredialog/storage

# Now build the API
RUN npm run clean --workspace=@puredialog/api && npm run build --workspace=@puredialog/api

# Prune dev dependencies
RUN npm prune --omit=dev

FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=8080

# Copy production node_modules and built artifacts
COPY --from=build /workspace/node_modules ./node_modules
COPY --from=build /workspace/packages/api/build ./build
COPY packages/api/package.json ./package.json

EXPOSE 8080
CMD ["node", "build/esm/index.js"]
