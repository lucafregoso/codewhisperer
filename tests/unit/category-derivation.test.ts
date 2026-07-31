/**
 * Spec 016 — derivazione locale delle categorie (criteri di accettazione
 * §1 e §2 di requirements.md).
 *
 * Import diretto di `deriveCategories`/`withDerivedCategories` da
 * `src/lib/category-derivation.ts`: nessun `vi.mock`, le regole sono un
 * parametro della funzione (non lette da un modulo dati), quindi ogni
 * test costruisce il proprio array `CategoryRule[]` fittizio inline.
 */
import { describe, expect, it } from "vitest";
import { deriveCategories, withDerivedCategories } from "../../src/lib/category-derivation";
import type { CategoryRule } from "../../src/lib/category-derivation";

describe("deriveCategories — §1 derivazione pura per keyword", () => {
  const sicurezza: CategoryRule[] = [
    { slug: "sicurezza", keywords: ["vulnerabilità", "cve"] },
  ];

  it("match case-insensitive: keyword 'cve' matcha 'CVE-2026-1234' nel testo", () => {
    expect(deriveCategories("Scoperta CVE-2026-1234 su un router domestico", sicurezza)).toEqual([
      "sicurezza",
    ]);
  });

  it("nessuna keyword nel testo → []", () => {
    expect(deriveCategories("Una storia qualunque senza termini rilevanti", sicurezza)).toEqual(
      [],
    );
  });

  it("due regole che matchano lo stesso testo: ordine di dichiarazione dell'array, non ordine nel testo", () => {
    const rules: CategoryRule[] = [
      { slug: "ia", keywords: ["gpt"] },
      { slug: "sicurezza", keywords: ["vulnerabilità"] },
    ];
    // Il testo menziona prima "vulnerabilità" e poi "GPT": se l'ordine
    // fosse text-driven il risultato sarebbe ["sicurezza", "ia"].
    const text = "Una vulnerabilità scoperta in un plugin per GPT";
    expect(deriveCategories(text, rules)).toEqual(["ia", "sicurezza"]);
  });

  it("due regole diverse con lo stesso slug che matchano entrambe → dedup, slug una sola volta", () => {
    const rules: CategoryRule[] = [
      { slug: "sicurezza", keywords: ["cve"] },
      { slug: "sicurezza", keywords: ["zero-day"] },
    ];
    const text = "Un CVE e uno zero-day nello stesso articolo";
    expect(deriveCategories(text, rules)).toEqual(["sicurezza"]);
  });

  it("array di regole vuoto → sempre [] qualunque sia il testo", () => {
    expect(deriveCategories("CVE zero-day vulnerabilità GPT qualsiasi cosa", [])).toEqual([]);
    expect(deriveCategories("", [])).toEqual([]);
  });
});

describe("withDerivedCategories — §2 fallback-only, Hermes vince sempre", () => {
  const rules: CategoryRule[] = [{ slug: "ia", keywords: ["intelligenza artificiale"] }];

  it("categories non vuoto → ritornato invariato anche se una regola matcherebbe", () => {
    const text = "Un pezzo di intelligenza artificiale che matcherebbe la regola 'ia'";
    expect(withDerivedCategories(["sicurezza"], text, rules)).toEqual(["sicurezza"]);
  });

  it("categories vuoto + match → slug derivato", () => {
    const text = "Nuovi progressi nell'intelligenza artificiale generativa";
    expect(withDerivedCategories([], text, rules)).toEqual(["ia"]);
  });

  it("categories vuoto + nessun match → [] (nessun errore, nessuno scarto)", () => {
    const text = "Una storia che non tocca nessuna keyword curata";
    expect(withDerivedCategories([], text, rules)).toEqual([]);
  });
});
