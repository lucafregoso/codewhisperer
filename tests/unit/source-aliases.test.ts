/**
 * Spec 014 — alias fonte per istanza (criterio 4).
 *
 * Dopo T3 `src/data/source-aliases.ts` diventa un selettore che
 * riesporta il modulo alias dell'istanza attiva da
 * `src/data/aliases/<slug>.ts`. Contratto:
 *
 * - istanza default (nessuna env): il selettore riespone gli alias
 *   attuali — spot check su chiavi significative del corpus reale.
 *   Import statico, verde oggi: REGRESSION GUARD.
 * - `src/data/aliases/rassegnai.ts` = contenuto curato attuale.
 * - `src/data/aliases/default.ts` = set VUOTI per le istanze senza file
 *   curato: solo tassonomia emergente (costituzione §2).
 * - Export names invariati ovunque: AGGREGATOR_SLUGS, AGGREGATOR_HOSTS,
 *   SOURCE_ALIASES (`src/lib/parser/sources.ts` non cambia import).
 *   Import dinamici per i moduli nuovi: rosso pulito finché mancano.
 */
import { describe, expect, it } from "vitest";
import {
  AGGREGATOR_HOSTS,
  AGGREGATOR_SLUGS,
  SOURCE_ALIASES,
} from "../../src/data/source-aliases";

describe("source-aliases — istanza default riespone gli alias attuali", () => {
  it("spot check AGGREGATOR_SLUGS (aggregatori del pattern via)", () => {
    expect(AGGREGATOR_SLUGS.has("techmeme")).toBe(true);
    expect(AGGREGATOR_SLUGS.has("hacker-news")).toBe(true);
    expect(AGGREGATOR_SLUGS.has("lobste-rs")).toBe(true);
  });

  it("spot check AGGREGATOR_HOSTS (host → slug aggregatore)", () => {
    expect(AGGREGATOR_HOSTS["news.ycombinator.com"]).toBe("hacker-news");
    expect(AGGREGATOR_HOSTS["techmeme.com"]).toBe("techmeme");
  });

  it("spot check SOURCE_ALIASES (grafie doppie osservate)", () => {
    expect(SOURCE_ALIASES["lobste.rs"]).toBe("lobste-rs");
    expect(SOURCE_ALIASES["hacker news"]).toBe("hacker-news");
  });
});

describe("aliases/rassegnai — modulo curato dell'istanza storica (T3)", () => {
  it("export names invariati e contenuto = alias attuali", async () => {
    const mod: any = await import("../../src/data/aliases/rassegnai");
    expect(mod.AGGREGATOR_SLUGS).toBeInstanceOf(Set);
    expect(mod.AGGREGATOR_SLUGS.has("techmeme")).toBe(true);
    expect(mod.AGGREGATOR_HOSTS["lobste.rs"]).toBe("lobste-rs");
    expect(mod.SOURCE_ALIASES["hacker news"]).toBe("hacker-news");
  });
});

describe("aliases/default — istanza nuova parte con set vuoti (T3)", () => {
  it("export names invariati, tutti vuoti (tassonomia solo emergente, §2)", async () => {
    const mod: any = await import("../../src/data/aliases/default");
    expect(mod.AGGREGATOR_SLUGS).toBeInstanceOf(Set);
    expect(mod.AGGREGATOR_SLUGS.size).toBe(0);
    expect(mod.AGGREGATOR_HOSTS).toEqual({});
    expect(mod.SOURCE_ALIASES).toEqual({});
  });
});
