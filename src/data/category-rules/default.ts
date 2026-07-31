import type { CategoryRule } from "../../lib/category-derivation";

/**
 * Regole di derivazione per le istanze SENZA file curato (spec 016):
 * array vuoto — nessuna keyword inventata, mirror di
 * `aliases/default.ts` (spec 014/015). Un'istanza nuova in
 * instances.json che non ha ancora un file `category-rules/<slug>.ts`
 * eredita questo (nessuna categoria derivata finché non si cura).
 */
export const CATEGORY_RULES: CategoryRule[] = [];
