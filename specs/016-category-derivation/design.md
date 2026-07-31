# 016 — Derivazione Locale delle Categorie · Design

## Flusso

```
parseEdition(raw)                    ← spec 002/015, invariato:
                                        item.categories = [] se Hermes
                                        non scrive **Categorie:**/[cat: …]
        │
        ▼
editions-loader.ts sync()            ← NUOVO punto di innesto
  per ogni storia/radar/feed lento:
    categories = withDerivedCategories(
      item.categories,                (Hermes, se presente, vince SEMPRE)
      testo dell'item,
      CATEGORY_RULES dell'istanza,
    )
        │
        ▼
parseData() → Zod → collection entry ← invariato: stesso schema
                                        z.array(slug) di oggi
        │
        ▼
editions.ts (getCorpus/                ← invariato: nessuna modifica.
  getEmergentCategories)                 Le categorie derivate sono
                                          indistinguibili da quelle
                                          scritte da Hermes.
```

## Contratto — `src/lib/category-derivation.ts` (nuovo)

```ts
export interface CategoryRule {
  /** Slug canonico già valido (regex /^[a-z0-9-]+$/), scelto dal curatore */
  slug: string;
  /** Termini cercati come substring case-insensitive nel testo dell'item */
  keywords: string[];
}

/** Funzione pura: nessuno stato, nessuna chiamata esterna. */
export function deriveCategories(text: string, rules: CategoryRule[]): string[];

/** Applica deriveCategories() SOLO se l'item non ha già categorie (Hermes vince). */
export function withDerivedCategories(
  categories: string[],
  text: string,
  rules: CategoryRule[],
): string[];
```

`deriveCategories()` itera `rules` nell'ordine dell'array: per ogni
regola, se una qualsiasi `keyword` (lowercased) è substring del testo
(lowercased) e lo slug non è già nel risultato, lo aggiunge. Ordine di
output = ordine di dichiarazione delle regole (il curatore controlla
le priorità ordinando l'array), non ordine di comparsa nel testo —
scelta deliberata: un ordine text-driven renderebbe il risultato
dipendente da dettagli di scrittura non controllati dal curatore.

`withDerivedCategories()` è l'unico punto che decide SE derivare:
`categories.length > 0 ? categories : deriveCategories(text, rules)`.
Separarla da `deriveCategories()` rende il contratto "Hermes vince
sempre" un'unità testabile a sé (criterio di accettazione §2), non un
dettaglio sepolto dentro `editions-loader.ts`.

### Matching: substring case-insensitive, non word-boundary

Nessun regex con `\b` per i confini di parola: in JavaScript `\w` non
copre le lettere accentate italiane (`à è é ì ò ù`), quindi un boundary
"corretto" per l'italiano richiederebbe una regex Unicode più fragile
e meno auditable di un `.includes()` su stringhe lowercased. La
conseguenza (una keyword corta può matchare dentro una parola più
lunga) è un compromesso esplicito: il curatore sceglie keyword
sufficientemente specifiche (preferire frasi/parole intere a frammenti
di 2-3 lettere) — la stessa responsabilità che ha già scrivendo
`CATEGORY_ALIASES` o `SOURCE_ALIASES`, dove un valore scorretto rompe
silenziosamente la build solo se non valido per lo schema Zod, non se
"semanticamente" impreciso.

## File toccati

### `src/lib/category-derivation.ts` (nuovo)

`CategoryRule`, `deriveCategories()`, `withDerivedCategories()` come
sopra. Nessuna dipendenza da Astro, `fs` o istanza attiva: pura logica
su stringhe, seam per i test (le regole arrivano come parametro, non
lette internamente).

### `src/data/category-rules/default.ts` (nuovo)

```ts
import type { CategoryRule } from "../../lib/category-derivation";

/**
 * Regole di derivazione per le istanze SENZA file curato (spec 016):
 * array vuoto — nessuna keyword inventata, mirror di
 * `aliases/default.ts` (spec 014/015). Un'istanza nuova in
 * instances.json che non ha ancora un file `category-rules/<slug>.ts`
 * eredita questo (nessuna categoria derivata finché non si cura).
 */
export const CATEGORY_RULES: CategoryRule[] = [];
```

### `src/data/category-rules/rassegnai.ts` e `src/data/category-rules/sailes.ts` (nuovi, placeholder)

Stessa shape di `default.ts`, entrambi `CATEGORY_RULES: CategoryRule[] = []`
— zero regole. Creati (non lasciati sul solo fallback) per dare al
curatore un file dedicato e scopribile per ciascuna istanza reale,
mirror di come spec 015 ha toccato `aliases/rassegnai.ts` con un
`CATEGORY_ALIASES = {}` esplicito invece di lasciarlo implicito sul
fallback. `sailes` riceve lo stesso trattamento di `rassegnai` (non
solo il fallback) perché è un'istanza reale con un dominio di
contenuto distinto (radar commerciale/regolatorio per il team sales di
Codemotion, vs rassegna tech generalista di `rassegnai`, vedi corpus
reale in `input/sailes-daily/editions/`): le regole che avranno senso
per l'una non avranno senso per l'altra, quindi meritano fin da subito
un file separato anche se oggi entrambi sono vuoti.

### `src/data/category-rules.ts` (nuovo, selettore)

Mirror esatto di `src/data/category-aliases.ts` (spec 015) e
`src/data/source-aliases.ts` (spec 014):

```ts
import { activeInstance } from "../lib/instance";
import * as fallback from "./category-rules/default";
import * as rassegnai from "./category-rules/rassegnai";
import * as sailes from "./category-rules/sailes";

const curated: Record<string, typeof fallback> = { rassegnai, sailes };

const selected = curated[activeInstance().slug] ?? fallback;

export const CATEGORY_RULES = selected.CATEGORY_RULES;
```

### `src/lib/editions-loader.ts` (esistente, punto di innesto)

Import in testa:

```ts
import { CATEGORY_RULES } from "../data/category-rules";
import { withDerivedCategories } from "./category-derivation";
```

Nel `sync()`, la mappa esistente delle storie guadagna un campo
`categories` derivato accanto alla risoluzione immagine già presente:

```ts
const stories = edition.stories.map((s) => {
  const storyImage = resolveImage(s.image, label);
  return {
    ...s,
    categories: withDerivedCategories(
      s.categories,
      `${s.title}\n${s.body}`,
      CATEGORY_RULES,
    ),
    ...(storyImage ? { image: storyImage } : {}),
  };
});

const radar = edition.radar.map((r) => ({
  ...r,
  categories: withDerivedCategories(r.categories, r.text, CATEGORY_RULES),
}));

const slowFeed = edition.slowFeed && {
  ...edition.slowFeed,
  categories: withDerivedCategories(
    edition.slowFeed.categories,
    `${edition.slowFeed.title}\n${edition.slowFeed.body}`,
    CATEGORY_RULES,
  ),
};
```

`stories` sostituisce la `.map()` esistente (stesso identificatore, un
campo in più nel return). `radar` è nuovo: oggi `radar` non viene
rimappato, arriva intatto dallo spread `...edition`. `slowFeed` è
nuovo con la stessa logica.

Nel `parseData()`, i tre array/oggetti derivati sostituiscono quelli
impliciti nello spread (che oggi non include `radar`/`slowFeed`
espliciti, li eredita da `...edition`):

```ts
const data = await parseData({
  id: edition.date,
  data: {
    ...edition,
    ...(image ? { image } : {}),
    stories,
    radar,
    ...(slowFeed ? { slowFeed } : {}),
    file: label,
    ...(podcastFile ? { podcast: { file: podcastFile } } : {}),
  },
});
```

Nessun'altra riga del loader cambia: `resolveImage`, la gestione del
podcast, il conflitto di date, il watcher restano identici.

## Perché il loader e non `editions.ts`

`editions.ts` (`getCorpus()`, `getEmergentCategories()`) opera SOPRA la
collection Astro già validata da Zod: se la derivazione avvenisse lì,
`edition.data.stories[i].categories` — il dato grezzo consumato
direttamente da `SlowFeedFeature.astro` per il kicker del feed lento —
resterebbe `[]`, mentre `/categoria/` (via `getCorpus()`) mostrerebbe
quello stesso item come categorizzato: un'incoerenza visibile tra due
consumer dello stesso dato. `editions-loader.ts` è l'UNICO punto dove
un `RawEdition` diventa l'oggetto validato da Zod: derivare lì rende
il campo `categories` coerente per ogni consumer futuro o presente,
senza dover ricordare di applicare il fallback in ogni lettore. Non è
un caso isolato: è lo stesso ruolo che il loader già gioca per
`resolveImage()` (risolve i path immagine una volta, a monte, non in
ogni componente che li consuma).

## Perché nessuna interazione con `CATEGORY_ALIASES` (spec 015)

`CATEGORY_ALIASES` normalizza un termine **grezzo scritto da Hermes**
(testo libero, potenzialmente con doppie grafie) in uno slug canonico.
Il lato destro di `CATEGORY_RULES` non è testo libero osservato: è uno
slug **scritto dal curatore stesso**, che già sa qual è la forma
canonica che vuole (è la stessa persona che cura `CATEGORY_ALIASES`).
Instradare l'output delle regole attraverso `CATEGORY_ALIASES`
aggiungerebbe un'indirezione senza un problema reale da risolvere, e
introdurrebbe un accoppiamento silenzioso tra due dizionari
indipendenti (un cambio in `CATEGORY_ALIASES` potrebbe riscrivere
uno slug che una regola di `CATEGORY_RULES` assumeva stabile). Se in
futuro emergono due regole che devono confluire nella stessa
categoria, la soluzione è scrivere lo stesso `slug` in entrambe le
regole (o un'unica regola con più `keywords`) — non un livello di
indirezione in più.

## Nessun flag di provenienza

Lo schema Zod (`categories: z.array(slug)`, invariato,
`content.config.ts`) non guadagna un campo. Una categoria derivata è,
byte per byte, indistinguibile da una scritta da Hermes una volta
assegnata: stesso slug, stessa voce di `getEmergentCategories()`,
stessa pagina `/categoria/<slug>/`. Se in futuro servisse distinguerle
(debug editoriale, audit di quali categorie sono "vere" vs stimate)
sarà una spec separata con un motivo concreto — aggiungerlo ora
sarebbe uno stato speculativo non richiesto da nessun requisito.

## Tensione con la costituzione (§2) — da approvare esplicitamente

Costituzione §2: *"Tassonomia e fonti sono emergenti. Nessun elenco
fisso."* `CATEGORY_RULES` è, nei fatti, una mappa
`keyword → slug categoria` il cui lato destro è un piccolo elenco
scelto a mano dal curatore — la stessa forma di un enum che la
costituzione vieta. Questa spec la introduce comunque, sotto tre
condizioni che vanno lette come il perimetro esplicito dell'eccezione,
non come un'eccezione silenziosa:

1. **Hermes vince sempre, item per item.** `withDerivedCategories()`
   si applica SOLO quando `item.categories` è vuoto. Nel momento in
   cui un'edizione futura include `**Categorie:** …` per una storia,
   quella riga vince su qualunque regola locale per quello stesso
   item — la derivazione non è mai un override, è un riempitivo per
   un campo che Hermes, oggi, lascia vuoto. Letta così è coerente con
   costituzione §1 ("mai convertire i contenuti"): `input/` non viene
   mai toccato né riscritto, si calcola un dato derivato *di
   CodeWhisperer* sopra al corpus, non si modifica il corpus.
2. **Lo spazio resta aperto, mai chiuso.** Un termine del corpus non
   coperto da nessuna regola non produce un errore né uno scarto:
   l'item resta con `categories: []`, esattamente come oggi. Aggiungere
   una keyword o uno slug non richiede toccare nessun elenco "ammesso"
   altrove — lo schema Zod valida solo la forma (`/^[a-z0-9-]+$/`), non
   un enum di valori — quindi `CATEGORY_RULES` può crescere o cambiare
   in ogni momento senza rompere nulla: è per costruzione un
   sottoinsieme parziale e sempre incompleto del corpus, mai una
   tassonomia dichiarata esaustiva.
3. **Nessuna superficie parallela.** Il risultato alimenta
   `getEmergentCategories()` (`src/lib/editions.ts`, invariato)
   esattamente come le categorie scritte da Hermes: stesso slug,
   stessa pagina `/categoria/<slug>/`, stesso conteggio (vedi "Nessun
   flag di provenienza" sopra).

Questa lettura non riscrive la costituzione: è un'interpretazione che
Luca deve approvare esplicitamente prima di T1 (gate HITL punto 1),
perché un dizionario curato a mano — per quanto giustificato come
stopgap fallback-only — introduce comunque una forma minima di
editorializzazione che il corpus puramente emergente non ha mai avuto.

## Test — dove e come

- `tests/unit/category-derivation.test.ts` (nuovo): import diretto di
  `deriveCategories`/`withDerivedCategories` da
  `src/lib/category-derivation.ts`, con array di regole fittizie
  costruiti inline nel test (nessun `vi.mock`, la funzione prende le
  regole come parametro). Copre tutti i bullet del criterio di
  accettazione §1 e §2: match case-insensitive, nessun match, ordine
  di dichiarazione delle regole, dedup su slug ripetuto, array di
  regole vuoto → sempre `[]`, `withDerivedCategories` non deriva mai
  se `categories` non è vuoto.
- `tests/unit/category-rules.test.ts` (nuovo, mirror di
  `tests/unit/source-aliases.test.ts` e del futuro
  `category-aliases.test.ts` di spec 015): import statico di
  `src/data/category-rules.ts` (nessun env `INSTANCE`) → `[]`; import
  dinamico di `src/data/category-rules/sailes.ts` → `[]`; import
  dinamico di `src/data/category-rules/default.ts` → `[]` (criterio
  di accettazione §3).
- Nessun test dedicato per la wiring dentro
  `src/lib/editions-loader.ts`: il loader non ha oggi nessun test
  unitario diretto (nemmeno per `resolveImage()`, la stessa classe di
  logica) — è esercitato solo da `pnpm build`/`pnpm dev` sul corpus
  reale. Con `CATEGORY_RULES` vuoto per `rassegnai` e `sailes` in
  questa spec, `withDerivedCategories()` è per costruzione un no-op
  su ogni item reale (criterio §1 ultimo bullet + §2 terzo bullet):
  `pnpm build` sulle due istanze produce output identico a prima di
  questa spec, ed è il regression guard del criterio §4. La prima
  volta che un file `category-rules/<slug>.ts` riceve regole reali,
  la wiring verrà esercitata concretamente dal build/e2e esistenti su
  quell'istanza — non serve anticipare qui un test che oggi non
  potrebbe osservare nessun comportamento diverso da zero.
- Nessuna modifica a `tests/unit/parse-edition.test.ts`,
  `tests/e2e/filters.spec.ts` (o equivalente): entrambi restano verdi
  invariati, coprendo per costruzione che `categories: []` resta
  l'esito quando né Hermes né una regola producono nulla.

## Gate HITL

Luca approva prima dell'implementazione:

1. La lettura della tensione costituzionale (§2) sopra — le tre
   condizioni (Hermes vince sempre item per item, spazio mai chiuso,
   nessuna superficie parallela) come perimetro esplicito
   dell'eccezione, non l'eccezione stessa.
2. `withDerivedCategories()` come unità separata da
   `deriveCategories()`, per rendere "Hermes vince sempre" un
   contratto testabile a sé (non un dettaglio dentro il loader).
3. Innesto in `src/lib/editions-loader.ts` (storie, radar, feed
   lento), non in `src/lib/editions.ts` — motivazione: coerenza tra
   tutti i consumer del dato validato, non solo `/categoria/`.
4. `category-rules/rassegnai.ts` e `category-rules/sailes.ts` creati
   come placeholder vuoti e registrati nel selettore (non lasciati
   solo sul fallback `default.ts`) — entrambi partono senza regole,
   nessuna curatela reale in questa spec.
5. Matching per substring case-insensitive, non word-boundary regex
   (motivazione: Unicode/accenti italiani, vedi sezione dedicata) —
   il curatore è responsabile di scegliere keyword sufficientemente
   specifiche.
6. Nessuna interazione con `CATEGORY_ALIASES` (spec 015): le regole
   emettono slug canonici direttamente.
7. Nessun test unitario dedicato per la wiring nel loader (mirror
   della mancanza di test diretti per `resolveImage()`): verificata
   da `pnpm gate` come no-op finché `CATEGORY_RULES` resta vuoto.
