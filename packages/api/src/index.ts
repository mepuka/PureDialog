import { Effect } from "effect"
import { main } from "./server.js"

Effect.runPromise(Effect.asVoid(main))
