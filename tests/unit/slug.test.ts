import { describe, expect, it } from "vitest";
import { slugify } from "../../src/lib/parser/slug";

describe("slugify", () => {
  it("normalizza minuscole, spazi e punteggiatura", () => {
    expect(slugify("Hyundai rende Boston Dynamics una controllata totale")).toBe(
      "hyundai-rende-boston-dynamics-una-controllata-totale",
    );
  });

  it("rimuove gli accenti italiani", () => {
    expect(slugify("Perché l'AI è già qui")).toBe("perche-l-ai-e-gia-qui");
  });

  it("comprime separatori multipli e taglia i bordi", () => {
    expect(slugify("  Stripe — Advent:  $53B!  ")).toBe("stripe-advent-53b");
  });

  it("è stabile e deterministica", () => {
    const title = "OpenAI lancia il Codex Micro: il primo hardware";
    expect(slugify(title)).toBe(slugify(title));
  });
});
