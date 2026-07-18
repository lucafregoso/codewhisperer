# 012 — Immagini reali e flusso senza buchi · Requirements

## Contesto

Feedback di Luca sulla 011: (1) il grid 8+4 con indice separato crea
buchi enormi — l'hero corto lascia un cratere sotto, mentre i lead
lunghi allungano la colonna destra; (2) gli stamp generativi astratti
"non hanno senso": le immagini si mostrano SOLO se presenti nel .md
dell'edizione (contratto **Immagine:** già riservato dalla 011).

## Criteri di accettazione

- **Niente buchi**: l'indice (storie 4+) risale sotto l'hero nella
  colonna sinistra mentre i lead corrono a fianco; l'ordine di
  lettura DOM resta 1, 2-3, 4+ (aree grid, non riordino DOM).
- **Stamp rimossi**: `src/lib/stamp.ts` e `StoryStamp.astro`
  eliminati; nessun glifo decorativo residuo.
- **Immagini dal contratto**: la riga `**Immagine:** URL — alt` di
  una storia diventa `story.image { url, alt? }`; resa in pagina
  (hero: arte del pezzo sotto il titolo; lead: sopra il titolo;
  indice: thumbnail di riga). Nessuna riga → nessuna immagine,
  nessuno spazio riservato.
- Alt mancante → fallback al titolo della storia; `loading="lazy"`
  sotto il fold, hero eager.
- Corpus attuale senza immagini → il sito non mostra alcun <img>
  nelle storie (test di assenza); i test di presenza derivano dalle
  fixture e fanno skip sul corpus finché Hermes non emette immagini.
- Hook test invariati; `pnpm gate` verde; axe entrambi i temi.

## Fuori scope

- Immagini per radar/feed lento (solo storie, come da contratto).
- Ottimizzazione/proxy delle immagini remote (arriveranno da Hermes
  già dimensionate; eventuale spec futura).
