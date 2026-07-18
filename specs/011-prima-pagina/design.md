# 011 — Prima pagina a ranghi · Design

## Token (tokens.css)

- `--signal` (chiaro #c64400 ≈ OKLCH 0.58 0.19 45, AA 4.9:1 su paper;
  scuro #ff8a4d, 8:1 su paper scuro) e `--signal-surface` (tinta banda:
  chiaro #fbeadd, scuro #281910). Il segnale è UNO: gli accent ciclici
  per categoria restano solo nelle pagine /categoria/.
- `--text-hero` scende a clamp(2.1rem, 3.8vw, 3.4rem): il titolone non
  deve più mangiarsi il fold (rapporto hero:title ≈ 2.5, sopra 1.25).
- Nessun altro gradino nuovo: numerali e indice riusano la scala.

## Stamp generativo (src/lib/stamp.ts + StoryStamp.astro)

`stampMarks(seed, cols, rows)`: FNV-1a sullo slug → mulberry32 →
griglia di celle {vuota | punto | tacca | blocco}, ~18% in signal,
resto ink. SVG inline `aria-hidden`, `currentColor` per l'ink così i
temi funzionano da soli. Stesso slug → stesso stamp, per sempre.
Taglie: hero (7×7, spalla destra), lead e indice (4×3, avantitolo).

## Anatomie (StoryCard.astro)

- `hero`: numerale gigante in signal (riusa --text-hero) + titolo
  display + deck serif + stamp in spalla (nascosto < 64rem).
- `lead`: numerale medio + titolo --text-headline + corpo sm.
- `index` (sostituisce `grid`): riga full-width — stamp piccolo,
  numerale signal, titolo --text-title, fonti in coda faint. Hairline
  tra le righe, hover con fondo --signal-surface.
- Fonti: SourceBadge resta (il via-pattern è informazione editoriale)
  ma nel contesto storia è demotizzato: peso normale, --ink-faint,
  separatori "·".

## EditionLayout

- `.edition-header`: riga meta con h1 `.edition-date` (display,
  marker quadrato signal) + `.edition-jump` (link ← data precedente /
  data successiva →, etichettati con la DATA — mai col testo
  "Edizione precedente", riservato ai .edition-nav-link di fondo
  pagina che i test contano). TLDR come deck serif. Player podcast
  resta nel header.
- Prima pagina: hero 8 col + lead 4 col (come oggi), poi sezione
  `.front-index` a righe (non più .front-grid 3-up).

## Bande

- **Radar**: full-bleed con `background: var(--signal-surface)` e
  `border-top: 3px var(--signal)`; titolo promosso a display
  --text-headline con marker; lista max 2 colonne.
- **Feed lento**: graffa tipografica grande in signal, resto serif.
- **Copertura**: numeri `tabular-nums`, ratio fonti in signal.
- **MastHead**: barra segnale corta sotto il nameplate (firma di
  testata), sopra la regola ink.
- **PodcastPlayer**: kicker in signal, regola superiore invariata.
- Global: `::selection` in signal; i link nel corpo delle storie
  hanno sottolineatura signal 2px.

## Contratto immagini future (docs/INGESTION.md)

Sezione "Immagini (futuro, opzionale)": riga `**Immagine:** URL — alt`
dopo il corpo della storia; oggi ignorata dal parser, documentata
perché Hermes possa iniziare a emetterla senza rompere nulla.

## Test

Il gate esistente copre già gli hook (invariati). Aggiunte: nessuna —
il redesign è CSS/markup, i contratti non cambiano. Axe in entrambi i
temi valida i contrasti del signal.
