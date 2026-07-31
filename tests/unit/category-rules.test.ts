/**
 * Spec 016 — per-instance selector for the category derivation rules
 * (acceptance criterion §3).
 *
 * Mirrors tests/unit/category-aliases.test.ts (spec 015): one export
 * (`CATEGORY_RULES`) per instance module.
 *
 * The contract asserted here is SHAPE, never content: every module is
 * valid both empty (no curated rules yet — the derivation is a no-op
 * and items stay uncategorized, constitution §2) and populated. The
 * curated rules are editorial, derived from a corpus that Hermes keeps
 * growing from the outside: freezing "rassegnai has N rules" or
 * "sailes is empty" would turn an editorial revision into a red test.
 * What must hold no matter what: canonical unique slugs, and non-empty
 * lowercase keywords (matching is case-insensitive, so an uppercase
 * keyword is a curation slip, never a behaviour change).
 *
 * The selector import is static — REGRESSION GUARD on the default
 * instance resolving to a real module.
 */
import { describe, expect, it } from "vitest";
import { CATEGORY_RULES } from "../../src/data/category-rules";
import type { CategoryRule } from "../../src/lib/category-derivation";

function expectValidRules(rules: CategoryRule[]) {
  expect(Array.isArray(rules)).toBe(true);

  const slugs = rules.map((rule) => rule.slug);
  for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/);
  expect(new Set(slugs).size).toBe(slugs.length);

  for (const rule of rules) {
    expect(Array.isArray(rule.keywords)).toBe(true);
    expect(rule.keywords.length).toBeGreaterThan(0);
    for (const keyword of rule.keywords) {
      expect(keyword.trim()).not.toBe("");
      expect(keyword).toBe(keyword.toLowerCase());
    }
    expect(new Set(rule.keywords).size).toBe(rule.keywords.length);
  }
}

describe("category-rules — istanza default riespone il modulo curato", () => {
  it("CATEGORY_RULES è [] oppure una lista di regole ben formate", () => {
    expectValidRules(CATEGORY_RULES);
  });
});

describe("category-rules/<slug> — moduli per istanza (spec 016)", () => {
  it.each([
    ["rassegnai", "../../src/data/category-rules/rassegnai"],
    ["sailes", "../../src/data/category-rules/sailes"],
    // Fallback per le istanze senza file curato (costituzione §2).
    ["default", "../../src/data/category-rules/default"],
  ])("%s espone CATEGORY_RULES vuoto o ben formato", async (_slug, path) => {
    const mod: any = await import(path);
    expectValidRules(mod.CATEGORY_RULES);
  });
});
