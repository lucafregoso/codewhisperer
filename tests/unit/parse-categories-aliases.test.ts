/**
 * Spec 015 — normalizzazione categorie al parse time (criterio di
 * accettazione §2).
 *
 * File SEPARATO da parse-edition.test.ts: `vi.mock` è file-scoped in
 * Vitest e qui sostituiamo `src/data/category-aliases` con una mappa
 * fittizia per esercitare `canonicalCategorySlug()` senza dipendere
 * dalla curatela reale di `rassegnai` (che parte vuota, spec 015 gate
 * HITL punto 2) — mescolare i due `vi.mock` nella stessa suite
 * rischierebbe interferenze tra i test.
 */
import { describe, expect, it, vi } from "vitest";

vi.mock("../../src/data/category-aliases", () => ({
  CATEGORY_ALIASES: {
    ia: "intelligenza-artificiale",
    "intelligenza artificiale": "intelligenza-artificiale",
  },
}));

const { parseEdition } = await import("../../src/lib/parser/parse-edition");

/** Edizione sintetica minima: solo ciò che serve a esercitare parseCategories(). */
function editionWith(categorieLine: string): string {
  return [
    "# RubricAI — Edizione del 1 luglio 2026",
    "",
    "> Edizione sintetica per il test di normalizzazione alias categorie (spec 015).",
    "",
    "## 🗞 In primo piano",
    "",
    "### 1. Storia con alias categoria",
    "Corpo minimo per superare la validazione.",
    "**Fonti:** [Fonte](https://example.com/a) — nota.",
    categorieLine,
  ].join("\n");
}

describe("parseCategories — alias case-insensitive/trim (mappa fittizia)", () => {
  it("un termine presente nella mappa (con spazi e maiuscole diverse) risolve allo slug canonico", () => {
    const edition = parseEdition(editionWith("**Categorie:**   IA  "));
    expect(edition.stories[0]?.categories).toEqual(["intelligenza-artificiale"]);
  });

  it("la stessa chiave scritta con un'altra grafia (spazio multi-parola) risolve allo stesso slug", () => {
    const edition = parseEdition(editionWith("**Categorie:** Intelligenza Artificiale"));
    expect(edition.stories[0]?.categories).toEqual(["intelligenza-artificiale"]);
  });
});

describe("parseCategories — fallback slugify() per termine assente dalla mappa", () => {
  it("un termine non in CATEGORY_ALIASES produce slugify(termine) come oggi", () => {
    const edition = parseEdition(editionWith("**Categorie:** Sicurezza Informatica"));
    expect(edition.stories[0]?.categories).toEqual(["sicurezza-informatica"]);
  });
});

describe("parseCategories — dedup con ordine di prima occorrenza", () => {
  it("due sinonimi alias-mappati allo stesso slug nella stessa riga producono un solo elemento", () => {
    const edition = parseEdition(
      editionWith("**Categorie:** IA, Sicurezza, Intelligenza Artificiale"),
    );
    expect(edition.stories[0]?.categories).toEqual([
      "intelligenza-artificiale",
      "sicurezza",
    ]);
  });
});
