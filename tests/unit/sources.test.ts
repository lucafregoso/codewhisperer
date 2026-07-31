/**
 * Behaviour of `src/lib/parser/sources.ts`: the "via" aggregator
 * pattern and the alias normalization.
 *
 * `src/data/source-aliases` is MOCKED with a synthetic map, same
 * technique as tests/unit/parse-categories-aliases.test.ts (`vi.mock`
 * is file-scoped in Vitest). Reason: the real map is curated from a
 * corpus that Hermes produces outside this repo — sources are
 * emergent, one OPML per magazine (constitution §2). Asserting
 * "Techmeme is an aggregator" would pin an editorial fact that can
 * legitimately change, and turn a curation edit into a red test.
 * What is under test here is the RULE (whoever is the aggregator ends
 * up in `via`, in either order of the label), not who plays the part
 * today.
 */
import { describe, expect, it, vi } from "vitest";

vi.mock("../../src/data/source-aliases", () => ({
  AGGREGATOR_SLUGS: new Set(["aggregatore"]),
  AGGREGATOR_HOSTS: { "aggregatore.example": "aggregatore" },
  SOURCE_ALIASES: { "testata.io": "testata-io" },
}));

const { parseSourceLink, parseSourcesLine } =
  await import("../../src/lib/parser/sources");

describe("parseSourceLink — pattern via", () => {
  it("Aggregatore (Testata) → source=testata via=aggregatore", () => {
    const ref = parseSourceLink(
      "Aggregatore (Testata)",
      "https://aggregatore.example/260716/p2",
    );
    expect(ref.slug).toBe("testata");
    expect(ref.name).toBe("Testata");
    expect(ref.via).toEqual({ name: "Aggregatore", slug: "aggregatore" });
  });

  it("Testata (Aggregatore) → identico (entrambi gli ordini)", () => {
    const ref = parseSourceLink(
      "Testata (Aggregatore)",
      "https://aggregatore.example/260713/p2",
    );
    expect(ref.slug).toBe("testata");
    expect(ref.via?.slug).toBe("aggregatore");
  });

  it("l'aggregatore riconosciuto dal solo host resta via anche col link della testata", () => {
    const ref = parseSourceLink(
      "Rivista (Aggregatore)",
      "https://rivista.example/abs/2607.06377",
    );
    expect(ref.slug).toBe("rivista");
    expect(ref.via?.slug).toBe("aggregatore");
  });

  it("label semplice → slug emergente senza via", () => {
    const ref = parseSourceLink(
      "Quotidiano Tech",
      "https://quotidiano.example/2026/07/15/example/",
    );
    expect(ref.slug).toBe("quotidiano-tech");
    expect(ref.name).toBe("Quotidiano Tech");
    expect(ref.via).toBeUndefined();
  });

  it("normalizza gli alias (grafia doppia → slug canonico)", () => {
    const ref = parseSourceLink("Testata.io", "https://testata.io/s/example");
    expect(ref.slug).toBe("testata-io");
  });
});

describe("parseSourcesLine", () => {
  const LINE =
    "**Fonti:** [Quotidiano Tech](https://quotidiano.example/a) — dettagli offerta, $50B; " +
    "[Aggregatore (Testata)](https://aggregatore.example/260714/p59) — conferma prezzo $60,50/azione.";

  it("splitta su ; e preserva le note", () => {
    const refs = parseSourcesLine(LINE, 1);
    expect(refs).toHaveLength(2);
    expect(refs[0]?.slug).toBe("quotidiano-tech");
    expect(refs[0]?.note).toContain("$50B");
    expect(refs[1]?.slug).toBe("testata");
    expect(refs[1]?.via?.slug).toBe("aggregatore");
    expect(refs[1]?.note).toContain("60,50");
  });

  it("gestisce 6 fonti sulla stessa riga", () => {
    const many =
      "**Fonti:** " +
      Array.from(
        { length: 6 },
        (_, i) => `[Fonte ${i}](https://example${i}.com/x) — nota ${i}`,
      ).join("; ") +
      ".";
    expect(parseSourcesLine(many, 3)).toHaveLength(6);
  });

  it("riga senza link validi → EditionParseError con riga", () => {
    expect(() => parseSourcesLine("**Fonti:** niente link qui.", 42)).toThrow(
      /riga 42/i,
    );
  });
});
