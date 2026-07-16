# Spec 005 — Design

- `src/components/CorpusItemCard.astro { item }` — riga di lista
  trasversale: kicker tipo (In primo piano / Radar / Dal feed lento) +
  data edizione linkata (anchor per storie), titolo/testo, SourceBadge.
- `src/components/TermIndex.astro { terms, base, title, emptyNote? }` —
  indice condiviso per /categoria/ e /fonte/: elenco kicker con conteggi.
- `src/components/Pagination.astro { page }` — prev/succ statici da
  `paginate()` (page.url.prev/next), aria-label con pagina corrente.
- Route (pageSize 30):
  - `src/pages/fonte/index.astro` + `src/pages/fonte/[slug]/[...page].astro`
  - `src/pages/categoria/index.astro` + `src/pages/categoria/[slug]/[...page].astro`
  Le getStaticPaths usano getEmergentSources()/getEmergentCategories() +
  fromSource()/inCategory() su getCorpus(). Nessuna pagina per termini
  assenti; l'indice categorie mostra lo stato vuoto con filters.noCategories.
- MastHead: link Categorie e Fonti accanto a Edizioni.
- i18n: kind labels, conteggi, stato vuoto, pageStatus.
- Test `tests/filters.spec.ts`: /fonte/ ordinato per frequenza,
  /fonte/reuters/ contiene item via-techmeme, /fonte/techcrunch/ ha item,
  /categoria/ stato vuoto (corpus attuale), pagination presente quando
  serve (fonte più frequente se >30).
