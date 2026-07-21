# 014 — Istanze EdicolAI · Tasks

Branch: `feature/014-edicolai-istanze`. Ordine vincolante: T1–T3 sono
le fondamenta, T4–T6 i derivati, T7–T8 la CI, poi docs/test/review.

- [ ] T1 (astro-engineer) `src/data/instances.json`: registry con la
      sola istanza `rassegnai` (branding = attuale `site.ts`,
      basePath `/codewhisperer/`) + `src/lib/instance.ts` con
      `activeInstance()` (env `INSTANCE`, default dal registry, slug
      sconosciuto = errore con elenco slug validi)
- [ ] T2 (astro-engineer) `src/lib/content-dirs.ts` derivato
      dall'istanza attiva: default = lane manuale + submodule
      (valori identici a oggi), non-default = solo
      `<contentDir>/editions`; export names invariati
- [ ] T3 (astro-engineer) `src/data/site.ts` derivato dal branding;
      `src/data/aliases/{rassegnai,default}.ts` +
      `src/data/source-aliases.ts` come selettore (export invariati)
- [ ] T4 (astro-engineer) `astro.config.mjs`: `base` di fallback dal
      basePath dell'istanza attiva (env BASE_PATH continua a vincere;
      ramo Playwright invariato)
- [ ] T5 (astro-engineer + ui-designer) empty-state homepage: via il
      `throw` da `src/pages/index.astro`, stato "in edicola presto"
      con marker `data-empty-edition`; stringhe in
      `src/i18n/index.ts` (§8), stili solo da tokens.css (§5);
      verifica che archivio/rss/cerca reggano il corpus vuoto
      (build locale con istanza fittizia)
- [ ] T6 (test-engineer) unit: activeInstance (default/esplicito/
      sconosciuto), derivazioni content-dirs (default = snapshot dei
      valori attuali — regression guard), site derivato, alias per
      istanza; fixture di istanza fittizia fuori dal registry vero
- [ ] T7 (astro-engineer) `.github/workflows/deploy.yml`: loop
      istanze da instances.json (INSTANCE+BASE_PATH per build, merge
      in `_site/`: default a root, altre in `<slug>/`), e2e PRIMA
      delle build prod (commento incidente 2026-07-17 conservato),
      verifica per istanza (base path `_astro`, no 127.0.0.1:4399,
      guardia `data-empty-edition` se il corpus esiste), upload
      artifact unico
- [ ] T8 (astro-engineer) `.github/workflows/content-sync.yml`:
      update di TUTTI i submodule `input/*-daily`, commit message con
      i submodule cambiati; ci.yml invariato (verificare soltanto)
- [ ] T9 (spec-writer) docs: `docs/INGESTION.md` v2 (contratto
      slug→repo→submodule→URL, notifica per repo, runbook onboarding
      istanza) + `CLAUDE.md` (registry, env INSTANCE)
- [ ] T10 (test-engineer) `pnpm gate` verde SENZA env INSTANCE e con
      output identico all'attuale (diff spot su dist: base path,
      home, rss, pagefind presenti); smoke build locale
      `INSTANCE=rassegnai BASE_PATH=/codewhisperer/` = stessa dist
- [ ] T11 (reviewer) review costituzione (§2 §3 §5 §6 §8) + decisioni
      del Gate HITL rispettate; poi merge develop → master, deploy e
      verifica live della root (nessuna regressione URL/RSS/SEO)

## Gate HITL

Prima di T1: Luca approva requirements.md e design.md (in
particolare i 5 punti del gate in design). Prima di T11: Luca
approva l'esito del regression guard (T10) e la review.
