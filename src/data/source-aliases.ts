/**
 * Fonti e categorie sono EMERGENTI (costituzione §2): questo file contiene
 * solo le normalizzazioni minime — gli aggregatori del pattern "via" e gli
 * alias per grafie doppie della stessa testata.
 */

/** Slug degli aggregatori: nel pattern "A (B)" l'aggregatore è sempre `via`. */
export const AGGREGATOR_SLUGS = new Set([
  "techmeme",
  "hacker-news",
  "lobste-rs",
]);

/** Host → slug aggregatore, per riconoscere il target reale del link. */
export const AGGREGATOR_HOSTS: Record<string, string> = {
  "www.techmeme.com": "techmeme",
  "techmeme.com": "techmeme",
  "news.ycombinator.com": "hacker-news",
  "lobste.rs": "lobste-rs",
};

/** Alias label → slug canonico, solo per grafie doppie osservate. */
export const SOURCE_ALIASES: Record<string, string> = {
  "lobste.rs": "lobste-rs",
  "hacker news": "hacker-news",
};
