const ACCENT_COUNT = 6;

/**
 * Le categorie sono emergenti: l'accento visivo si assegna con un hash
 * deterministico dello slug sulla palette ciclica --accent-0..5, così lo
 * stesso slug ha sempre lo stesso colore in ogni build.
 */
export function accentVar(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return `--accent-${hash % ACCENT_COUNT}`;
}
