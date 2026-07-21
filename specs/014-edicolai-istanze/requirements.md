# 014 — Istanze EdicolAI · Requirements

## Obiettivo

Nasce **EdicolAI** (repo esterno, control plane): gestisce N profili
Hermes "RassegnAI", ognuno dei quali pusha edizioni su un proprio repo
GitHub `<slug>-daily`. CodeWhisperer deve impaginare N **istanze**
(un magazine per profilo) sullo stesso sito GitHub Pages, restando un
solo repo Astro. Contratto slug end-to-end:

```
profilo Hermes <slug> → repo <slug>-daily → submodule input/<slug>-daily
                      → magazine su /codewhisperer/<slug>/
```

Eccezione dichiarata: l'istanza storica `rassegnai` resta alla root
`/codewhisperer/` — nessun link, RSS o URL indicizzato si rompe.

## User story

- Come Luca, aggiungo un profilo in EdicolAI e per pubblicarne il
  magazine mi bastano: submodule `input/<slug>-daily` + una entry nel
  registry istanze. Niente fork, niente secondo repo Astro.
- Come lettore, ogni magazine ha identità propria (testata, tagline,
  descrizione, theme color) ma stessa esperienza: homepage = ultima
  edizione, archivio, filtri, cerca, RSS.
- Come Hermes/EdicolAI, il contratto di ingestione è identico per ogni
  profilo: cambia solo il repo di destinazione.

## Criteri di accettazione

Testabili con Vitest (unit), Playwright (e2e sull'istanza di default)
o step di verifica nella build CI (multi-istanza).

1. **Registry istanze**
   - Dato il registry versionato nel repo, Quando lo leggo, Allora per
     ogni istanza trovo: `slug`, directory submodule, base path,
     branding (name/tagline/description/themeColor). (unit)
   - Dato `INSTANCE=<slug>` in env, Quando parte una build, Allora
     `src/data/site.ts` e `src/lib/content-dirs.ts` espongono i valori
     di quell'istanza; senza `INSTANCE` l'istanza attiva è `rassegnai`.
     (unit)
   - Dato uno slug non presente nel registry, Quando la build parte,
     Allora fallisce subito con un errore che elenca gli slug validi.
     (unit)

2. **Regression guard — istanza singola**
   - Dato il registry con la sola istanza `rassegnai` e nessuna env
     `INSTANCE`, Quando eseguo `pnpm gate`, Allora resta verde e
     l'output è identico all'attuale: stesse `EDITION_DIRS`/
     `PODCAST_DIRS`/`IMAGES_DIR`, stesso `site`, stessi alias, stesso
     base path. (unit sulle derivazioni + e2e esistenti invariati)

3. **Contenuto per istanza**
   - Dato un'istanza non-default, Quando la sua build legge il corpus,
     Allora legge SOLO `input/<slug>-daily/editions/` (la lane manuale
     `input/*.md` appartiene alla sola istanza default). (unit)
   - Dato un submodule non inizializzato o senza edizioni, Quando
     l'istanza builda, Allora la build NON fallisce e la homepage rende
     uno stato vuoto "in edicola presto" (stringa da i18n, marker
     verificabile nel markup). (unit sul loader già esistente + check
     CI sul marker)
   - Dato un corpus con almeno un'edizione, Quando l'istanza builda,
     Allora homepage = edizione con data massima dall'H1 (costituzione
     §3), come oggi. (e2e esistente)

4. **Alias per istanza**
   - Dato che gli alias fonte sono curati sul corpus specifico, Quando
     un'istanza è attiva, Allora usa il proprio set; `rassegnai` usa
     gli alias attuali, un'istanza nuova parte con set vuoto (solo
     tassonomia emergente, costituzione §2). (unit)

5. **Deploy multi-istanza (verifica in CI, non in Playwright)**
   - Dato il registry con N istanze, Quando gira `deploy.yml`, Allora
     esegue N build (`INSTANCE` + `BASE_PATH` per istanza) e fonde le
     `dist/` in un unico artifact Pages: root = `rassegnai`,
     sottocartella `<slug>/` per ciascuna delle altre.
   - Dato l'incidente 2026-07-17 (artifact di test in produzione),
     Quando gira il deploy, Allora l'ordine resta e2e-PRIMA-delle
     build di produzione e il commento nel workflow sopravvive.
   - Dato l'artifact fuso, Quando lo verifico, Allora per OGNI istanza
     l'`index.html` referenzia asset sotto il proprio base path, non
     contiene `127.0.0.1:4399` e — se il corpus dell'istanza ha
     edizioni — non contiene il marker di stato vuoto.
   - Dato ogni build autonoma (site+base propri), Quando apro
     `/codewhisperer/<slug>/rss.xml` e la pagina cerca (Pagefind),
     Allora funzionano per istanza senza collisioni con la root.

6. **Sync contenuti**
   - Dato un push su un qualsiasi repo `<slug>-daily`, Quando gira
     `content-sync.yml` (cron 30' / `repository_dispatch`
     `content-update` / manuale), Allora aggiorna TUTTI i submodule
     `input/*-daily`, committa su master solo se qualcosa è cambiato e
     invoca il deploy — meccanica identica a oggi, estesa a N repi.

7. **Contratto documentato**
   - Dato `docs/INGESTION.md` v2, Quando EdicolAI crea un profilo,
     Allora vi trova il contratto slug→repo→submodule→URL e la ricetta
     `repository_dispatch` da replicare per ogni repo `<slug>-daily`.

8. **Costituzione**: withBase() su ogni URL interna (§6 — già garantito
   dalle build per-istanza con base proprio), niente literal fuori da
   tokens.css (§5), stringhe nuove solo in i18n (§8).

## Fuori scope

- EdicolAI stesso (repo esterno): qui solo il lato impaginazione.
- Una index "edicola" che elenca i magazine (spec futura, se servirà).
- Migrare la lane manuale `input/*.md` o `publish-edition.sh` al
  multi-istanza: restano com'è, per la sola istanza default.
- Test Playwright multi-istanza: la verifica delle istanze non-default
  vive negli step CI del deploy (decisione presa col maintainer).
- Temi/design divergenti per istanza: il branding è solo identità
  (name/tagline/description/themeColor), il layout è unico.

## Gate HITL

Luca approva prima dell'implementazione:

1. Forma e campi del registry istanze (incluso `basePath` esplicito
   per l'eccezione root di `rassegnai`).
2. Lane manuale `input/*.md` riservata all'istanza default.
3. Homepage "in edicola presto" per corpus vuoto al posto dell'attuale
   `throw` (con la guardia CI che impedisce il deploy vuoto quando il
   corpus esiste).
4. Loop sequenziale nel job di deploy (non matrix) per le N build.
