# Spec 003 — Design

## Composizione (griglia 12 col, firma Wired)

1. **MastHead** — barra brand (nome testata uppercase condensed) +
   ThemeToggle. I link di navigazione arrivano con le rispettive spec.
2. **EditionHeader** — kicker "Edizione del {data}", occhiello (tldr) in
   serif grande, regola 3px sotto.
3. **Hero** — storia 1: headline `--text-hero`, corpo, fonti. 8 colonne.
4. **Lead** — storie 2–3 nelle 4 colonne restanti, hairline a sinistra.
5. **Griglia** — storie 4+ in card 3-up separate da hairline.
6. **RadarRail** — banda `--surface` con i one-liner + fonte.
7. **SlowFeedFeature** — banda full-width serif con titolo citato.
8. **CoverageFooter** — colophon small-caps con le statistiche.

## Componenti e contratti

- `EditionLayout.astro { edition }` — usato da `/` e `/edizioni/[date]/`:
  le due route non possono divergere (unica implementazione).
- `StoryCard.astro { story, variant: "hero"|"lead"|"grid" }` — headline con
  `id={story.slug}`, CategoryKicker se categorie presenti, corpo via
  `renderInline`, fonti come lista di SourceBadge.
- `SourceBadge.astro { source }` — `<a href={url}>` con "Nome · via Agg".
- `CategoryKicker.astro { categories }` — accent deterministico
  slug→hash→`--accent-N` (lib/accent.ts).
- `RadarRail`, `SlowFeedFeature`, `CoverageFooter`, `MastHead`,
  `ThemeToggle` come da inventario.
- `src/lib/dates.ts` — formatFullDate it-IT (Europe/Rome).

## Pagine

- `index.astro` → `getLatestEdition()` + EditionLayout, canonical `/`.
- `edizioni/[date].astro` → `getStaticPaths` da `getEditionsSorted()`.

## Test

homepage.spec aggiornato al contenuto reale (data + hero del 16 luglio),
edition.spec per il permalink del 14, anchor navigabile, no-JS e axe
invariati.
