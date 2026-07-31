/**
 * Spec 015 — alias categoria per istanza (criterio di accettazione §1).
 *
 * Mirror di tests/unit/source-aliases.test.ts, ma per un solo export
 * (`CATEGORY_ALIASES`, le categorie non hanno il concetto di
 * aggregatore/pattern "via" delle fonti). Contratto:
 *
 * - istanza default (nessuna env `INSTANCE`): il selettore
 *   `src/data/category-aliases.ts` riespone `CATEGORY_ALIASES` — oggi
 *   `{}` per `rassegnai` (nessun doppione curato, gate HITL punto 2).
 *   Import statico: REGRESSION GUARD.
 * - `src/data/aliases/rassegnai.ts` → `CATEGORY_ALIASES` è `{}`.
 * - `src/data/aliases/default.ts` → `CATEGORY_ALIASES` è `{}` (set
 *   vuoto per le istanze senza file curato, solo tassonomia emergente,
 *   costituzione §2).
 */
import { describe, expect, it } from "vitest";
import { CATEGORY_ALIASES } from "../../src/data/category-aliases";

describe("category-aliases — istanza default riespone la mappa curata", () => {
  it("CATEGORY_ALIASES è {} oggi per rassegnai (nessun doppione osservato)", () => {
    expect(CATEGORY_ALIASES).toEqual({});
  });
});

describe("aliases/rassegnai — modulo curato dell'istanza storica (spec 015)", () => {
  it("CATEGORY_ALIASES è {} (parte vuota, gate HITL punto 2)", async () => {
    const mod: any = await import("../../src/data/aliases/rassegnai");
    expect(mod.CATEGORY_ALIASES).toEqual({});
  });
});

describe("aliases/default — istanza senza file curato (spec 015)", () => {
  it("CATEGORY_ALIASES è {} (tassonomia solo emergente, §2)", async () => {
    const mod: any = await import("../../src/data/aliases/default");
    expect(mod.CATEGORY_ALIASES).toEqual({});
  });
});
