# Spec 005 — Filtri per categoria e fonte

## Obiettivo

Tutto il corpus (storie, radar, feed lento) filtrabile per fonte e per
categoria con pagine statiche SEO-friendly, generate solo per i termini
realmente presenti (tassonomia emergente).

## Criteri di accettazione

- Dato `/fonte/`, vedo l'elenco delle fonti emergenti con conteggio,
  ordinate per frequenza.
- Dato `/fonte/reuters/`, vedo gli item con source=reuters O via=reuters,
  dal più recente, ognuno con link alla sua edizione (anchor se storia).
- Dato un termine con più di 30 item, la lista è paginata staticamente
  (prev/succ, no JS).
- Dato `/categoria/` con corpus senza categorie, vedo uno stato vuoto
  onesto che spiega che le categorie arrivano con le prossime edizioni.
- Data un'edizione futura con `**Categorie:**`, le pagine
  `/categoria/[slug]/` si generano senza toccare codice.
- MastHead linka Categorie e Fonti; axe e no-JS puliti.

## Fuori scope

Ricerca full-text (006).
