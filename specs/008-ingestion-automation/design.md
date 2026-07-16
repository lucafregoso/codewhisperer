# Spec 008 — Design

- `scripts/validate-edition.mjs` — importa il parser reale
  (`src/lib/parser/parse-edition.ts`) via type-stripping nativo di node 24
  (richiede import con estensione `.ts` esplicita +
  `allowImportingTsExtensions` nel tsconfig; niente parameter properties
  nelle classi). Exit 0 con riepilogo (`YYYY-MM-DD — N storie…`),
  exit 1 con `file:riga — messaggio`.
- `scripts/publish-edition.sh` — guardie: working tree pulito, `--dry-run`
  si ferma dopo la validazione, push solo se esiste `origin`. Flusso:
  valida → copia in `input/` → commit su master
  (`content: edizione YYYY-MM-DD`) → push → back-merge develop → push.
- Trasporto dal VPS: **push via deploy key** (write access) — più
  semplice di repository_dispatch e già coperto dalla CI di deploy.
- `docs/INGESTION.md` è il contratto completo consegnabile a Hermes.

## Gate HITL

Luca esegue il setup GitHub (repo, Pages, variabili, deploy key) — punti
1–5 del README; lo script è testabile in locale anche senza remote.
