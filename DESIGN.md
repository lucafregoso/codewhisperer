# Design

Sistema visivo di CodeWhisperer. Fonte di verità operativa:
`src/styles/tokens.css` (scala CHIUSA, costituzione §5 — nessun
font-size/colore literal fuori da lì). Strategia e voce: `PRODUCT.md`.

## Theme

Testata quotidiana paper/ink con UN accento di segnale. Due temi
(chiaro/scuro) via `:root[data-theme]`, script pre-paint, entrambi
verificati axe AA in CI.

## Colors

| Ruolo | Chiaro | Scuro | Uso |
|---|---|---|---|
| `--paper` | `#ffffff` | `#131313` | fondo pagina |
| `--ink` | `#111111` | `#f2f2ef` | testo, regole |
| `--ink-muted` / `--ink-faint` | `#444` / `#6f6f6f` | `#c2c2bd` / `#8f8f8a` | corpo secondario / meta |
| `--signal` | `#c64400` (4.9:1) | `#ff8a4d` (8:1) | **l'unico accento di testata**: numerali, marker, hover, kicker podcast, conteggi |
| `--signal-surface` | `#fbeadd` | `#281910` | banda Radar, hover righe indice |
| `--surface` | `#f4f4f2` | `#1d1d1c` | colophon |
| `--accent-0..5` | ciclici | ciclici | SOLO etichette categoria nelle pagine /categoria/ |

Regole: il segnale è segnale, non decorazione (PRODUCT.md §2). Mai
introdurre un secondo accento di testata. `::selection` in segnale.

## Typography

- Display: **Archivo Variable**, `wdth 78` (condensed), peso 860 —
  headline, numerali, nav, meta. Kicker a larghezza piena, +0.08em.
- Corpo: **Source Serif 4 Variable** — testo, deck, feed lento.
- Scala chiusa (root 17px): meta .72 · kicker .78 · body-sm .92 ·
  body 1 · deck 1.18 · title 1.35 · headline clamp(1.6→2.3) · hero
  clamp(2.1→3.4). Aggiungere un gradino = giustificarlo in spec.

## Signature

- **Numerali di rango**: le storie sono una sequenza 1–8; il numero
  in segnale è il primo elemento di ogni anatomia.
- **Immagini solo dal contratto**: l'arte del pezzo esiste solo se
  l'edizione porta la riga `**Immagine:** URL — alt` (hero sotto il
  titolo, lead sopra, indice thumbnail 4:3). Nessuna immagine →
  nessuno slot riservato, mai grafica generata di riempimento.
- **Barra segnale** corta sotto il nameplate; regole ink 3px
  (`--rule-weight`) tra le sezioni; hairline 1px nelle griglie.
- **Bande full-bleed**: `::before` con `inset-inline: calc(50% - 50vw)`
  (html `overflow-x: clip`); la banda Radar è territorio del segnale
  (surface tinta + regola superiore segnale).

## Layout

- Shell 76rem, misura 62ch, spazi 0.5/1/1.75/3rem.
- **Prima pagina a ranghi, senza buchi**: grid ad aree — hero in
  alto a sinistra, l'indice denso risale subito sotto, i lead
  corrono in colonna destra (hairline). Ordine DOM = ordine
  editoriale 1..n. Tre anatomie, mai otto blocchi uguali.
- Radar a 2 colonne CSS (`columns`), item con hairline.
- Mobile: tutto in colonna, thumbnail d'indice nascoste sotto 48rem,
  nav scrollabile senza scrollbar.

## Components

MastHead (nameplate + barra segnale) · EditionLayout (header meta con
jump di data, ranghi) · StoryCard (hero/lead/index) ·
SourceBadge (pieno su /fonte/, sussurrato nelle storie) · RadarRail ·
SlowFeedFeature (serif italic, virgolette segnale) · CoverageFooter
(colophon, numeri tabulari, ratio in segnale) · PodcastPlayer (audio
nativo, kicker segnale) · EditionNav (fondo pagina) · Pagination ·
TermIndex · CorpusItemCard.

## Motion & interaction

Il brand sceglie la sobrietà: nessuna entrance choreography. Hover
con transizioni brevi (160ms, `--ease-out`), sottolineature segnale
2px, fondo `--signal-surface` sulle righe indice. Kill-switch globale
`prefers-reduced-motion`. Il contenuto non dipende mai da JS.
