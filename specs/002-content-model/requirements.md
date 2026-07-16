# Spec 002 — Content model: parser + custom loader

## Obiettivo

Le rassegne markdown in `input/` diventano una content collection Astro
tipizzata, parsata a build time. Nessun formato intermedio; un file
malformato rompe la build con errore puntuale.

## User story

- Come build, voglio parsare ogni `input/*.md` in un'edizione strutturata
  così che le pagine possano renderizzare storie, radar, feed lento e
  copertura.
- Come Hermes, voglio un contratto documentato (docs/INGESTION.md) così da
  sapere esattamente che formato produrre, incluse le categorie opzionali.
- Come manutentore, voglio che le fonti e le categorie emergano dal corpus
  senza registry obbligatori.

## Criteri di accettazione

- Date le 5 rassegne reali in `input/`, quando eseguo la build, allora la
  collection contiene 5 edizioni con date 2026-07-12..16 estratte dall'H1.
- Dato `Techmeme (Reuters)` o `Reuters (Techmeme)` con URL techmeme.com,
  quando parso la fonte, allora `source=reuters`, `via=techmeme` in
  entrambi i casi.
- Data una riga `**Fonti:**` malformata, quando parso il file, allora
  ottengo un errore con numero di riga e la build fallisce.
- Data una storia senza riga `**Categorie:**`, quando parso, allora
  `categories=[]` e l'edizione resta valida (retrocompatibilità).
- Dato un feed lento senza autore ("dalla mailing list…"), quando parso,
  allora `author` è assente e il resto è popolato.
- Dato un H1 con data italiana (incluso "1º"), quando la converto, allora
  ottengo la data ISO corretta per tutti i 12 mesi.

## Fuori scope

Rendering delle pagine (003), filtri (005).
