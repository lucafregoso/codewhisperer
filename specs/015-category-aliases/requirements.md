# 015 — Alias Categorie · Requirements

## Obiettivo

Le categorie sono già completamente implementate (parsing, schema,
routing `/categoria/`, RSS) ma restano puro `slugify()` del termine
scritto da Hermes: due sinonimi ("IA" / "Intelligenza Artificiale")
oggi produrrebbero due categorie distinte. Le fonti hanno già un
layer di normalizzazione curato per istanza
(`src/data/aliases/<slug>.ts` → `SOURCE_ALIASES`, selezionato da
`src/data/source-aliases.ts`); le categorie non hanno l'equivalente.
Questa spec introduce lo stesso layer per le categorie: una mappa
curata `termine grezzo → slug canonico`, applicata al parse time,
niente enum né tassonomia predefinita (costituzione §2).

## User story

- Come Luca (curatore), quando osservo nel corpus due grafie dello
  stesso concetto ("ai" e "intelligenza artificiale"), aggiungo una
  riga alla mappa curata dell'istanza e le due si fondono in una sola
  voce di `/categoria/`, senza toccare il parser né i markdown già
  pubblicati.
- Come lettore, `/categoria/intelligenza-artificiale/` mostra tutti
  gli item pertinenti anche se le edizioni di Hermes hanno scritto il
  termine in modi leggermente diversi.
- Come Hermes, il contratto markdown (`**Categorie:** term, term` /
  `[cat: term]`) resta identico: la normalizzazione è un dettaglio
  interno di CodeWhisperer, non qualcosa che Hermes deve conoscere o
  rispettare in scrittura.

## Criteri di accettazione

Testabili con Vitest (unit — nessuna superficie e2e nuova, il layer è
trasparente ai consumer `/categoria/` già coperti da `filters.spec.ts`).

1. **Selettore per istanza**
   - Dato un'istanza con file curato in `src/data/aliases/<slug>.ts`
     contenente `CATEGORY_ALIASES`, Quando importo
     `src/data/category-aliases.ts`, Allora riespone quella mappa.
   - Dato un'istanza senza file curato, Quando importo il selettore,
     Allora `CATEGORY_ALIASES` è `{}` (da `src/data/aliases/default.ts`).
   - Dato l'istanza storica `rassegnai`, Quando importo il selettore
     senza `INSTANCE` in env, Allora `CATEGORY_ALIASES` è `{}` oggi (il
     corpus reale non ha ancora doppioni osservati — si parte vuoti,
     non con una tassonomia inventata).

2. **Normalizzazione al parse time**
   - Dato un termine grezzo presente come chiave in `CATEGORY_ALIASES`
     (case-insensitive, trim), Quando una riga `**Categorie:**` o un
     suffisso `[cat: …]` lo contiene, Allora lo slug risultante è il
     valore canonico della mappa, non lo `slugify()` grezzo.
   - Dato un termine assente dalla mappa, Quando viene parsato, Allora
     lo slug è `slugify(termine)` come oggi (regression guard:
     comportamento invariato per ogni istanza senza curatela).
   - Dato due termini nella stessa riga che alias-mappano allo stesso
     slug canonico, Quando la riga viene parsata, Allora l'array
     `categories` risultante contiene quello slug una sola volta,
     nell'ordine di prima occorrenza (dedup).
   - Dato una riga `**Categorie:**` assente (storia, radar o feed
     lento), Quando l'item viene parsato, Allora `categories` è `[]`
     — invariante esistente, non toccata da questa spec.

3. **Effetto sui consumer esistenti (nessuna modifica al loro codice)**
   - Dato un corpus con due story che usano sinonimi alias-mappati
     allo stesso slug, Quando `getEmergentCategories()` gira, Allora
     conta un'unica voce con `count` cumulato (non due voci separate).
   - Dato uno slug canonico prodotto da un alias curato, Quando la
     collection `editions` valida contro lo schema Zod
     (`categories: z.array(slug)`, regex `/^[a-z0-9-]+$/`), Allora un
     alias malformato rompe la build con l'errore Zod standard — nessun
     validatore aggiuntivo nel parser (fail fast, costituzione §1).

4. **Costituzione**
   - `CATEGORY_ALIASES` resta un dizionario di sole normalizzazioni
     osservate (sinonimi, doppie grafie): un termine assente dalla
     mappa non viene mai scartato né rifiutato, produce comunque uno
     slug valido via `slugify()` — nessun enum chiuso, nessuna
     tassonomia predefinita (§2).

## Fuori scope

- Curatela reale delle categorie dell'istanza `rassegnai`: la mappa
  parte vuota, si popola solo quando emergono doppioni reali nel
  corpus (come già avvenuto per `SOURCE_ALIASES`).
- Uno storage di "etichetta preferita" per categoria (analogo a
  `{name, slug}` delle fonti): il label resta derivato dallo slug via
  title-case in `getEmergentCategories()`, invariato.
- Qualsiasi modifica a `/categoria/*.astro`, `CategoryKicker.astro`,
  `rss.xml.ts`: consumano già `categories: string[]` e non cambiano.
- `docs/INGESTION.md`: il contratto markdown per Hermes non cambia (è
  normalizzazione interna a valle del parsing, non un nuovo formato
  di riga o una nuova regola di scrittura).
- Un elenco fisso o predefinito di categorie: esplicitamente escluso
  dalla costituzione (§2) e da questa spec.

## Gate HITL

Luca approva prima dell'implementazione:

1. Shape del modulo: nuovo export `CATEGORY_ALIASES` dentro i file
   esistenti `src/data/aliases/<slug>.ts` (stessa cartella delle
   fonti) + nuovo selettore dedicato `src/data/category-aliases.ts`
   (non un merge dentro `source-aliases.ts`).
2. `CATEGORY_ALIASES` di `rassegnai` parte **vuota**: nessuna
   migrazione o invenzione di dati, solo il layer pronto.
3. Dedup dei termini alias-mappati all'interno della stessa riga
   categorie (comportamento nuovo, prima impossibile con puro
   `slugify()` salvo refusi).
4. Nessuna modifica a `docs/INGESTION.md`.
