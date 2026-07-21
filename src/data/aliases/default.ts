/**
 * Alias fonte di default per le istanze SENZA file curato (spec 014):
 * set vuoti — la tassonomia resta puramente emergente dal corpus
 * (costituzione §2). Quando un'istanza accumula grafie doppie o
 * aggregatori propri, si crea `src/data/aliases/<slug>.ts` e lo si
 * registra nel selettore `src/data/source-aliases.ts`.
 */

export const AGGREGATOR_SLUGS = new Set<string>();

export const AGGREGATOR_HOSTS: Record<string, string> = {};

export const SOURCE_ALIASES: Record<string, string> = {};
