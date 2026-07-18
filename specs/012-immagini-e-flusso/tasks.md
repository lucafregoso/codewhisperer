# 012 — Immagini reali e flusso senza buchi · Tasks

- [x] T1 (astro-engineer) parser: cattura **Immagine:** {url, alt?};
      riga malformata → EditionParseError (mai nel body); tipi + Zod
- [x] T2 (ui-designer) EditionLayout: grid ad aree hero/leads/index,
      indice sotto l'hero, mobile a colonna — niente buchi
- [x] T3 (astro-engineer) StoryCard: stamp rimossi; immagini solo se
      presenti (hero/lead/index, alt fallback titolo, lazy/eager;
      :has() con reset mobile)
- [x] T4 rimozione src/lib/stamp.ts + StoryStamp.astro; PRODUCT.md,
      DESIGN.md, INGESTION.md aggiornati (contratto Immagini attivo)
- [x] T5 (test-engineer) unit: image parsata/undefined/malformata;
      helper corpusImages(); e2e images.spec.ts (assenza ora,
      presenza in skip finché Hermes non emette immagini)
- [x] T6 review (reviewer): B1 parser guard, B2 residui DESIGN.md,
      N1 colonna fantasma mobile, N2 selettore [id=]
- [x] T7 gate verde, merge develop → master, verifica live
