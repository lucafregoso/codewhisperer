/**
 * Selettore degli alias categoria per istanza (spec 015): riespone il
 * modulo curato dell'istanza attiva da `src/data/aliases/<slug>.ts`,
 * con fallback alla mappa vuota di `aliases/default.ts` per le
 * istanze senza file curato. Mirror di `source-aliases.ts` (spec 014).
 *
 * Per curare gli alias categoria di un'istanza: aggiungere/estendere
 * `CATEGORY_ALIASES` in `src/data/aliases/<slug>.ts` (stesso file
 * degli alias fonte, stessa cartella).
 */
import { activeInstance } from "../lib/instance";
import * as fallback from "./aliases/default";
import * as rassegnai from "./aliases/rassegnai";

const curated: Record<string, typeof fallback> = { rassegnai };

const selected = curated[activeInstance().slug] ?? fallback;

export const CATEGORY_ALIASES = selected.CATEGORY_ALIASES;
