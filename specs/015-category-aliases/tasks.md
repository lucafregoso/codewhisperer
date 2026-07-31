# 015 — Alias Categorie · Tasks

Branch: `feature/015-category-aliases`. Ordine vincolante: T1-T3 sono
il layer (dati → selettore → parser), T4-T5 i test, T6 il gate, T7 la
review/merge.

- [x] T1 (astro-engineer) `src/data/aliases/rassegnai.ts` e
      `src/data/aliases/default.ts`: aggiungere
      `export const CATEGORY_ALIASES: Record<string, string> = {};`
      accanto a `SOURCE_ALIASES` in entrambi i file — vuoto in
      entrambi, nessuna migrazione di dati (gate HITL punto 2)
- [x] T2 (astro-engineer) `src/data/category-aliases.ts` (nuovo):
      selettore per istanza mirror di `src/data/source-aliases.ts`,
      un solo export `CATEGORY_ALIASES` (nessun equivalente
      `AGGREGATOR_*`, le categorie non hanno pattern "via")
- [x] T3 (astro-engineer) `src/lib/parser/parse-edition.ts`:
      importare `CATEGORY_ALIASES` da `../../data/category-aliases.ts`;
      sostituire `parseCategories()` con la versione che applica
      `canonicalCategorySlug()` (lookup case-insensitive/trim, fallback
      `slugify()`) e dedup con ordine di prima occorrenza; nessuna
      modifica alle regex `CATEGORIE_LINE` / `RADAR_CAT_SUFFIX` né ai
      call site (story, slow-feed, radar ereditano il comportamento
      dalla stessa funzione)
- [x] T4 (test-engineer) `tests/unit/category-aliases.test.ts` (nuovo,
      mirror di `tests/unit/source-aliases.test.ts`): selettore
      istanza default → `{}`; `aliases/rassegnai.ts` → `{}`;
      `aliases/default.ts` → `{}` (criterio di accettazione §1)
- [x] T5 (test-engineer) `tests/unit/parse-categories-aliases.test.ts`
      (nuovo, file separato da `parse-edition.test.ts` per isolare il
      `vi.mock`): mock di `src/data/category-aliases` con una mappa
      fittizia; markdown sintetico inline per verificare
      normalizzazione case-insensitive/trim, fallback `slugify()` per
      termine assente dalla mappa, e dedup con ordine di prima
      occorrenza su una riga `**Categorie:**` con due sinonimi
      (criterio di accettazione §2); verifica di non-regressione:
      `tests/fixtures/edge-categorie.md` via `parse-edition.test.ts`
      resta verde invariato (mappa vuota di `rassegnai` = comportamento
      attuale, criterio §2 secondo bullet)
- [x] T6 (test-engineer) `pnpm gate` verde (check + test:unit + build
      + test); nessuna voce nuova attesa in `tests/regressions.spec.ts`
      (nessun bug reale, solo nuova capacità) né in `filters.spec.ts`
      (criterio §3 coperto per costruzione, vedi design.md)
- [x] T7 (reviewer) review costituzione (§1 §2) + i 4 punti del gate
      HITL di design.md rispettati (parseCategories in place, selettore
      a un export, editions.ts invariato, test isolati con vi.mock);
      poi merge `feature/015-category-aliases` → `master`

## Gate HITL

Prima di T1: Luca approva `requirements.md` e `design.md` (i 4 punti
del gate in design.md). Prima di T7 (merge): Luca approva l'esito di
T6 e la review.
