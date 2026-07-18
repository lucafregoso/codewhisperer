# 013 — Submodule rassegnai-daily · Tasks

- [x] T1 submodule input/rassegnai-daily (URL https) + LFS pull locale
- [x] T2 src/lib/content-dirs.ts condiviso (loader/integrazione/test)
- [x] T3 parser: immagini markdown standalone (cover preambolo + arte
      storia, malformata = errore); loader multi-dir con risoluzione
      /images/<basename> verificata e podcast su PODCAST_DIRS
- [x] T4 content-assets.mjs (serve+copia immagini e podcast multi-dir)
- [x] T5 rendering cover (EditionLayout) + assetSrc (StoryCard)
- [x] T6 migrazione: rimozione md/mp3 locali duplicati (12-17)
- [x] T7 workflows: ci/deploy con submodules+LFS; content-sync
      (cron 30' + repository_dispatch + dispatch del deploy)
- [x] T8 docs: INGESTION (lane canonica + immagini markdown), CLAUDE
- [x] T9 test: helper multi-lane, fixture edge-immagini, cover e2e
- [x] T10 review (reviewer): APPROVATO; note applicate (rimozione ramo
      CONTENT_PAT dopo la scelta repo-pubblico, guardie resolveImage,
      md-image malformata = errore, commento import TS)
- [x] T11 gate verde, merge develop → master, deploy e verifica live
