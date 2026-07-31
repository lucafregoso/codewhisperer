/**
 * Spec 015 — alias categoria per istanza (criterio di accettazione §1).
 *
 * Mirror of tests/unit/category-rules.test.ts (spec 016), for a single
 * export (`CATEGORY_ALIASES`: categories have no aggregator / "via"
 * pattern like sources do).
 *
 * Same discipline: SHAPE only, never content. An instance is valid
 * both with an empty map (no duplicate spelling observed in the corpus
 * yet — the normalization layer is a no-op, constitution §2) and with
 * a curated one. The map depends on what Hermes writes in the
 * editions, i.e. on content produced outside this repo: pinning
 * "rassegnai has no aliases" would make the arrival of a real
 * duplicate a red test instead of a curation task.
 *
 * What must hold either way: aliases and canonical slugs are lowercase
 * slugs, an alias never maps to itself, and the target is never itself
 * an alias (no chains — resolution is a single lookup).
 */
import { describe, expect, it } from "vitest";
import { CATEGORY_ALIASES } from "../../src/data/category-aliases";

function expectValidAliases(aliases: Record<string, string>) {
  expect(typeof aliases).toBe("object");
  expect(aliases).not.toBeNull();

  for (const [alias, canonical] of Object.entries(aliases)) {
    expect(alias.trim()).not.toBe("");
    expect(alias).toBe(alias.toLowerCase());
    expect(canonical).toMatch(/^[a-z0-9-]+$/);
    expect(canonical).not.toBe(alias);
    expect(aliases[canonical]).toBeUndefined();
  }
}

describe("category-aliases — istanza default riespone la mappa curata", () => {
  it("CATEGORY_ALIASES è {} oppure una mappa ben formata", () => {
    expectValidAliases(CATEGORY_ALIASES);
  });
});

describe("aliases/<slug> — moduli per istanza (spec 015)", () => {
  it.each([
    ["rassegnai", "../../src/data/aliases/rassegnai"],
    // Fallback per le istanze senza file curato (costituzione §2).
    ["default", "../../src/data/aliases/default"],
  ])("%s espone CATEGORY_ALIASES vuoto o ben formato", async (_slug, path) => {
    const mod: any = await import(path);
    expectValidAliases(mod.CATEGORY_ALIASES);
  });
});
