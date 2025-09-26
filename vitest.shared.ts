import * as path from "node:path"
import type { UserConfig } from "vitest/config"

const alias = (name: string) => {
  const target = process.env.TEST_DIST !== undefined ? "dist/dist/esm" : "src"
  const basePath = path.join(__dirname, "packages", name)
  return ({
    [`${name}/test`]: path.join(basePath, "test"),
    [`${name}`]: path.join(basePath, target),
    [`@puredialog/${name}/test`]: path.join(basePath, "test"),
    [`@puredialog/${name}`]: path.join(basePath, target)
  })
}

// This is a workaround, see https://github.com/vitest-dev/vitest/issues/4744
const config: UserConfig = {
  esbuild: {
    target: "es2020"
  },
  optimizeDeps: {
    exclude: ["bun:sqlite"]
  },
  test: {
    setupFiles: [path.join(__dirname, "setupTests.ts")],
    fakeTimers: {
      toFake: undefined
    },
    sequence: {
      concurrent: true
    },
    include: ["test/**/*.test.ts"],
    alias: {
      ...alias("domain"),
      ...alias("ingestion"),
      ...alias("llm"),
      ...alias("api"),
      ...alias("worker-metadata"),
      ...alias("worker-transcription")
    }
  }
}

export default config
