# 010 — Player podcast per edizione · Requirements

## Contesto

Hermes ora produce, oltre alla rassegna markdown, una versione audio
(podcast) dell'edizione. I file arrivano in `input/podcast/` con lo
stesso basename del markdown: `input/2026-07-16.md` ↔
`input/podcast/2026-07-16.mp3`. Il podcast è opzionale: un'edizione
senza mp3 resta valida.

## User stories

1. Come lettore, quando apro un'edizione che ha il podcast voglio un
   player audio in testa alla pagina per ascoltarla invece di leggerla.
2. Come lettore senza JavaScript, voglio comunque poter ascoltare o
   scaricare l'audio (il player nativo non dipende da JS).
3. Come Hermes, voglio pubblicare il podcast semplicemente droppando
   `input/podcast/<basename>.mp3` nello stesso commit della rassegna,
   senza altri passaggi.

## Criteri di accettazione

- **Dato** `input/X.md` e `input/podcast/X.mp3`, **quando** la pagina
  dell'edizione (homepage o permalink) viene renderizzata, **allora**
  in testa alla pagina compare un player `<audio controls>` che
  riproduce l'mp3.
- **Dato** `input/X.md` senza `input/podcast/X.mp3`, **allora** la
  pagina non mostra alcun player né spazio vuoto.
- L'URL dell'audio rispetta il BASE_PATH (`withBase`) e risponde 200
  con `Content-Type` audio sia in dev sia in build/preview sia live.
- Il player funziona senza JavaScript (audio nativo, costituzione §2).
- Il matching è per basename esatto, solo estensione `.mp3`
  (contratto in docs/INGESTION.md).
- I test non congelano il corpus: nessun filename o conteggio fisso
  (lezione del 17/07); i test e2e derivano le coppie md/mp3 da input/.
- `pnpm gate` verde; axe invariato su pagine con player.

## Fuori scope

- Enclosure RSS del podcast (futura spec).
- Trascrizione, capitoli, velocità di riproduzione custom.
- Formati diversi da mp3.
