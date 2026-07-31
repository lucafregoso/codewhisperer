/**
 * Derivazione locale delle categorie (spec 016): quando un item
 * (storia, radar, feed lento) non ha `categories` scritte da Hermes,
 * CodeWhisperer ne stima da un piccolo dizionario `keyword → slug`
 * curato per istanza (`src/data/category-rules.ts`), valutato come
 * funzione pura sul testo dell'item — niente enum consultabile a
 * parte, niente LLM, niente chiamata esterna, niente storage
 * intermedio. Fallback-only: se Hermes ha già scritto qualcosa per
 * quell'item, quella riga vince sempre (vedi `withDerivedCategories`).
 */

export interface CategoryRule {
  /** Slug canonico già valido (regex /^[a-z0-9-]+$/), scelto dal curatore. */
  slug: string;
  /** Termini cercati come substring case-insensitive nel testo dell'item. */
  keywords: string[];
}

/**
 * Funzione pura: nessuno stato, nessuna chiamata esterna. Itera
 * `rules` nell'ordine dell'array; per ogni regola, se una qualsiasi
 * keyword (lowercased) è substring del testo (lowercased) e lo slug
 * non è già nel risultato, lo aggiunge. Ordine di output = ordine di
 * dichiarazione delle regole (il curatore controlla le priorità
 * ordinando l'array), non ordine di comparsa nel testo.
 *
 * Matching per substring, non regex word-boundary: `\w` in JavaScript
 * non copre le lettere accentate italiane, quindi un boundary
 * "corretto" richiederebbe una regex Unicode più fragile di un
 * `.includes()` su stringhe lowercased. Il curatore è responsabile di
 * scegliere keyword sufficientemente specifiche.
 */
export function deriveCategories(text: string, rules: CategoryRule[]): string[] {
  const haystack = text.toLowerCase();
  const result: string[] = [];
  for (const rule of rules) {
    if (result.includes(rule.slug)) continue;
    const matches = rule.keywords.some((keyword) => haystack.includes(keyword.toLowerCase()));
    if (matches) result.push(rule.slug);
  }
  return result;
}

/**
 * Applica `deriveCategories()` SOLO se l'item non ha già categorie
 * (Hermes vince sempre, item per item): `categories` non vuoto →
 * ritornato invariato, la regola locale non viene mai valutata.
 */
export function withDerivedCategories(
  categories: string[],
  text: string,
  rules: CategoryRule[],
): string[] {
  return categories.length > 0 ? categories : deriveCategories(text, rules);
}
