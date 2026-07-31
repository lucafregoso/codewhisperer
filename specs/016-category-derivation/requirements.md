# 016 — Derivazione Locale delle Categorie · Requirements

## Obiettivo

Nessuna edizione esistente (`input/rassegnai-daily/`, `input/sailes-daily/`)
scrive oggi righe `**Categorie:**` o suffissi `[cat: …]`: il layer di
parsing/normalizzazione delle categorie (spec 015) è corretto ma
**dormiente**, perché Hermes non produce ancora quel dato. Questa spec
introduce una derivazione locale: quando un item (storia, radar, feed
lento) non ha categorie scritte da Hermes, CodeWhisperer ne calcola a
build time da un dizionario curato `keyword → slug categoria`,
valutato come funzione pura sul testo dell'item — niente enum
predefinito consultabile a parte, niente LLM, niente chiamata esterna,
niente storage intermedio da rigenerare a mano. Il risultato alimenta
`getEmergentCategories()` come una categoria emersa qualunque.

Complementare a `specs/015-category-aliases/` (normalizzazione di
categorie **già scritte** da Hermes): questa spec copre il caso in cui
Hermes non scrive nulla.

## User story

- Come Luca (curatore), osservo che un termine ricorre nel corpo di
  molte storie ("CVE", "vulnerabilità", "zero-day") senza che Hermes
  le tagghi mai come categoria: aggiungo una regola
  `{ slug: "sicurezza", keywords: [...] }` al file dell'istanza e, dal
  build successivo, tutte le storie passate e future che contengono
  quei termini nel testo — e che Hermes non ha già categorizzato —
  appaiono sotto `/categoria/sicurezza/`, senza toccare un solo
  markdown in `input/`.
- Come lettore, trovo più storie sotto `/categoria/…/` di quelle che
  Hermes ha esplicitamente taggato, perché CodeWhisperer riempie il
  vuoto con una stima deterministica quando il campo è assente.
- Come Hermes, il mio contratto (`docs/INGESTION.md`) non cambia in
  nulla: se in futuro comincio a scrivere `**Categorie:**` per un
  item, quella riga vince sempre su qualunque regola locale per quello
  stesso item — non devo mai "difendermi" da una categoria derivata
  che sovrascrive la mia.

## Criteri di accettazione

Testabili con Vitest (funzione pura + selettore — nessuna superficie
e2e nuova: il risultato confluisce nello stesso `categories: string[]`
già coperto da `filters.spec.ts`).

### 1. Derivazione pura per keyword

- Dato un array di regole con una entry
  `{ slug: "sicurezza", keywords: ["vulnerabilità", "cve"] }`, Quando
  `deriveCategories(text, rules)` gira su un testo che contiene
  "CVE-2026-1234" (case diverso dalla keyword), Allora il risultato
  include `"sicurezza"`.
- Dato lo stesso array di regole, Quando il testo non contiene nessuna
  keyword, Allora il risultato è `[]`.
- Dato due regole che matchano entrambe lo stesso testo, Quando
  `deriveCategories` gira, Allora il risultato le contiene entrambe
  nell'ordine di dichiarazione dell'array `rules` (non l'ordine di
  comparsa nel testo).
- Dato due regole con lo stesso `slug` che matchano entrambe (keyword
  diverse), Quando `deriveCategories` gira, Allora quello slug compare
  una sola volta nel risultato (dedup).
- Dato un array di regole vuoto (`[]`), Quando `deriveCategories` gira
  su qualsiasi testo, Allora il risultato è sempre `[]` — invariante
  che rende il layer un no-op finché un'istanza non ha regole curate.

### 2. Fallback-only — Hermes vince sempre

- Dato un item con `categories` non vuoto (es. `["ia"]`) e un testo
  che matcherebbe una regola diversa, Quando
  `withDerivedCategories(categories, text, rules)` gira, Allora
  ritorna `categories` invariato — la regola locale non viene mai
  valutata quando Hermes ha già scritto qualcosa per quell'item.
- Dato un item con `categories` vuoto (`[]`) e un testo che matcha una
  regola, Quando `withDerivedCategories([], text, rules)` gira, Allora
  ritorna l'array con lo slug derivato.
- Dato un item con `categories` vuoto e nessuna regola che matcha,
  Quando `withDerivedCategories([], text, rules)` gira, Allora ritorna
  `[]` — nessun errore, nessuno scarto (costituzione §2).

### 3. Selettore per istanza

- Dato nessun env `INSTANCE` (istanza `rassegnai`), Quando importo
  `src/data/category-rules.ts`, Allora `CATEGORY_RULES` è `[]`
  (placeholder pronto, nessuna regola curata oggi).
- Dato `src/data/category-rules/sailes.ts`, Quando lo importo
  direttamente, Allora `CATEGORY_RULES` è `[]`.
- Dato `src/data/category-rules/default.ts` (fallback per istanze non
  ancora registrate nel selettore), Quando lo importo direttamente,
  Allora `CATEGORY_RULES` è `[]`.

### 4. Nessuna regressione sul corpus reale

- Dato che `CATEGORY_RULES` è vuoto per `rassegnai` e `sailes` in
  questa spec (nessuna curatela reale, vedi Fuori scope), Quando
  `pnpm build` gira su entrambe le istanze, Allora l'output è
  identico a prima di questa spec: nessuna categoria compare dal
  nulla sul corpus reale — regression guard verificata da `pnpm gate`.

## Fuori scope

- Curatela reale di `CATEGORY_RULES` per `rassegnai` o `sailes`:
  entrambi i file placeholder partono vuoti (`[]`); riempirli con
  regole osservate sul corpus è un lavoro editoriale successivo,
  mirror della scelta fatta in spec 015 per `CATEGORY_ALIASES`.
- Instradare lo slug emesso da una regola attraverso `CATEGORY_ALIASES`
  (spec 015): le regole emettono slug canonici direttamente, scritti
  a mano dal curatore — vedi design.md per la motivazione.
- Un flag di provenienza (`derived` vs `authored`) nello schema o
  nella UI: una categoria derivata è indistinguibile da una scritta da
  Hermes una volta assegnata, per design — nessuna superficie
  parallela.
- Matching "intelligente" (stemming, sinonimi automatici, NLP, LLM):
  solo substring case-insensitive, deterministico, zero chiamate
  esterne in build (build statica Astro).
- Qualsiasi modifica a `docs/INGESTION.md`: il contratto markdown per
  Hermes non cambia — la derivazione è interamente interna a
  CodeWhisperer, invisibile a chi scrive le edizioni.
- Qualsiasi modifica a `/categoria/*.astro`, `CategoryKicker.astro`,
  `rss.xml.ts`, `src/lib/editions.ts`: consumano già
  `categories: string[]` risolte a monte nel loader e non cambiano.
- Un indice o una cache persistente da rigenerare a parte: la
  derivazione è una funzione pura valutata a ogni build sul corpus
  corrente (vedi design.md).

## Gate HITL

Luca approva prima dell'implementazione:

1. La lettura della tensione costituzionale (§2) proposta in
   design.md — le regole locali si applicano solo item per item dove
   Hermes non ha scritto nulla, lo spazio delle keyword/slug resta
   sempre aperto, il risultato non introduce una superficie parallela
   a `/categoria/`. Questa lettura, non la riga di costituzione, è
   ciò che serve un'approvazione esplicita.
2. Punto di innesto: `src/lib/editions-loader.ts` (non
   `src/lib/editions.ts`), fallback-only via `withDerivedCategories()`
   applicata a storie, radar e feed lento prima della validazione Zod.
3. `CATEGORY_RULES` parte vuoto per `rassegnai` E `sailes` (file
   placeholder pronti, zero taxonomy inventata in questa spec) —
   nessuna curatela reale.
4. Nessuna interazione con `CATEGORY_ALIASES` (spec 015): le regole
   emettono slug canonici direttamente, senza passare dal layer di
   normalizzazione del parser.
