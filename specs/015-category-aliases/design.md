# 015 — Alias Categorie · Design

## Shape — `CATEGORY_ALIASES: Record<string, string>`

Stessa shape di `SOURCE_ALIASES`: chiave = termine grezzo **già scritto
in minuscolo** dal curatore (il lookup normalizza il termine
incontrato nel markdown, non le chiavi della mappa), valore = slug
canonico.

```ts
export const CATEGORY_ALIASES: Record<string, string> = {
  "ia": "intelligenza-artificiale",
  "intelligenza artificiale": "intelligenza-artificiale",
};
```

Nessun campo aggiuntivo (niente `{name, slug}` come le fonti): il
fuori-scope del requirements esclude un'etichetta preferita per
categoria, il label resta derivato dallo slug via title-case in
`getEmergentCategories()` (`src/lib/editions.ts`, invariato).

## File toccati

### `src/data/aliases/rassegnai.ts` e `src/data/aliases/default.ts` (esistenti, un export in più)

Aggiungere accanto a `SOURCE_ALIASES`:

```ts
export const CATEGORY_ALIASES: Record<string, string> = {};
```

Vuoto in **entrambi** i file: `rassegnai` non ha ancora doppioni
curati (gate HITL punto 2), `default` resta il fallback vuoto per le
istanze senza file curato (pattern già stabilito da `SOURCE_ALIASES`
in spec 014). Nessun'altra modifica a questi due file.

### `src/data/category-aliases.ts` (nuovo)

Selettore per istanza, mirror esatto di `src/data/source-aliases.ts`
ma con un solo export (le categorie non hanno il concetto di
aggregatore/pattern "via", quello resta un'esclusiva delle fonti):

```ts
/**
 * Selettore degli alias categoria per istanza (spec 015): riespone il
 * modulo curato dell'istanza attiva da `src/data/aliases/<slug>.ts`,
 * con fallback alla mappa vuota di `aliases/default.ts` per le
 * istanze senza file curato. Mirror di `source-aliases.ts` (spec 014).
 *
 * Per curare gli alias categoria di un'istanza: aggiungere/estendere
 * `CATEGORY_ALIASES` in `src/data/aliases/<slug>.ts` (stesso file
 * degli alias fonte, stessa cartella).
 */
import { activeInstance } from "../lib/instance";
import * as fallback from "./aliases/default";
import * as rassegnai from "./aliases/rassegnai";

const curated: Record<string, typeof fallback> = { rassegnai };

const selected = curated[activeInstance().slug] ?? fallback;

export const CATEGORY_ALIASES = selected.CATEGORY_ALIASES;
```

Non un merge dentro `source-aliases.ts` esistente (gate HITL punto
1): quel file riesporta tre nomi (`AGGREGATOR_SLUGS`,
`AGGREGATOR_HOSTS`, `SOURCE_ALIASES`) che sono un contratto verso
`src/lib/parser/sources.ts` — aggiungere `CATEGORY_ALIASES` lì
mescolerebbe due concetti (fonti/aggregatori vs categorie) dietro un
solo nome di modulo, un import ambiguo per chi legge
`src/lib/parser/parse-edition.ts`.

### `src/lib/parser/parse-edition.ts` (esistente, punto di innesto)

Oggi `parseCategories()` (riga 37-42) è l'**unico** punto dove un
termine grezzo diventa slug — sia per la riga `**Categorie:**`
(story/slow-feed, invocata alle righe 112, 201) sia per il suffisso
radar `[cat: …]` (invocata alla riga 161). Non serve estrarlo in un
modulo dedicato come `sources.ts`: è già un choke point unico dentro
lo stesso file, a differenza delle fonti che hanno logica via-pattern
più corposa. Sostituzione in place:

```ts
import { CATEGORY_ALIASES } from "../../data/category-aliases.ts";

function canonicalCategorySlug(term: string): string {
  return CATEGORY_ALIASES[term.trim().toLowerCase()] ?? slugify(term);
}

function parseCategories(raw: string): string[] {
  const result: string[] = [];
  for (const part of raw.split(",")) {
    const term = part.trim();
    if (!term) continue;
    const canonical = canonicalCategorySlug(term);
    if (!result.includes(canonical)) result.push(canonical);
  }
  return result;
}
```

`canonicalCategorySlug()` mirror esatto di `canonicalSlug()` in
`src/lib/parser/sources.ts` riga 9-11 (stesso pattern
`MAPPA[term.trim().toLowerCase()] ?? slugify(term)`): coerenza
intenzionale, stesso vocabolario per chi legge i due parser.

Il dedup (`result.includes(canonical)` prima del push) sostituisce il
precedente `.filter(Boolean)` post-map: con un array di poche
categorie per riga (tipicamente 1-3) un controllo O(n) per inserimento
è trascurabile e preserva l'ordine di prima occorrenza richiesto dal
criterio di accettazione — non serve un `Set` con reinsert-order
guard più elaborato.

Nessun'altra riga di `parse-edition.ts` cambia: entrambi i call site
di `parseCategories()` (story/slow-feed via `CATEGORIE_LINE`, radar
via `RADAR_CAT_SUFFIX`) ereditano normalizzazione e dedup gratis,
senza toccare le regex né la struttura di `parseStories`/`parseRadar`.

## Interazione con la validazione Zod (`content.config.ts`)

`categories: z.array(slug)` (schema `slug` = regex
`/^[a-z0-9-]+$/`, righe 32/39/65 di `content.config.ts`) resta
l'unico validatore. `canonicalCategorySlug()` produce sempre uno slug
valido per il ramo di fallback (`slugify()` normalizza già
all'alfabeto ammesso), ma **non** per il ramo alias: se un curatore
scrive un valore malformato in `CATEGORY_ALIASES` (spazi, maiuscole,
caratteri fuori regex) il parser lo passa così com'è — nessun
validatore aggiuntivo nel parser, per design (costituzione §1, fail
fast; requirements criterio 3, secondo bullet). L'edizione che lo
contiene rompe la build con l'errore Zod standard su quel file/riga,
esattamente come oggi rompe un `slug` malformato scritto a mano nel
markdown. La responsabilità di scrivere valori canonici validi in
`CATEGORY_ALIASES` è del curatore (Luca), verificabile a colpo
d'occhio: la mappa è un file TypeScript di poche righe, non un input
utente.

## Effetto su `getEmergentCategories()` (`src/lib/editions.ts`)

Nessuna modifica di codice. La funzione già itera
`item.categories` (array già deduplicato da `parseCategories()`) e
somma `count` per slug — se due story sinonimo-mappate producono lo
stesso slug canonico, `getEmergentCategories()` le conta insieme
automaticamente, per costruzione. Il criterio di accettazione §3
primo bullet è quindi una conseguenza diretta della normalizzazione a
parse time, non un punto di codice separato da toccare.

## Test — dove e come

- `tests/unit/category-aliases.test.ts` (nuovo, mirror di
  `tests/unit/source-aliases.test.ts`): selettore d'istanza (criterio
  1) — import statico di `src/data/category-aliases.ts` (default,
  nessun env `INSTANCE`) → `{}`; import dinamico di
  `src/data/aliases/rassegnai.ts` → `CATEGORY_ALIASES` è `{}`; import
  dinamico di `src/data/aliases/default.ts` → `CATEGORY_ALIASES` è
  `{}`.
- `tests/unit/parse-categories-aliases.test.ts` (nuovo, file
  **separato** da `parse-edition.test.ts`): usa `vi.mock` sul modulo
  `../../src/data/category-aliases` con una mappa fittizia (es. `{
  "ia": "intelligenza-artificiale", "intelligenza artificiale":
  "intelligenza-artificiale" }`) per esercitare normalizzazione e
  dedup (criterio 2) su markdown sintetico costruito inline nel test,
  senza dipendere dalla curatela reale di `rassegnai` (che parte
  vuota, gate HITL punto 2) e senza inquinare `vi.mock` — file-scoped
  in Vitest — dell'altra suite. Copre: alias case-insensitive/trim,
  fallback `slugify()` per termine assente, dedup con ordine di prima
  occorrenza su una riga `**Categorie:**` con due sinonimi.
- `tests/unit/parse-edition.test.ts` (esistente, invariato salvo
  refusi): la fixture `tests/fixtures/edge-categorie.md` continua a
  passare con la mappa vuota di `rassegnai` — regression guard che il
  comportamento attuale (`slugify()` puro) non cambia per un'istanza
  senza curatela.
- Criterio 3 (`getEmergentCategories()`): coperto per costruzione dal
  test di dedup sopra (nessun nuovo unit test su `editions.ts`
  necessario, §"Effetto su getEmergentCategories()") + `filters.spec.ts`
  e2e esistente, invariato.

## Gate HITL

Luca approva prima dell'implementazione:

1. `canonicalCategorySlug()` in place dentro `parse-edition.ts`
   (nessun nuovo modulo `src/lib/parser/categories.ts`): il choke
   point è già unico oggi, un'estrazione separata non aggiungerebbe
   chiarezza.
2. `src/data/category-aliases.ts` con un solo export
   (`CATEGORY_ALIASES`), non un modulo a tre export come
   `source-aliases.ts` — le categorie non hanno aggregatori.
3. Nessuna modifica a `src/lib/editions.ts`
   (`getEmergentCategories()` eredita il dedup gratis dal parser).
4. Test di normalizzazione/dedup in un file Vitest dedicato con
   `vi.mock`, separato da `parse-edition.test.ts`, per non dipendere
   dalla curatela reale (oggi vuota) né rischiare interferenze tra le
   due suite.
