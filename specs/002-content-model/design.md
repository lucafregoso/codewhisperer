# Spec 002 — Design

## Architettura

`input/*.md` → custom loader (`src/lib/editions-loader.ts`) → parser puro
(`src/lib/parser/`) → entry Zod-validate (`src/content.config.ts`).
I corpi restano markdown inline nel parse; la conversione HTML
(`src/lib/md.ts`, marked.parseInline con link induriti) avviene nel loader.

## Parser (funzioni pure, Vitest)

- `italian-date.ts` — "16 luglio 2026" → "2026-07-16" (12 mesi, "1º"/"1°").
- `slug.ts` — slugify stabile senza accenti per anchor e slug fonte.
- `sources.ts` — parsing riga `**Fonti:**` (split su `;`), pattern
  `[Label](url) — nota`; risoluzione via: se la label è `A (B)` e l'host
  della URL appartiene a un aggregatore noto (techmeme, hacker-news,
  lobste-rs — in `src/data/source-aliases.ts`), l'aggregatore è `via` e
  l'altro nome è `source`, in entrambi gli ordini. Label semplice →
  `source` = slug(label), niente via.
- `parse-edition.ts` — sezioni per keyword H2 (tollerante alle emoji):
  "In primo piano", "Radar", "Dal feed lento", "Nota di copertura".
  Storie `### N. Titolo` + corpo + `**Fonti:**` + opzionale
  `**Categorie:** a, b`. Radar: `- testo — [Fonte](url)` + opzionale
  suffisso `[cat: a, b]`. Errori: `EditionParseError {line, message}`.

## Contratto categorie (docs/INGESTION.md)

Vocabolario libero, slug normalizzati dal sito. Storie: riga
`**Categorie:**` dopo `**Fonti:**`. Radar: suffisso `[cat: …]`.
Assenza = `categories: []` (mai errore).

## Loader

Astro Content Loader API: legge `input/`, id = data ISO, `parseData` per
la validazione Zod, digest per il caching. Filename irrilevante (la data
viene dall'H1); due edizioni con la stessa data = errore.

## Helpers (`src/lib/editions.ts`)

`getEditionsSorted()`, `getLatestEdition()`, `getAllStories()` (flatMap con
data), `getEmergentCategories()`, `getEmergentSources()`.

## Gate HITL

Luca valida il contratto INGESTION.md (in particolare i marker categorie)
prima di darlo a Hermes. Il codice resta retrocompatibile comunque.
