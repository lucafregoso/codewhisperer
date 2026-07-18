# 013 — Submodule rassegnai-daily · Design

## Sorgenti contenuto (src/lib/content-dirs.ts)

Modulo condiviso da loader, integrazione asset e test helper:

```ts
EDITION_DIRS = ["input", "input/rassegnai-daily/editions"]
PODCAST_DIRS = ["input/podcast", "input/rassegnai-daily/editions/podcast"]
IMAGES_DIR   = "input/rassegnai-daily/editions/images"
```

Directory assenti = ignorate (il sito funziona anche senza submodule
inizializzato, con la sola lane manuale).

## Parser

Nuova riga riconosciuta ovunque nel flusso: immagine markdown
standalone `![alt](target)`.

- Tra TLDR e prima sezione → `edition.image` (cover).
- Nel corpo di una storia → `story.image` (la prima; le successive
  vengono scartate dal body comunque, mai renderizzate come testo).
- `**Immagine:**` resta supportata (equivalente, URL assolute).
- Il parser NON risolve i path: salva ciò che è scritto. La
  risoluzione è del loader (che conosce la directory del file).

## Loader

- Itera EDITION_DIRS; l'id resta la data dall'H1; gli errori citano
  `dir/file:riga`.
- Risoluzione immagini: URL http(s) → invariata; path relativo →
  basename in IMAGES_DIR, con `existsSync` obbligatorio (riferimento
  rotto = build rotta) → URL sito `/images/<basename>`.
- Podcast: `podcastFileFor` su PODCAST_DIRS in ordine (prima match).
- Watcher su tutte le dirs.

## Schema (content.config.ts)

`imageRef = { url: sito-assoluta ("/…") o http(s), alt? }` per
storia ed edizione (`image` opzionale su entrambe).

## Asset serving (src/integrations/content-assets.mjs)

Evoluzione di podcast-assets: in dev serve `<base>/podcast/*` dalle
PODCAST_DIRS e `<base>/images/*` da IMAGES_DIR (Content-Type per
estensione, Range per gli mp3); alla build copia tutto in
`dist/podcast/` e `dist/images/`.

## Rendering

- `EditionLayout`: cover in `.edition-cover` (figure full-shell sotto
  l'header, prima della regola). Alt dalla riga markdown.
- `StoryCard`: invariato; `src` = withBase() se URL sito, diretto se
  esterna.

## Automazione (.github/workflows/content-sync.yml)

```
on: schedule(*/30), repository_dispatch(content-update), workflow_dispatch
1. checkout (token: CONTENT_PAT || github.token, submodules: true)
2. git submodule update --remote input/rassegnai-daily
3. nessuna differenza → stop
4. commit "content: sync rassegnai-daily <sha>" su master + push
5. gh workflow run deploy.yml (il push col GITHUB_TOKEN non scatena
   eventi: il deploy si invoca esplicitamente; permissions actions:write)
```

ci.yml e deploy.yml: checkout con `submodules: true`, token come
sopra, poi `git submodule foreach git lfs pull` (i runner hanno
git-lfs). Istantaneità opzionale: in rassegnai-daily un workflow di
1 job che fa `repository_dispatch` verso codewhisperer (richiede PAT
lato rassegnai-daily; il cron resta la rete di sicurezza).

## Migrazione contenuto

`git rm input/2026-07-*.md input/podcast/*.mp3` nello stesso branch
(senza rimozione la build fallirebbe per date duplicate). La lane
manuale resta per il futuro.

## Test

- Unit (fixture): cover dopo TLDR; immagine nel corpo → story.image e
  body pulito; markdown-image + Immagine: coesistono; path relativo
  conservato dal parser.
- Helper corpus: EDITION_DIRS/PODCAST_DIRS dal modulo condiviso; i
  test podcast/immagini di presenza ora girano davvero (il corpus ne
  ha); assenza per-storia resta dinamica.
- E2E: cover visibile sull'edizione col 18; immagine di storia
  visibile e servita 200.
