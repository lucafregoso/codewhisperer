# 014 — Istanze EdicolAI · Design

## ADR inline — istanze = build multiple + merge artifact

GitHub Pages serve UN solo artifact per sito. Decisione: ogni istanza
è una build Astro completa dello stesso repo (`INSTANCE=<slug>` +
`BASE_PATH` propri) e il deploy fonde le `dist/` in un artifact unico
(root = `rassegnai`, sottocartelle `<slug>/` per le altre). Ogni build
è autonoma: sitemap, robots, RSS e indice Pagefind per istanza, zero
stato condiviso a runtime.

Alternative scartate:
- *Build unica multi-root con routing per istanza*: `base` e
  `import.meta.env.BASE_URL` sono unici per build → withBase() (§6),
  sitemap, RSS e Pagefind andrebbero reinventati per-cartella. Troppa
  complessità per zero benefici.
- *Un repo/Pages per istanza*: N repi Astro da tenere allineati,
  URL sparsi su project pages diversi. Contraddice "un solo
  impaginatore".
- *Matrix di job + merge artifact*: N checkout/LFS/setup, un job di
  merge dedicato, e l'ordine e2e→build-prod (incidente 2026-07-17) va
  ri-garantito tra job. Con N piccolo il loop sequenziale in un job è
  più semplice e più sicuro.

## Registry — `src/data/instances.json` (nuovo)

JSON (non TS) perché va letto anche da `astro.config.mjs` e dal loop
di deploy (jq/node) senza transpile:

```json
{
  "default": "rassegnai",
  "instances": [
    {
      "slug": "rassegnai",
      "contentDir": "input/rassegnai-daily",
      "basePath": "/codewhisperer/",
      "branding": {
        "name": "CodeWhisperer",
        "tagline": "La rassegna tech quotidiana, impaginata.",
        "description": "…(attuale)…",
        "themeColor": "#111111"
      }
    }
  ]
}
```

Regola per le nuove istanze: `contentDir = input/<slug>-daily`,
`basePath = /codewhisperer/<slug>/`. `rassegnai` codifica l'eccezione
root nel proprio `basePath`: nessun caso speciale nel codice.

## Selezione — `src/lib/instance.ts` (nuovo)

`activeInstance()`: legge `process.env.INSTANCE` (default: campo
`default` del registry), valida lo slug — sconosciuto = `throw` con
l'elenco degli slug validi (fail fast, prima di qualsiasi parse).
Modulo senza dipendenze Astro: importabile da loader, integrazione
`.mjs`, test helper e Vitest.

## Derivati (file toccati, API invariata)

- `src/lib/content-dirs.ts` — derive dall'istanza attiva:
  - default: `EDITION_DIRS = ["input", "<contentDir>/editions"]`
    (lane manuale inclusa, identico a oggi);
  - non-default: `EDITION_DIRS = ["<contentDir>/editions"]` — la lane
    manuale è ambigua con N istanze (a quale magazine apparterrebbe un
    drop in `input/`?): resta un'esclusiva dell'istanza storica.
  - `PODCAST_DIRS` / `IMAGES_DIR` derivano con la stessa logica.
  - Export names invariati: loader, content-assets.mjs e
    tests/helpers/corpus.ts non cambiano import.
- `src/data/site.ts` — `site` derivato da `branding` dell'istanza
  attiva (`titlePattern = "%s — <name>"`); `lang`/`ogLocale` restano
  globali (i18n, solo `it`). Export shape invariata: BaseLayout,
  MastHead, rss.xml, structured-data, i18n non cambiano.
- `src/data/source-aliases.ts` — diventa un selettore: riesporta il
  modulo alias dell'istanza attiva da `src/data/aliases/<slug>.ts`
  (nuova cartella; `rassegnai.ts` = contenuto attuale, `default.ts` =
  set vuoti per le istanze senza file curato). Export names invariati:
  `src/lib/parser/sources.ts` non cambia.
- `astro.config.mjs` — `base: env.BASE_PATH || basePath dell'istanza
  attiva` (import del JSON): in locale `INSTANCE=x pnpm build` produce
  già il base giusto senza dover passare due env. Il ramo Playwright
  (base "/", site 127.0.0.1) resta invariato.

## Corpus vuoto — `src/pages/index.astro` + i18n

Oggi zero edizioni = `throw`. Con EdicolAI un'istanza nasce PRIMA del
primo drop del suo profilo: il `throw` renderebbe impossibile fare
onboarding. La homepage con corpus vuoto rende uno stato "in edicola
presto" (stringhe nuove in `src/i18n/index.ts`, §8) con un marker
`data-empty-edition` nel markup. La sicurezza che il `throw` dava
(mai un sito vuoto live per un checkout fallito) si sposta nella
guardia CI: vedi sotto. Le pagine derivate (archivio, rss, cerca)
già iterano su liste: con lista vuota producono pagine vuote valide
(da verificare in implementazione con una build `INSTANCE` fittizia).

## RSS e Pagefind per istanza

Nessun lavoro previsto, solo verifica: `rss.xml.ts` usa
`context.site` + `withBase()` e `pnpm build` esegue `pagefind --site
dist` per build → ogni istanza ha feed e indice sotto il proprio base
path, autonomi per costruzione. Il check CI base-path per istanza li
copre (presenza `pagefind/` e `rss.xml` in ogni dist). Il
`robots.txt` delle istanze in sottocartella è inerte (valido solo a
root): innocuo, nessuna esclusione necessaria.

## CI

### `.github/workflows/deploy.yml`

Un solo job build, loop sequenziale (ADR sopra):

1. checkout con submodules + LFS pull (invariato);
2. check + unit (invariato);
3. **e2e (`pnpm test`) — PRIMA di ogni build di produzione**: il
   commento sull'incidente 2026-07-17 resta al suo posto; l'e2e gira
   una volta, sull'istanza di default (decisione: la verifica
   multi-istanza è dei check di build, non di Playwright);
4. loop sulle istanze (lista da `instances.json` via node/jq):
   `INSTANCE=<slug> BASE_PATH=<basePath> pnpm build`, poi copia di
   `dist/` in `_site/` (default → root; altre → `_site/<slug>/`);
5. verifica per istanza (evoluzione dello step attuale):
   `index.html` referenzia `${BASE_PATH%/}/_astro`, niente
   `127.0.0.1:4399`, e se `<contentDir>/editions/*.md` esiste con
   almeno un file l'`index.html` NON contiene `data-empty-edition`
   (guardia anti-deploy-vuoto);
6. upload di `_site/` come unico artifact Pages.

### `.github/workflows/content-sync.yml`

`git submodule update --remote input/rassegnai-daily` →
`git submodule update --remote` (tutti i submodule, che per contratto
sono solo `input/*-daily`). Il commit messaggio elenca i submodule
cambiati con i loro sha. Trigger e meccanica dispatch→deploy
invariati: ogni repo `<slug>-daily` replica lo stesso workflow di
notifica (`repository_dispatch` `content-update`).

### `.github/workflows/ci.yml`

Invariato: il gate PR gira sull'istanza di default — è esattamente il
regression guard richiesto.

## Docs — `docs/INGESTION.md` v2 + `CLAUDE.md`

INGESTION: nuova sezione "Profili e istanze" col contratto
slug→repo→submodule→URL, la nota che il formato markdown è identico
per ogni profilo, e la ricetta di notifica replicata per repo (il
blocco yaml esistente, parametrizzato sul nome repo). CLAUDE.md:
paragrafo contenuto/struttura aggiornato (registry, `INSTANCE`).

## Onboarding di una nuova istanza (runbook, in INGESTION)

1. EdicolAI crea profilo `<slug>` e repo `<slug>-daily` (pubblico,
   LFS, workflow di notifica);
2. qui: `git submodule add https://…/<slug>-daily input/<slug>-daily`
   + entry nel registry (branding incluso) + eventuale
   `src/data/aliases/<slug>.ts` (opzionale, default vuoto);
3. merge → il deploy pubblica `/codewhisperer/<slug>/` (vuota "in
   edicola presto" finché non arriva il primo drop).

## Test

- Unit (`tests/unit/`): `activeInstance()` — default senza env, slug
  esplicito, slug sconosciuto = errore con elenco; derivazioni
  content-dirs (default = valori attuali ESATTI: regression guard;
  non-default = solo submodule); site derivato dal branding; alias
  per istanza (default = attuali, istanza fittizia = vuoti). Le
  istanze fittizie dei test vivono in fixture, non nel registry vero.
- E2E: suite esistente invariata, istanza default (corpus dinamico
  via tests/helpers/corpus.ts, skip espliciti — nessuna assunzione
  sui contenuti).
- CI: la verifica multi-istanza è lo step 5 del deploy (per-istanza:
  base path, no-localhost, guardia empty).
- Regressione: nessuna voce nuova in `tests/regressions.spec.ts`
  (nessun bug reale ancora); la guardia 2026-07-17 resta coperta
  dall'ordine del workflow e dal check per-istanza.

## Gate HITL

Luca approva: (1) registry JSON con `basePath` esplicito; (2) lane
manuale solo per l'istanza default; (3) empty-state al posto del
`throw` + guardia CI `data-empty-edition`; (4) loop sequenziale nel
deploy invece della matrix; (5) INGESTION v2 col runbook onboarding.
