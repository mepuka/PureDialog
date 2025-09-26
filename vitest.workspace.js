import * as path from "node:path";
import { defineWorkspace } from "vitest/config";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const project = (config, root = config.root ?? path.join(__dirname, `packages/${config.name.split("|").at(0)}`)) => ({
    extends: "vitest.shared.ts",
    test: { root, ...config }
});
export default defineWorkspace([
    // Add specialized configuration for some packages.
    // project({ name: "my-package|browser", environment: "happy-dom" }),
    // Add the default configuration for all packages.
    "packages/*"
]);
//# sourceMappingURL=vitest.workspace.js.map