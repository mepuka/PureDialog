import * as path from "node:path";
const alias = (name) => {
    const target = process.env.TEST_DIST !== undefined ? "dist/dist/esm" : "src";
    return ({
        [`${name}/test`]: path.join(__dirname, "packages", name, "test"),
        [`${name}`]: path.join(__dirname, "packages", name, target)
    });
};
// This is a workaround, see https://github.com/vitest-dev/vitest/issues/4744
const config = {
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
            ...alias("api"),
            ...alias("domain"),
            ...alias("ingestion"),
            ...alias("llm"),
            ...alias("worker-metadata"),
            ...alias("worker-transcription")
        }
    }
};
export default config;
//# sourceMappingURL=vitest.shared.js.map