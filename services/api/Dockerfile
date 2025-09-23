# syntax=docker/dockerfile:1

FROM node:22-slim AS build
WORKDIR /workspace

RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm@9

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY packages ./packages
COPY services/api ./services/api

RUN pnpm install --filter @puredialog/api --frozen-lockfile
RUN pnpm --filter @puredialog/api build
RUN CI=1 pnpm prune --prod

FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=8080

# Copy production node_modules and built artifacts
COPY --from=build /workspace/node_modules ./node_modules
COPY --from=build /workspace/services/api/dist ./dist
COPY services/api/package.json ./package.json

EXPOSE 8080
CMD ["node", "dist/index.js"]
