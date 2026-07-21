/**
 * Selettore degli alias fonte per istanza (spec 014): riespone il
 * modulo curato dell'istanza attiva da `src/data/aliases/<slug>.ts`,
 * con fallback ai set vuoti di `aliases/default.ts` per le istanze
 * senza file curato. Export names invariati: il consumer
 * (`src/lib/parser/sources.ts`) non cambia import.
 *
 * Per curare gli alias di una nuova istanza: creare
 * `src/data/aliases/<slug>.ts` (stessa shape) e aggiungerlo alla
 * mappa qui sotto.
 */
import { activeInstance } from "../lib/instance";
import * as fallback from "./aliases/default";
import * as rassegnai from "./aliases/rassegnai";

const curated: Record<string, typeof fallback> = { rassegnai };

const selected = curated[activeInstance().slug] ?? fallback;

export const AGGREGATOR_SLUGS = selected.AGGREGATOR_SLUGS;
export const AGGREGATOR_HOSTS = selected.AGGREGATOR_HOSTS;
export const SOURCE_ALIASES = selected.SOURCE_ALIASES;
