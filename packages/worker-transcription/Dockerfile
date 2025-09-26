# syntax=docker/dockerfile:1

FROM node:22-slim AS build
WORKDIR /workspace

RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm@9

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY packages ./packages

RUN pnpm install --filter @puredialog/worker-transcription --frozen-lockfile
RUN pnpm --filter @puredialog/worker-transcription build
RUN CI=1 pnpm prune --prod

FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=8080

COPY --from=build /workspace/node_modules ./node_modules
COPY --from=build /workspace/packages/worker-transcription/build ./build
COPY packages/worker-transcription/package.json ./package.json

EXPOSE 8080
CMD ["node", "build/esm/index.js"]
