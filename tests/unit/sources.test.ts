import { describe, expect, it } from "vitest";
import { parseSourceLink, parseSourcesLine } from "../../src/lib/parser/sources";

describe("parseSourceLink — pattern via", () => {
  it("Techmeme (Reuters) con URL techmeme → source=reuters via=techmeme", () => {
    const ref = parseSourceLink(
      "Techmeme (Reuters)",
      "https://www.techmeme.com/260716/p2#a260716p2",
    );
    expect(ref.slug).toBe("reuters");
    expect(ref.name).toBe("Reuters");
    expect(ref.via).toEqual({ name: "Techmeme", slug: "techmeme" });
  });

  it("Reuters (Techmeme) con URL techmeme → identico (entrambi gli ordini)", () => {
    const ref = parseSourceLink(
      "Reuters (Techmeme)",
      "https://www.techmeme.com/260713/p2#a260713p2",
    );
    expect(ref.slug).toBe("reuters");
    expect(ref.via?.slug).toBe("techmeme");
  });

  it("arXiv (Hacker News) con URL arxiv → source=arxiv via=hacker-news", () => {
    const ref = parseSourceLink(
      "arXiv (Hacker News)",
      "https://arxiv.org/abs/2607.06377",
    );
    expect(ref.slug).toBe("arxiv");
    expect(ref.via?.slug).toBe("hacker-news");
  });

  it("label semplice → slug emergente senza via", () => {
    const ref = parseSourceLink(
      "TechCrunch",
      "https://techcrunch.com/2026/07/15/example/",
    );
    expect(ref.slug).toBe("techcrunch");
    expect(ref.name).toBe("TechCrunch");
    expect(ref.via).toBeUndefined();
  });

  it("normalizza gli alias (Lobste.rs → lobste-rs)", () => {
    const ref = parseSourceLink("Lobste.rs", "https://lobste.rs/s/example");
    expect(ref.slug).toBe("lobste-rs");
  });
});

describe("parseSourcesLine", () => {
  const LINE =
    "**Fonti:** [TechCrunch](https://techcrunch.com/a) — dettagli offerta, $50B; " +
    "[Techmeme (Reuters)](https://www.techmeme.com/260714/p59#a260714p59) — conferma prezzo $60,50/azione.";

  it("splitta su ; e preserva le note", () => {
    const refs = parseSourcesLine(LINE, 1);
    expect(refs).toHaveLength(2);
    expect(refs[0]?.slug).toBe("techcrunch");
    expect(refs[0]?.note).toContain("$50B");
    expect(refs[1]?.slug).toBe("reuters");
    expect(refs[1]?.via?.slug).toBe("techmeme");
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
