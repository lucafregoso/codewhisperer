# 012 — Immagini reali e flusso senza buchi · Design

## Layout (EditionLayout)

Un solo grid `.front` con aree, DOM in ordine editoriale:

```
grid-template-columns: minmax(0, 8fr) minmax(0, 4fr);
"hero  leads"
"index leads"
```

L'indice riempie lo spazio sotto l'hero (il buco della 011); i lead
occupano la colonna destra per l'altezza che serve. Mobile <56rem:
colonna unica hero → leads → index. Hairline: border-left sui lead,
border-top sulle righe d'indice (invariati).

## Parser

`**Immagine:** <url> [— alt]` (regex con cattura) → `story.image`.
Alt opzionale nel parse; il rendering usa il titolo come fallback.
URL validata dallo schema Zod (`z.string().url()`): un URL rotto fa
fallire la build come ogni altro errore di contratto. La riga resta
opzionale e retrocompatibile.

## Rendering (StoryCard)

- hero: `<img class="story-image">` tra titolo e corpo, larghezza
  colonna, `loading="eager"` (sopra il fold), `--radius`.
- lead: immagine sopra il titolo, larghezza colonna, lazy.
- index: thumbnail 5.5rem, `aspect-ratio 4/3`, `object-fit: cover`,
  nello slot avantitolo, lazy.
- Griglie tornano a due colonne (numerale + contenuto); niente slot
  riservati quando l'immagine manca.

## Rimozioni

`src/lib/stamp.ts`, `src/components/StoryStamp.astro`, stili
`.story-stamp`; PRODUCT.md (principio 3) e DESIGN.md aggiornati:
la tipografia porta la pagina, le immagini sono contenuto quando
l'edizione le fornisce — mai decorazione generata.

## Test

- Unit: fixture `edge-categorie.md` (riga Immagine già presente) →
  image parsata {url, alt}; storia senza riga → undefined; la riga
  non finisce nel body (già coperto).
- E2E `images.spec.ts`: corpus-derived — se nessuna storia del
  corpus ha immagini, le pagine edizione non contengono `.story img`
  (assenza); test di presenza in skip finché il corpus non ne ha.
- INGESTION.md: sezione Immagini promossa da "futuro" a contratto
  attivo.
