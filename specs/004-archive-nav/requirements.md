# Spec 004 — Archivio e navigazione per data

## Obiettivo

Si può raggiungere qualsiasi edizione: archivio `/edizioni/` raggruppato
per mese, prev/succ su ogni edizione, nav nel MastHead.

## Criteri di accettazione

- Dato `/edizioni/`, vedo le edizioni raggruppate per mese (nuove in alto)
  con data, occhiello troncato e conteggio storie.
- Data un'edizione, quando clicco "Edizione precedente" arrivo alla data
  precedente; dalla più vecchia il link precedente non esiste; dalla
  homepage (ultima) il link successiva non esiste.
- Dal MastHead raggiungo l'archivio da ogni pagina.
- Camminando sui link "precedente" dall'ultima edizione raggiungo la più
  vecchia (test e2e).
- Tutto leggibile senza JS; axe pulito.

## Fuori scope

Filtri per categoria/fonte (005), ricerca (006).
