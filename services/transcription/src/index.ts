import { Effect } from "effect";

export const main = Effect.gen(function* () {
  yield* Effect.succeed(undefined);
});
