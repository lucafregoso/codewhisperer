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
| `--paper` | `#ffffff` | `#1c1c1b` | fondo pagina |
| `--ink` | `#111111` | `#f2f2ef` | testo, regole |
| `--ink-muted` / `--ink-faint` | `#444` / `#6f6f6f` | `#c2c2bd` / `#92928d` | corpo secondario / meta |
| `--signal` | `#d0db02` (lime di Luca, rgb 208·219·2) | `#d0db02` | **l'unico accento di testata**, SOLO strutturale in chiaro (1.5:1 su bianco, mai testo): barra nameplate, marker data, tinte, selection, ombra dei numerali |
| `--signal-ink` | `#5b6300` (oliva, 6.5:1) | `#d0db02` (12:1) | il segnale COME TESTO: kicker, contatori, sottolineature, virgolette |
| `--numeral-ink` + `--numeral-shadow` | ink + ombra lime 0.07em ("fuori registro") | lime pieno, senza ombra | numerali di rango, contatore Radar, ratio copertura |
| `--on-signal` | `#111111` | `#111111` | testo sopra campiture lime (selection) |
| `--signal-surface` | `#f6f8d0` | `#262b0e` | banda Radar |
| `--surface` | `#f4f4f2` | `#2a2a28` | colophon |
| `--accent-0..5` | ciclici | ciclici | SOLO etichette categoria nelle pagine /categoria/ |

Regole: il segnale è segnale, non decorazione (PRODUCT.md §2). Mai
introdurre un secondo accento di testata. Il lime puro non fa mai da
testo su fondo chiaro: lì parla l'oliva `--signal-ink`. I numerali
sono "sdoppiati" da stampa fuori registro in chiaro, lime pieni in
scuro. `::selection` lime con testo `--on-signal`.

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
SOLO su elementi cliccabili (sottolineature segnale 2px su link e
titoli; mai fondi hover su contenitori non-link: l'affordance non si
finge). Kill-switch globale `prefers-reduced-motion`. Il contenuto
non dipende mai da JS.
