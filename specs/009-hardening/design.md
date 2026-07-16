# Spec 009 — Design

Esiti della review pre-release (reviewer-agent, read-only):

- **Bloccanti corretti**: label statistiche di CoverageFooter spostate in
  `i18n.edition.coverageLabels`; README committato; spec 008 design.md e
  spec 009 aggiunte.
- **Note applicate**: e2e nel workflow di deploy (i drop su master erano
  gated solo da check+unit+build); `md.ts` usa
  `parser.parseInline(tokens)` + sanitizzazione href (quote-breakout,
  schemi non-http); JSON-LD con `<` escapato; sottolineature hover con
  `var(--rule-weight)`.
- **Note accettate senza modifica** (motivate): root font-size 17px in
  global.css è la base sanzionata della scala; `themeColor` statico nel
  meta è il valore brand; ThemeToggle inerte senza JS è progressive
  enhancement (il tema segue comunque prefers-color-scheme).

## Rimandato al setup GitHub (manuale, README §Setup)

Branch protection su develop, variabili SITE_URL/BASE_PATH, deploy key
Hermes.
