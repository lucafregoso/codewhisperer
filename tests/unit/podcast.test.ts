import { describe, expect, it } from "vitest";
import { podcastFileFor } from "../../src/lib/podcast";

describe("podcastFileFor", () => {
  it("match per basename esatto", () => {
    expect(podcastFileFor("2026-07-16.md", ["2026-07-16.mp3"])).toBe(
      "2026-07-16.mp3",
    );
  });

  it("nessun match → undefined (il podcast è opzionale)", () => {
    expect(
      podcastFileFor("2026-07-17.md", ["2026-07-16.mp3"]),
    ).toBeUndefined();
    expect(podcastFileFor("2026-07-17.md", [])).toBeUndefined();
  });

  it("solo .mp3: altre estensioni non contano", () => {
    expect(
      podcastFileFor("2026-07-16.md", ["2026-07-16.m4a", "2026-07-16.wav"]),
    ).toBeUndefined();
  });

  it("il filename resta libero da contratto: match anche senza data", () => {
    expect(
      podcastFileFor("Rassegna 14 Lug 2026.md", ["Rassegna 14 Lug 2026.mp3"]),
    ).toBe("Rassegna 14 Lug 2026.mp3");
  });
});
