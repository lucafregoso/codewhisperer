/**
 * Spec 014 — per-instance source aliases (criterion 4).
 *
 * `src/data/source-aliases.ts` is a selector: it re-exports the alias
 * module of the active instance from `src/data/aliases/<slug>.ts`.
 *
 * Contract asserted here is SHAPE, never content — same discipline as
 * tests/unit/category-rules.test.ts and category-aliases.test.ts. Each
 * magazine has its own OPML: which outlets exist, and which of them
 * act as aggregators, is emergent from a corpus produced outside this
 * repo (constitution §2). Every module is therefore valid both empty
 * (nothing curated: no "via" attribution, no normalization — the
 * parser still resolves every label via `slugify()`) and populated.
 *
 * What must hold either way: canonical slugs everywhere, hosts as
 * lowercase hostnames, and `AGGREGATOR_HOSTS` pointing at slugs that
 * `AGGREGATOR_SLUGS` also knows — an aggregator recognized by host but
 * not by slug would resolve inconsistently depending on the label.
 * The BEHAVIOUR that consumes these maps is covered by
 * tests/unit/sources.test.ts on a synthetic map.
 *
 * The selector import is static — REGRESSION GUARD on the default
 * instance resolving to a real module.
 */
import { describe, expect, it } from "vitest";
import {
  AGGREGATOR_HOSTS,
  AGGREGATOR_SLUGS,
  SOURCE_ALIASES,
} from "../../src/data/source-aliases";

const SLUG = /^[a-z0-9-]+$/;

function expectValidSourceAliases(mod: {
  AGGREGATOR_SLUGS: Set<string>;
  AGGREGATOR_HOSTS: Record<string, string>;
  SOURCE_ALIASES: Record<string, string>;
}) {
  expect(mod.AGGREGATOR_SLUGS).toBeInstanceOf(Set);
  for (const slug of mod.AGGREGATOR_SLUGS) expect(slug).toMatch(SLUG);

  for (const [host, slug] of Object.entries(mod.AGGREGATOR_HOSTS)) {
    expect(host).toBe(host.toLowerCase());
    expect(host).toMatch(/^[a-z0-9.-]+$/);
    expect(slug).toMatch(SLUG);
    expect(
      mod.AGGREGATOR_SLUGS.has(slug),
      `host ${host} → ${slug}: slug assente da AGGREGATOR_SLUGS`,
    ).toBe(true);
  }

  for (const [alias, canonical] of Object.entries(mod.SOURCE_ALIASES)) {
    expect(alias.trim()).not.toBe("");
    expect(alias).toBe(alias.toLowerCase());
    expect(canonical).toMatch(SLUG);
    expect(canonical).not.toBe(alias);
    // Nessuna catena: la risoluzione è un solo lookup.
    expect(mod.SOURCE_ALIASES[canonical]).toBeUndefined();
  }
}

describe("source-aliases — istanza default riespone il modulo curato", () => {
  it("gli export sono vuoti oppure ben formati", () => {
    expectValidSourceAliases({
      AGGREGATOR_SLUGS,
      AGGREGATOR_HOSTS,
      SOURCE_ALIASES,
    });
  });
});

describe("aliases/<slug> — moduli per istanza (spec 014)", () => {
  it.each([
    ["rassegnai", "../../src/data/aliases/rassegnai"],
    // Fallback per le istanze senza file curato (costituzione §2).
    ["default", "../../src/data/aliases/default"],
  ])("%s espone i tre export vuoti o ben formati", async (_slug, path) => {
    const mod: any = await import(path);
    expectValidSourceAliases(mod);
  });
});
