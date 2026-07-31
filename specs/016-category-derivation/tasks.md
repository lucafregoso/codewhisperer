# 016 — Derivazione Locale delle Categorie · Tasks

Branch: `feature/016-category-derivation`. Ordine vincolante: T1-T4
sono il layer (funzione pura → dati per istanza → selettore →
innesto nel loader), T5-T6 i test, T7 il gate, T8 la review/merge.

- [x] T1 (astro-engineer) `src/lib/category-derivation.ts` (nuovo):
      `CategoryRule` (`{slug, keywords}`), `deriveCategories(text,
      rules)` (substring case-insensitive, dedup su slug, ordine di
      dichiarazione delle regole), `withDerivedCategories(categories,
      text, rules)` (fallback-only: `categories` non vuoto → invariato,
      altrimenti `deriveCategories(...)`) — nessuna dipendenza da
      Astro/fs/istanza attiva, regole passate come parametro
- [x] T2 (astro-engineer) `src/data/category-rules/default.ts`,
      `src/data/category-rules/rassegnai.ts`,
      `src/data/category-rules/sailes.ts` (nuovi): tutti
      `export const CATEGORY_RULES: CategoryRule[] = [];` — placeholder
      vuoti, nessuna regola inventata (gate HITL punto 4 di design.md)
- [x] T3 (astro-engineer) `src/data/category-rules.ts` (nuovo):
      selettore per istanza, mirror di `src/data/category-aliases.ts`
      (spec 015) — `curated = { rassegnai, sailes }`, fallback
      `category-rules/default.ts` per istanze non registrate
- [x] T4 (astro-engineer) `src/lib/editions-loader.ts`: importare
      `CATEGORY_RULES` da `../data/category-rules` e
      `withDerivedCategories` da `./category-derivation`; applicare a
      `stories` (dentro la `.map()` esistente, testo = `title\n\nbody`),
      `radar` (nuova `.map()`, testo = `text`) e `slowFeed` (nuovo,
      testo = `title\n\nbody`) prima di `parseData()`; aggiungere
      `radar` e `slowFeed` derivati esplicitamente nell'oggetto passato
      a `parseData()` (oggi ereditati impliciti dallo spread
      `...edition`); nessun'altra riga del loader cambia
      (`resolveImage`, podcast, conflitto date, watcher invariati)
- [x] T5 (test-engineer) `tests/unit/category-derivation.test.ts`
      (nuovo): `deriveCategories` — match case-insensitive, nessun
      match, ordine di dichiarazione delle regole (non ordine nel
      testo), dedup su slug ripetuto da regole diverse, array di
      regole vuoto → sempre `[]`; `withDerivedCategories` — categories
      non vuoto → invariato anche se una regola matcherebbe,
      categories vuoto + match → slug derivato, categories vuoto +
      nessun match → `[]` (criteri di accettazione §1 e §2)
- [x] T6 (test-engineer) `tests/unit/category-rules.test.ts` (nuovo,
      mirror di `tests/unit/source-aliases.test.ts`): selettore
      istanza default (nessun `INSTANCE`) → `[]`; import dinamico di
      `category-rules/sailes.ts` → `[]`; import dinamico di
      `category-rules/default.ts` → `[]` (criterio di accettazione §3)
- [x] T7 (test-engineer) `pnpm gate` verde (check + test:unit + build
      + test) su entrambe le istanze (`rassegnai` default,
      `INSTANCE=sailes`); verifica esplicita che il build del corpus
      reale non produca nessuna categoria nuova rispetto a prima della
      spec (`CATEGORY_RULES` vuoto ovunque, criterio di accettazione
      §4 — no-op garantito); nessuna voce nuova attesa in
      `tests/regressions.spec.ts` (nessun bug reale, solo nuova
      capacità dormiente)
- [x] T8 (reviewer) review costituzione (§1 §2) + i 7 punti del gate
      HITL di design.md rispettati (in particolare: fallback-only
      testato a sé via `withDerivedCategories`, innesto nel loader e
      non in `editions.ts`, nessuna interazione con
      `CATEGORY_ALIASES`, placeholder `rassegnai`/`sailes` vuoti); poi
      merge `feature/016-category-derivation` → `master`

## Gate HITL

Prima di T1: Luca approva `requirements.md` e `design.md` — in
particolare la lettura della tensione costituzionale §2 (punto 1 del
gate in entrambi i documenti) e i 7 punti del gate HITL di design.md.
Prima di T8 (merge): Luca approva l'esito di T7 e la review.
