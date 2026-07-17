import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseEdition } from "../../src/lib/parser/parse-edition";
import { EditionParseError } from "../../src/lib/parser/types";

const INPUT = join(process.cwd(), "input");
const FIXTURES = join(process.cwd(), "tests", "fixtures");

const read = (dir: string, file: string) => readFileSync(join(dir, file), "utf8");

// Il corpus cresce di un'edizione al giorno: questi test verificano il
// contratto di docs/INGESTION.md, mai lo stato del corpus (conteggi fissi,
// range di date, sezioni opzionali). Un test che congela il corpus blocca
// il deploy della prima edizione nuova — è già successo il 17 luglio 2026.
describe("parseEdition — corpus reale in input/", () => {
  const files = readdirSync(INPUT).filter((f) => f.endsWith(".md"));

  it("il corpus contiene almeno le 5 rassegne di luglio", () => {
    expect(files.length).toBeGreaterThanOrEqual(5);
  });

  it.each(files)("parsa %s senza errori", (file) => {
    const edition = parseEdition(read(INPUT, file));
    expect(edition.masthead).toBe("RubricAI");
    expect(edition.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number.isNaN(Date.parse(edition.date))).toBe(false);
    expect(edition.tldr.length).toBeGreaterThan(0);
    expect(edition.stories.length).toBeGreaterThanOrEqual(1);
    for (const story of edition.stories) {
      expect(story.title.length).toBeGreaterThan(0);
      expect(story.body.length).toBeGreaterThan(0);
      expect(story.sources.length).toBeGreaterThanOrEqual(1);
      expect(story.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("le date del corpus sono uniche (una edizione per giorno)", () => {
    const dates = files.map((f) => parseEdition(read(INPUT, f)).date);
    expect(new Set(dates).size).toBe(files.length);
  });

  it("l'edizione del 14 (filename variante) ha la data dall'H1", () => {
    const edition = parseEdition(read(INPUT, "Rassegna 14 Lug 2026.md"));
    expect(edition.date).toBe("2026-07-14");
  });

  it("il via-pattern è risolto nel corpus (Reuters via Techmeme)", () => {
    const edition = parseEdition(read(INPUT, "Rassegnai Daily Jul 16 2026.md"));
    const allRefs = edition.stories.flatMap((s) => s.sources);
    const viaTechmeme = allRefs.filter((r) => r.via?.slug === "techmeme");
    expect(viaTechmeme.length).toBeGreaterThan(0);
    expect(viaTechmeme.some((r) => r.slug === "reuters")).toBe(true);
  });

  it("la nota di copertura del 16 luglio è completa", () => {
    const edition = parseEdition(read(INPUT, "Rassegnai Daily Jul 16 2026.md"));
    expect(edition.coverage).toMatchObject({
      sourcesRead: 60,
      sourcesTotal: 65,
      itemsCollected: 299,
      itemsPublished: 21,
      itemsDiscarded: 278,
    });
    expect(edition.coverage?.unreachable.length).toBeGreaterThanOrEqual(4);
    expect(edition.coverage?.tagline).toContain("puoi ignorarlo");
  });
});

describe("parseEdition — edge cases sintetici", () => {
  it("legge le categorie esplicite e il suffisso radar [cat:]", () => {
    const edition = parseEdition(read(FIXTURES, "edge-categorie.md"));
    expect(edition.date).toBe("2026-07-01");
    expect(edition.stories[0]?.categories).toEqual([
      "intelligenza-artificiale",
      "open-source",
    ]);
    expect(edition.stories[1]?.categories).toEqual([]);
    expect(edition.radar[0]?.categories).toEqual(["sicurezza"]);
    expect(edition.radar[0]?.text).not.toContain("[cat:");
    expect(edition.radar[1]?.categories).toEqual([]);
  });

  it("feed lento senza autore: author assente, source popolata", () => {
    const edition = parseEdition(read(FIXTURES, "edge-categorie.md"));
    expect(edition.slowFeed?.title).toBe("Un pezzo dalla mailing list");
    expect(edition.slowFeed?.author).toBeUndefined();
    expect(edition.slowFeed?.source.slug).toBe("lobste-rs");
  });

  it("la riga Categorie non finisce nel corpo della storia", () => {
    const edition = parseEdition(read(FIXTURES, "edge-categorie.md"));
    expect(edition.stories[0]?.body).not.toContain("Categorie");
    expect(edition.stories[0]?.body).not.toContain("Fonti");
  });

  it("edizione minimale: radar/feed/copertura opzionali", () => {
    const edition = parseEdition(read(FIXTURES, "edge-minimale.md"));
    expect(edition.stories).toHaveLength(1);
    expect(edition.radar).toEqual([]);
    expect(edition.slowFeed).toBeUndefined();
    expect(edition.coverage).toBeUndefined();
  });

  it("riga Fonti senza link → EditionParseError con la riga giusta", () => {
    const raw = read(FIXTURES, "edge-fonti-rotta.md");
    try {
      parseEdition(raw);
      expect.unreachable("doveva lanciare");
    } catch (error) {
      expect(error).toBeInstanceOf(EditionParseError);
      const parseError = error as EditionParseError;
      const lines = raw.split("\n");
      expect(lines[parseError.line - 1]).toContain("**Fonti:**");
    }
  });

  it("file senza H1 riconoscibile → errore alla riga 1", () => {
    expect(() => parseEdition("nessun titolo\n")).toThrow(EditionParseError);
  });
});
