# 010 — Player podcast per edizione · Tasks

- [ ] T1 (test-engineer) `src/lib/podcast.ts` + unit test matching
- [ ] T2 (test-engineer) refactor filename-agnostico di
      `tests/unit/parse-edition.test.ts` (ricerca per data, non per file)
- [ ] T3 (astro-engineer) loader: campo `podcast` + watcher su
      `input/podcast/`; schema in `content.config.ts`
- [ ] T4 (astro-engineer) integrazione `podcast-assets` (dev middleware
      con Range + copia in `astro:build:done`), registrata in
      `astro.config.mjs`
- [ ] T5 (ui-designer) `PodcastPlayer.astro` + inserimento in
      `EditionLayout` + stringhe i18n + stile a token
- [ ] T6 (test-engineer) `tests/podcast.spec.ts` e2e corpus-derived +
      estensione `tests/helpers/corpus.ts`
- [ ] T7 docs/INGESTION.md: contratto podcast
- [ ] T8 `pnpm gate` verde, review (reviewer), merge develop → master
- [ ] T9 commit contenuto: rename corpus + `input/podcast/`, deploy,
      verifica live (player visibile, mp3 200)
