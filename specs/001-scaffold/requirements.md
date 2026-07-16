# Spec 001 — Scaffold

## Obiettivo

Fondazione del progetto: repo con git flow, skeleton Astro 5 funzionante,
design token v0, pipeline CI/CD pronta per GitHub Pages, struttura SDD e
subagent. Una shell "CodeWhisperer" deployabile dal giorno uno.

## User story

- Come Luca, voglio un repo con master/develop/feature/* così da lavorare
  in git flow da subito.
- Come agente di build, voglio `pnpm gate` che valida tutto (check, unit,
  build, e2e) così da avere un unico comando di qualità.
- Come visitatore, voglio vedere una homepage placeholder con l'identità
  CodeWhisperer così da verificare il deploy end-to-end.

## Criteri di accettazione

- Dato il repo, quando eseguo `git branch`, allora esistono `master`,
  `develop` e la feature branch corrente.
- Dato `pnpm gate`, quando lo eseguo con node 24, allora tutti e quattro i
  passi sono verdi.
- Data la homepage, quando la apro senza JavaScript, allora il contenuto è
  visibile e senza errori.
- Dato un build con `BASE_PATH=/codewhisperer/`, quando ispeziono gli href,
  allora nessun link interno bypassa il base path.
- Dati i workflow GitHub, quando apro una PR verso develop o master parte
  la CI; quando pusho su master parte il deploy Pages.

## Fuori scope

Parser, content collection, pagine edizione (spec 002–003).
