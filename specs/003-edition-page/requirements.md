# Spec 003 — Pagina edizione + homepage

## Obiettivo

Il magazine diventa reale: `/` mostra l'ultima edizione impaginata stile
Wired, `/edizioni/[date]/` è il permalink identico di ogni edizione.

## User story

- Come lettore, aprendo `/` vedo l'edizione più recente: hero (storia 1),
  lead (2–3), griglia (4+), Radar, Dal feed lento, Nota di copertura.
- Come lettore, ogni storia ha un anchor stabile che posso condividere.
- Come lettore senza JS, leggo tutto; col tema scuro, tutto regge.

## Criteri di accettazione

- Dato il corpus, quando apro `/`, allora vedo la data del 16 luglio 2026
  e il titolo hero "Hyundai rende Boston Dynamics…".
- Dato `/edizioni/2026-07-14/`, quando la apro, allora vedo l'edizione del
  14 con le sue storie — layout identico alla homepage.
- Data una storia, quando seguo `#slug`, allora atterro sulla storia.
- Date le fonti "Techmeme (Reuters)", quando guardo il badge, allora leggo
  "Reuters · via Techmeme" con link alla URL originale.
- Senza JavaScript tutte le sezioni sono visibili; axe pulito nei due temi.

## Fuori scope

Navigazione archivio (004), filtri (005), polish finale (007).
