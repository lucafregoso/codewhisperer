# Spec 004 — Design

- `src/components/EditionNav.astro { prev?, next? }` — barra sotto
  l'edizione: ← precedente / successiva →. Le edizioni adiacenti si
  calcolano da `getEditionsSorted()` nelle pagine (`index.astro` passa
  solo prev; `[date].astro` entrambe via getStaticPaths props).
- `src/pages/edizioni/index.astro` — archivio: gruppi per
  `formatMonthYear`, righe con kicker data + occhiello (line-clamp CSS) +
  conteggio storie (`strings.archive.stories(n)`), regole hairline.
- `MastHead` accetta link di nav via slot già esistente: le pagine passano
  il link "Edizioni" (attivo con `aria-current="page"` quando pertinente).
- Test `tests/archive-nav.spec.ts`: walk completo dalla homepage alla
  edizione più vecchia via link precedente (5 passi), archivio elenca 5
  edizioni, nav MastHead presente.
