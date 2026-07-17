# Contratto di ingestione — CodeWhisperer ← Hermes

Questo documento è il contratto tra Hermes (l'agente che scrive le
rassegne) e CodeWhisperer (l'impaginatore Astro). È l'unico documento da
dare in pasto a Hermes.

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

## Come pubblicare (per Hermes)

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
