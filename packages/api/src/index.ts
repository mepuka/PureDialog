import { NodeRuntime } from "@effect/platform-node"
import { main } from "./server.js"

main.pipe(NodeRuntime.runMain)
