# CodeWhisperer — magazine delle rassegne Hermes

Astro 5 statico, deploy su GitHub Pages. Impagina in stile Wired le
rassegne tech giornaliere in markdown prodotte da **Hermes** (agente
esterno, locale + VPS). L'edizione più recente è la homepage.

> Questo file è il set di istruzioni canonico per ogni coding agent nel
> repo. La costituzione (`specs/000-constitution.md`) è vincolante.

## Comandi

La shell di default ha node v12 — usare SEMPRE node 24 di nvm:

```bash
export PATH="$HOME/.nvm/versions/node/v24.1.0/bin:$PATH"
pnpm dev          # dev server (porta 4600 via .claude/launch.json)
pnpm check        # astro check
pnpm test:unit    # Vitest (parser)
pnpm build        # build produzione (BASE_PATH) — build:test per la variante senza base
pnpm test         # Playwright, --workers=1 (server proprio su 4399)
pnpm gate         # check + test:unit + build + test — IL gate pre-merge
```

## Contenuto

- `input/*.md` — le rassegne di Hermes, **unica fonte di verità**. Mai
  modificarle a mano, mai convertirle: il parsing è a build time
  (`src/lib/editions-loader.ts` + `src/lib/parser/`). La data si estrae
  dall'H1 (`Edizione del 16 luglio 2026`), mai dal filename.
- Il contratto di ingestione per Hermes è `docs/INGESTION.md`.
- Categorie e fonti sono **emergenti** dal corpus: niente enum fissi.
  Alias/normalizzazioni in `src/data/source-aliases.ts`.

## Struttura

- `specs/` — SDD: costituzione + una cartella per feature
  (requirements/design/tasks). Nessuna implementazione senza spec approvata.
- `src/styles/tokens.css` — scala tipografica e colori CHIUSI: nessun
  literal nei componenti.
- `src/i18n/index.ts` — stringhe UI (solo `it` attivo, struttura pronta).
- `src/lib/url.ts` — `withBase()` obbligatorio per ogni href/asset interno.
- `tests/regressions.spec.ts` — ogni voce guarda un bug reale: mai cancellarle.
- I test NON presuppongono edizioni, contenuti o filename specifici in
  `input/`: il corpus è dinamico (lo popolano gli scraper di Hermes).
  I check di formato vivono su `tests/fixtures/`; i test e2e derivano
  date/fonti dal corpus reale via `tests/helpers/corpus.ts` e fanno
  skip esplicito quando una caratteristica manca (es. podcast: è
  opzionale, non un vincolo).

## Git flow

- `master` = live (il deploy parte da qui), `develop` = integrazione,
  `feature/NNN-slug` per ogni spec.
- Contenuto (nuove edizioni in `input/`): commit diretto su `master`
  (`content: edizione YYYY-MM-DD`) — la CI valida, il deploy segue.
- Codice: feature branch → merge su develop (`--no-ff`) → release su master.
- `pnpm gate` verde prima di ogni merge.

## Subagent

`.claude/agents/`: spec-writer, ui-designer, astro-engineer,
test-engineer, reviewer. Usarli per i rispettivi ruoli nelle spec.
