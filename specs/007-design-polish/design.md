# Spec 007 — Design

- **Full-bleed**: tecnica del riferimento — `.full-bleed::before` con
  `inset-inline: calc(50% - 50vw)` e background della banda;
  `html { overflow-x: clip }` già attivo. RadarRail e CoverageFooter
  diventano sezioni full-bleed con contenuto in .shell.
- **Gerarchia**: EditionHeader promuove la data a `<h1>` display
  (uppercase, `--text-headline`); StoryCard hero → h2 (già), lead/grid →
  h3 (già). L'occhiello resta p.
- **Radar**: `columns: 3` su desktop (>= 64rem), 2 su tablet, 1 mobile;
  item con `break-inside: avoid`.
- **MastHead**: flex-wrap + riga nav scrollabile orizzontale su mobile
  senza scrollbar visiva.
- Nessun nuovo token; si riusano quelli esistenti.
