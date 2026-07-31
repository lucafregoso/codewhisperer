/**
 * Selettore delle regole di derivazione categoria per istanza (spec
 * 016): riespone il modulo curato dell'istanza attiva da
 * `src/data/category-rules/<slug>.ts`, con fallback all'array vuoto
 * di `category-rules/default.ts` per le istanze senza file curato.
 * Mirror di `src/data/category-aliases.ts` (spec 015) e
 * `src/data/source-aliases.ts` (spec 014).
 *
 * Per curare le regole di un'istanza: aggiungere/estendere
 * `CATEGORY_RULES` in `src/data/category-rules/<slug>.ts`.
 */
import { activeInstance } from "../lib/instance";
import * as fallback from "./category-rules/default";
import * as rassegnai from "./category-rules/rassegnai";
import * as sailes from "./category-rules/sailes";

const curated: Record<string, typeof fallback> = { rassegnai, sailes };

const selected = curated[activeInstance().slug] ?? fallback;

export const CATEGORY_RULES = selected.CATEGORY_RULES;
