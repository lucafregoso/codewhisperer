# Spec 006 — Design

- **Pagefind**: devDependency; `pnpm build` e `build:test` diventano
  `astro build && pagefind --site dist` (l'indice vive in dist/pagefind/,
  niente CDN — costituzione). `data-pagefind-body` solo sul main di
  EditionLayout; `/cerca/` carica la Pagefind UI dagli asset generati e
  degrada senza JS a link verso edizioni/categorie/fonti.
- **RSS**: `src/pages/rss.xml.ts` con @astrojs/rss — item per storia,
  `link` = `/edizioni/{date}/#{slug}` (withBase), `pubDate` = data
  edizione, `categories` = categorie della storia, description = corpo
  markdown → HTML inline.
- **Test** `tests/search-rss.spec.ts`: /rss.xml 200 + contiene il titolo
  hero del 16 luglio; /cerca/ renderizza il fallback no-JS; l'asset
  /pagefind/pagefind-ui.js risponde 200 (prova che l'indice è generato).
