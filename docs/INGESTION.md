# Contratto di ingestione — CodeWhisperer ← Hermes

Questo documento è il contratto tra Hermes (l'agente che scrive le
rassegne) e CodeWhisperer (l'impaginatore Astro). È l'unico documento da
dare in pasto a Hermes — a ogni suo profilo: il formato è identico per
tutte le istanze (v. "Profili e istanze").

## Dove

Un file markdown per edizione nella cartella **`input/`** del repo.
Il nome del file è libero (la data si legge dall'H1, non dal filename).
Una sola edizione per data: due file con la stessa data nell'H1 fanno
fallire la build.

## Formato richiesto (già rispettato dalle rassegne esistenti)

```markdown
# RubricAI — Edizione del 16 luglio 2026

> Occhiello dell'edizione in un paragrafo.

## 🗞 In primo piano

### 1. Titolo della storia
Corpo in un paragrafo, markdown inline (grassetti, link).
**Fonti:** [Nome](https://url) — annotazione; [Techmeme (Reuters)](https://url) — annotazione.

## 📡 Radar
- One-liner con il punto — [Fonte](https://url)

## 🐌 Dal feed lento
**"Titolo del pezzo"** di Autore. Paragrafo di motivazione. — [Fonte](https://url)

## ✅ Nota di copertura
Fonti lette: 60/65. Irraggiungibili: A, B, C.
Item raccolti: 299; storie pubblicate: 21; scartati di proposito: 278.
Se non è qui, puoi ignorarlo.
```

Regole:

- **H1**: `# <Testata> — Edizione del <data italiana>` (es. "16 luglio
  2026", va bene anche "1º"). Obbligatorio.
- **In primo piano**: obbligatoria, storie numerate `### N. Titolo`,
  ognuna con riga `**Fonti:**`; le voci sono separate da `;`, ogni voce è
  `[Nome](url)` con annotazione opzionale dopo `—`.
- **Pattern via**: `Techmeme (Reuters)` e `Reuters (Techmeme)` sono
  equivalenti — l'aggregatore viene riconosciuto e mostrato come "via".
- **Radar / Dal feed lento / Nota di copertura**: opzionali. Le emoji
  negli H2 possono variare, contano le parole chiave.
- L'autore del feed lento è opzionale ("di Autore." oppure formule come
  "dalla mailing list…").

## Novità richiesta a Hermes: le categorie (opzionali ma desiderate)

Il sito genera filtri per categoria in modo **emergente**: nessun elenco
fisso, Hermes assegna liberamente le etichette che ritiene giuste e il
sito le normalizza in slug (minuscole, senza accenti, trattini).
Consigliato: riusare etichette già usate nelle edizioni precedenti quando
il tema è lo stesso.

1. **Storie** — una riga dopo `**Fonti:**`:

   ```markdown
   **Categorie:** intelligenza artificiale, open-source
   ```

2. **Radar** — suffisso in coda al bullet:

   ```markdown
   - One-liner con il punto — [Fonte](https://url) [cat: sicurezza]
   ```

3. **Dal feed lento** — riga `**Categorie:**` in coda alla sezione.

Le edizioni senza categorie restano valide: gli item finiscono in
"senza categoria" e restano filtrabili per fonte e data.

## Podcast (opzionale)

Se l'edizione ha una versione audio, va droppata come
`input/podcast/<basename>.mp3` — **stesso basename** del markdown:

```
input/2026-07-16.md
input/podcast/2026-07-16.mp3
```

Regole:

- Solo `.mp3`. Altre estensioni vengono ignorate.
- Il matching è per basename esatto; il nome del file resta libero
  (come per il markdown, la data dell'edizione viene dall'H1).
- Il podcast è opzionale: un'edizione senza mp3 è valida e non mostra
  il player.
- Droppare mp3 e markdown **nello stesso commit** (lo script di
  pubblicazione lo fa da solo se l'mp3 è accanto al file .md).

Sul sito il player audio compare in testa alla pagina dell'edizione.

## Immagini (opzionale)

Due sintassi equivalenti, entrambe su riga propria:

```markdown
![Descrizione alt](images/2026-07-18-story6.jpg)
**Immagine:** https://esempio.com/foto.jpg — descrizione alt
```

- La sintassi markdown standard è quella della lane rassegnai-daily:
  path relativa alla cartella `editions/`, file in `editions/images/`
  (un riferimento a un file inesistente fa fallire la build).
- La riga `**Immagine:**` accetta URL assolute http(s).
- **Cover dell'edizione**: un'immagine markdown nel preambolo (tra il
  TLDR e la prima sezione, es. `![Hero](images/DATA-hero.jpg)`) è la
  copertina, resa in testa alla pagina.
- **Arte della storia**: la prima immagine nel corpo di una storia;
  la riga non compare mai nel testo. Una per storia; radar e feed
  lento non hanno immagini.
- L'alt è raccomandato; se manca, il sito usa il titolo della storia.
- Senza immagini la storia esce solo tipografica: il layout non
  riserva spazi vuoti.

Sul sito: cover in testa all'edizione; hero = immagine sotto il
titolo; lead = sopra il titolo; indice = thumbnail 4:3. Lazy sotto il
fold.

## Profili e istanze (EdicolAI)

**EdicolAI** (control plane esterno) gestisce N profili Hermes; ogni
profilo alimenta un proprio magazine su questo stesso sito. Il
contratto è uno slug end-to-end:

```
profilo Hermes <slug> → repo <slug>-daily → submodule input/<slug>-daily
                      → magazine su /codewhisperer/<slug>/
```

Eccezione dichiarata: l'istanza storica `rassegnai` resta alla root
`/codewhisperer/` — nessun link, RSS o URL indicizzato si rompe.

Il formato markdown di questo contratto è **identico per ogni
profilo**: cambia solo il repo di destinazione. Un profilo nuovo non
impara niente di nuovo — pusha le edizioni nel proprio `<slug>-daily`
con lo stesso layout `editions/` della lane rassegnai-daily (sotto).

### Notifica istantanea (per ogni repo `<slug>-daily`)

Il workflow `content-sync` di questo repo controlla TUTTI i submodule
`input/*-daily` ogni 30 minuti (e a comando): se ci sono commit nuovi
aggiorna i pointer, committa su master e fa partire il deploy. Per
l'aggiornamento **istantaneo**, ogni `<slug>-daily` replica lo stesso
workflow di notifica (cambia solo il repo che lo ospita):

```yaml
# .github/workflows/notify.yml (in <slug>-daily)
on: { push: { branches: [main] } }
jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -sf -X POST \
            -H "Authorization: Bearer ${{ secrets.CODEWHISPERER_PAT }}" \
            -H "Accept: application/vnd.github+json" \
            https://api.github.com/repos/lucafregoso/codewhisperer/dispatches \
            -d '{"event_type":"content-update"}'
```

(`CODEWHISPERER_PAT`: fine-grained PAT con contents:read+write su
codewhisperer. Senza notifica resta il cron.)

### Onboarding di una nuova istanza (runbook)

1. EdicolAI crea il profilo `<slug>` e il repo `<slug>-daily`
   (pubblico, Git LFS per jpg/mp3, workflow di notifica qui sopra);
2. in codewhisperer:
   `git submodule add https://github.com/…/<slug>-daily input/<slug>-daily`
   + entry nel registry `src/data/instances.json` (branding incluso)
   + eventuale `src/data/aliases/<slug>.ts` (opzionale, si parte con
   il set vuoto: la tassonomia è emergente);
3. merge → il deploy pubblica `/codewhisperer/<slug>/` ("in edicola
   presto" finché non arriva il primo drop).

Vincolo sullo slug: non può collidere con le route dell'istanza root
(`edizioni`, `categoria`, `fonte`, `cerca`, `pagefind`, `images`,
`_astro`, `rss.xml`) — la sottocartella `_site/<slug>/` convive nello
stesso artifact della root.

## La lane rassegnai-daily (sorgente canonica)

È il caso `<slug>=rassegnai` del contratto qui sopra (con l'eccezione
root): le edizioni prodotte nell'ambiente esterno vengono pushate su
`github.com/lucafregoso/rassegnai-daily` (privato, Git LFS per
jpg/mp3), montato qui come **submodule** in `input/rassegnai-daily`:

```
editions/YYYY-MM-DD.md        # la rassegna (formato di questo file)
editions/images/*.jpg         # cover e immagini storia (LFS)
editions/podcast/YYYY-MM-DD.mp3  # audio (LFS, basename = edizione)
```

Sync e notifica istantanea: vedi "Profili e istanze" — rassegnai-daily
usa lo stesso workflow di notifica di ogni altro `<slug>-daily`.

**Attenzione alle date**: una data presente in entrambe le lane
(`input/*.md` e `editions/*.md`) fa fallire la build — la lane
manuale serve solo per drop d'emergenza di date non coperte e
appartiene alla SOLA istanza default (`rassegnai`): ogni altra
istanza legge esclusivamente il proprio `input/<slug>-daily/editions/`.

## Come pubblicare a mano (lane di emergenza)

Un solo comando dalla radice del repo:

```bash
scripts/publish-edition.sh /percorso/rassegna.md            # pubblica
scripts/publish-edition.sh /percorso/rassegna.md --dry-run  # solo validazione
```

Lo script: valida col parser reale (errore con file:riga se il formato
non torna), copia in `input/`, committa su `master`
(`content: edizione YYYY-MM-DD`), pusha (se esiste il remote) e
riallinea `develop`. Con working tree sporco si rifiuta di partire.

Per il push dal VPS serve una **deploy key** con permesso di scrittura
sul repo GitHub (setup una tantum, vedi README).

## Cosa succede dopo il drop

1. Il push su `master` fa partire il deploy GitHub Pages.
2. La build riparsa e rivalida tutto: se qualcosa è malformato la build
   fallisce e il sito resta all'edizione precedente. Il sito non
   regredisce mai.
3. A build verde l'edizione con la data più recente diventa
   automaticamente la homepage.
