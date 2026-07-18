import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { EDITION_DIRS } from "../../src/lib/content-dirs";
import { parseEdition } from "../../src/lib/parser/parse-edition";
import { EditionParseError } from "../../src/lib/parser/types";

const FIXTURES = join(process.cwd(), "tests", "fixtures");

const read = (dir: string, file: string) => readFileSync(join(dir, file), "utf8");

// Il corpus in input/ è dinamico: lo popolano gli scraper di Hermes, i
// file possono essere rinominati e le edizioni future non sono
// prevedibili. Questi test verificano SOLO il contratto di
// docs/INGESTION.md — mai contenuti, conteggi, date o filename
// specifici (un test che congela il corpus blocca il deploy della
// prima edizione nuova: successo il 17 luglio 2026). I check puntuali
// sul formato vivono sulle fixture in tests/fixtures/, che sono nostre.
describe("parseEdition — corpus reale (tutte le lane)", () => {
  const files = EDITION_DIRS.flatMap((dir) => {
    let names: string[] = [];
    try {
      names = readdirSync(join(process.cwd(), dir));
    } catch {
      return [];
    }
    return names
      .filter((f) => f.endsWith(".md"))
      .map((file) => ({ dir: join(process.cwd(), dir), file }));
  });
  const editions = files.map(({ dir, file }) => parseEdition(read(dir, file)));

  it("il corpus contiene almeno un'edizione (serve per la homepage)", () => {
    expect(files.length).toBeGreaterThanOrEqual(1);
  });

  it.each(files)("parsa $file senza errori", ({ dir, file }) => {
    const edition = parseEdition(read(dir, file));
    expect(edition.masthead.length).toBeGreaterThan(0);
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
    const dates = editions.map((e) => e.date);
    expect(new Set(dates).size).toBe(files.length);
  });
});

describe("parseEdition — contratto sulle fixture", () => {
  it("masthead e data vengono dall'H1, non dal filename", () => {
    const edition = parseEdition(read(FIXTURES, "edge-categorie.md"));
    expect(edition.masthead).toBe("RubricAI");
    expect(edition.date).toBe("2026-07-01");
  });

  it("il via-pattern è risolto (Techmeme (Reuters) → reuters via techmeme)", () => {
    const edition = parseEdition(read(FIXTURES, "edge-categorie.md"));
    const viaRef = edition.stories[0]?.sources.find((s) => s.via);
    expect(viaRef).toBeDefined();
    expect(viaRef?.slug).toBe("reuters");
    expect(viaRef?.via?.slug).toBe("techmeme");
  });

  it("la nota di copertura è completa", () => {
    const edition = parseEdition(read(FIXTURES, "edge-categorie.md"));
    expect(edition.coverage).toMatchObject({
      sourcesRead: 10,
      sourcesTotal: 12,
      itemsCollected: 50,
      itemsPublished: 4,
      itemsDiscarded: 46,
    });
    expect(edition.coverage?.unreachable).toHaveLength(2);
    expect(edition.coverage?.tagline).toContain("puoi ignorarlo");
  });

  it("legge le categorie esplicite e il suffisso radar [cat:]", () => {
    const edition = parseEdition(read(FIXTURES, "edge-categorie.md"));
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

  it("le righe meta (Categorie, Fonti, Immagine) non finiscono nel corpo", () => {
    const edition = parseEdition(read(FIXTURES, "edge-categorie.md"));
    expect(edition.stories[0]?.body).not.toContain("Categorie");
    expect(edition.stories[0]?.body).not.toContain("Fonti");
    expect(edition.stories[0]?.body).not.toContain("Immagine");
  });

  it("immagini markdown: cover nel preambolo e arte della storia, body pulito", () => {
    const edition = parseEdition(read(FIXTURES, "edge-immagini.md"));
    expect(edition.image).toEqual({
      url: "images/cover-di-prova.jpg",
      alt: "Cover di prova",
    });
    expect(edition.stories[0]?.image).toEqual({
      url: "images/storia-uno.jpg",
      alt: "Alt della storia uno",
    });
    expect(edition.stories[0]?.body).toContain("Corpo prima");
    expect(edition.stories[0]?.body).toContain("Corpo dopo");
    expect(edition.stories[0]?.body).not.toContain("![");
    expect(edition.stories[1]?.image).toEqual({
      url: "https://example.com/assoluta.jpg",
      alt: "alt assoluto",
    });
    expect(edition.stories[2]?.image).toBeUndefined();
  });

  it("la riga Immagine diventa story.image {url, alt}", () => {
    const edition = parseEdition(read(FIXTURES, "edge-categorie.md"));
    expect(edition.stories[0]?.image).toEqual({
      url: "https://example.com/futura.jpg",
      alt: "alt di prova, riga riservata al contratto futuro",
    });
    // Storia senza riga Immagine → nessuna immagine, nessun default.
    expect(edition.stories[1]?.image).toBeUndefined();
  });

  it("edizione minimale: radar/feed/copertura opzionali", () => {
    const edition = parseEdition(read(FIXTURES, "edge-minimale.md"));
    expect(edition.stories).toHaveLength(1);
    expect(edition.radar).toEqual([]);
    expect(edition.slowFeed).toBeUndefined();
    expect(edition.coverage).toBeUndefined();
  });

  it("riga Immagine malformata → EditionParseError, mai nel body", () => {
    const base = read(FIXTURES, "edge-minimale.md");
    const senzaUrl = base.replace(
      "Corpo essenziale.",
      "Corpo essenziale.\n**Immagine:**",
    );
    expect(() => parseEdition(senzaUrl)).toThrow(EditionParseError);

    const senzaDash = base.replace(
      "Corpo essenziale.",
      "Corpo essenziale.\n**Immagine:** https://example.com/x.jpg alt senza separatore",
    );
    expect(() => parseEdition(senzaDash)).toThrow(EditionParseError);
  });

  it("immagine markdown malformata → EditionParseError, mai nel body", () => {
    const base = read(FIXTURES, "edge-minimale.md");
    const conTitolo = base.replace(
      "Corpo essenziale.",
      'Corpo essenziale.\n![alt](images/x.jpg "titolo non previsto")',
    );
    expect(() => parseEdition(conTitolo)).toThrow(EditionParseError);
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
