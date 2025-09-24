import { describe, expect, it } from "vitest";
import { mapSpeaker, normalizeTimestamp } from "../src/adapters";

describe("adapters", () => {
  it("should normalize a timestamp", () => {
    expect(normalizeTimestamp("1:23")).toBe("00:01:23");
  });

  it("should map a speaker to a speaker role", () => {
    expect(mapSpeaker("Host")).toBe("host");
    expect(mapSpeaker("Guest")).toBe("guest");
  });
});
