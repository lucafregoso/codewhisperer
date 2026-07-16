# Spec 006 — Ricerca, RSS, SEO

## Obiettivo

Superficie di distribuzione: ricerca full-text statica (Pagefind),
feed RSS delle storie, sitemap già attiva, JSON-LD già emesso (003).

## Criteri di accettazione

- Dato `/cerca/`, con JS trovo storie per testo libero in italiano
  (indice Pagefind generato post-build); senza JS vedo i percorsi
  alternativi (edizioni, categorie, fonti) — mai una pagina morta.
- Dato `/rss.xml`, ottengo un feed valido con un item per storia in primo
  piano (tutte le edizioni), link all'anchor, data dell'edizione,
  categorie come <category>.
- La sitemap include le pagine di filtro e le edizioni.
- L'indicizzazione Pagefind copre solo il contenuto delle edizioni
  (data-pagefind-body), non le liste derivate (niente duplicati).

## Fuori scope

Design polish (007), automazione contenuto (008).
