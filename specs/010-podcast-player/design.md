# 010 — Player podcast per edizione · Design

## Architettura

Tre punti di contatto, nessuna conversione del contenuto
(costituzione §1: input/ resta la fonte di verità, gli mp3 inclusi).

### 1. Rilevamento — loader (`src/lib/editions-loader.ts`)

Il loader già conosce il filename dell'entry (`file`). Per ogni
edizione controlla `input/podcast/<basename>.mp3`; se esiste aggiunge
`podcast: { file: "<basename>.mp3" }` ai dati. Matching estratto in
`src/lib/podcast.ts` (`podcastFileFor(mdFile, podcastDirFiles)`) puro
e unit-testabile. Il watcher dev osserva anche `input/podcast/`.

Schema (`src/content.config.ts`):

```ts
podcast: z.object({ file: z.string().min(1) }).optional(),
```

### 2. Serving — integrazione Astro (`src/integrations/podcast-assets.mjs`)

Gli mp3 vivono fuori da `public/`, serve un ponte:

- `astro:server:setup` — middleware dev che serve
  `<base>/podcast/*.mp3` da `input/podcast/` (Content-Type
  `audio/mpeg`, supporto Range per il seek).
- `astro:build:done` — copia `input/podcast/*.mp3` in
  `dist/podcast/`. Vale per `build` e `build:test`: la preview di
  Playwright esercita lo stesso percorso del deploy.

L'URL pubblico è `withBase('/podcast/<file>')` — su Pages diventa
`/codewhisperer/podcast/<file>`, in test `/podcast/<file>`.

### 3. UI — `src/components/PodcastPlayer.astro`

Inserito in `EditionLayout` dentro `.edition-header`, dopo il TLDR
("in testa alla pagina"). `<audio controls preload="metadata">` nativo
(funziona senza JS); fallback interno: link di download. Stile Wired
con soli token: hairline sopra, kicker mono "Ascolta l'edizione".
Stringhe in `src/i18n/index.ts` (`edition.podcastListen`,
`edition.podcastFallback`, `edition.podcastDownload`).

## Test

- **Unit** (`tests/unit/podcast.test.ts`): matching per basename,
  estensioni non-mp3 ignorate, nessun match → undefined.
- **Unit — refactor** (`tests/unit/parse-edition.test.ts`): i test che
  citavano i filename storici ("Rassegnai Daily Jul 16 2026.md",
  "Rassegna 14 Lug 2026.md") diventano filename-agnostici: si cerca
  l'edizione per data parsata, mai per nome file. (Luca ha rinominato
  il corpus in `YYYY-MM-DD.md`; il nome resta libero da contratto.)
  Il test "data dall'H1, non dal filename" è già coperto dalle fixture
  (`edge-categorie.md` → 2026-07-01).
- **E2E** (`tests/podcast.spec.ts`): deriva le coppie md/mp3 da
  `tests/helpers/corpus.ts` (esteso). Se l'ultima edizione ha il
  podcast: player in homepage con `src` corretto e GET 200
  `audio/mpeg`. Edizioni senza mp3: nessun `<audio>`. Skip esplicito
  se il corpus non ha alcun podcast (CI prima del commit contenuto).

## Contratto (docs/INGESTION.md)

Nuova sezione: podcast opzionale, `input/podcast/<basename>.mp3`,
stesso commit della rassegna, solo mp3.

## Rollout

1. `feature/010-podcast-player` → develop → master (codice; il corpus
   in git ha ancora i vecchi nomi: i test agnostici passano, l'e2e
   podcast va in skip).
2. Commit contenuto su master: rename `YYYY-MM-DD.md` + `input/podcast/`
   (`content: rassegne rinominate YYYY-MM-DD + podcast`). Il deploy
   di questo commit esercita il player end-to-end.
