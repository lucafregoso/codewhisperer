/**
 * Spec 014 — selezione dell'istanza attiva (T6, scritto PRIMA
 * dell'implementazione: rosso finché T1 non esiste).
 *
 * Contratto sotto test (design.md §Registry e §Selezione):
 *
 * - `src/data/instances.json` — registry versionato: campo `default`
 *   (slug) + `instances[]`, ognuna con slug/contentDir/basePath/branding
 *   (name/tagline/description/themeColor). L'istanza `rassegnai`
 *   codifica l'eccezione root nel proprio `basePath`.
 *
 * - `src/lib/instance.ts` esporta:
 *   - `resolveInstance(slug, registry)` — resolver PURO: con slug
 *     undefined (o stringa vuota) ritorna l'istanza indicata dal campo
 *     `default` del registry; con slug presente ritorna quella; con
 *     slug sconosciuto lancia un errore il cui messaggio elenca gli
 *     slug validi. È il SEAM per testare istanze fittizie: il registry
 *     arriva come parametro, quindi le fixture non toccano mai
 *     `src/data/instances.json` (vedi tests/unit/fixtures/instances.ts).
 *   - `activeInstance()` — applica il resolver a `process.env.INSTANCE`
 *     sul registry vero.
 *
 * Tutti gli import sono dinamici + vi.resetModules: i derivati possono
 * essere calcolati a load del modulo, quindi l'env va stubbata PRIMA
 * dell'import e ogni test riparte da un module graph pulito.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  FIXTURE_INSTANCE_SECONDARY,
  FIXTURE_REGISTRY,
} from "./fixtures/instances";

let savedInstanceEnv: string | undefined;

beforeEach(() => {
  savedInstanceEnv = process.env.INSTANCE;
  delete process.env.INSTANCE;
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllEnvs();
  if (savedInstanceEnv === undefined) delete process.env.INSTANCE;
  else process.env.INSTANCE = savedInstanceEnv;
});

/**
 * Il fail-fast su slug sconosciuto può avvenire a load del modulo o
 * alla chiamata: il contratto richiede solo che avvenga PRIMA di
 * qualsiasi parse. Catturiamo l'errore in entrambi i punti.
 */
async function importAndCallActiveInstance(): Promise<
  { instance?: any; error?: Error }
> {
  try {
    const mod: any = await import("../../src/lib/instance");
    expect(
      typeof mod.activeInstance,
      "export activeInstance mancante (T1)",
    ).toBe("function");
    return { instance: mod.activeInstance() };
  } catch (e) {
    return { error: e as Error };
  }
}

describe("registry — src/data/instances.json", () => {
  it("ha default 'rassegnai' e ogni istanza espone slug/contentDir/basePath/branding", async () => {
    const registry: any = (await import("../../src/data/instances.json"))
      .default;
    expect(registry.default).toBe("rassegnai");
    expect(Array.isArray(registry.instances)).toBe(true);
    expect(registry.instances.length).toBeGreaterThan(0);
    for (const inst of registry.instances) {
      expect(inst.slug).toEqual(expect.any(String));
      expect(inst.contentDir).toEqual(expect.any(String));
      expect(inst.basePath).toEqual(expect.any(String));
      expect(inst.branding.name).toEqual(expect.any(String));
      expect(inst.branding.tagline).toEqual(expect.any(String));
      expect(inst.branding.description).toEqual(expect.any(String));
      expect(inst.branding.themeColor).toEqual(expect.any(String));
    }
  });

  it("rassegnai codifica l'eccezione root e il branding attuale del sito", async () => {
    const registry: any = (await import("../../src/data/instances.json"))
      .default;
    const rassegnai = registry.instances.find(
      (i: any) => i.slug === "rassegnai",
    );
    expect(rassegnai).toBeDefined();
    expect(rassegnai.contentDir).toBe("input/rassegnai-daily");
    expect(rassegnai.basePath).toBe("/codewhisperer/");
    // Il branding è la fonte da cui T3 deriva src/data/site.ts: deve
    // coincidere con l'identità attuale (regression guard, criterio 2).
    expect(rassegnai.branding.name).toBe("CodeWhisperer");
    expect(rassegnai.branding.tagline).toBe(
      "La rassegna tech quotidiana, impaginata.",
    );
    expect(rassegnai.branding.themeColor).toBe("#111111");
  });
});

describe("resolveInstance — resolver puro su registry fixture", () => {
  it("slug undefined → istanza `default` del registry", async () => {
    const mod: any = await import("../../src/lib/instance");
    expect(
      typeof mod.resolveInstance,
      "export resolveInstance mancante (T1)",
    ).toBe("function");
    const inst = mod.resolveInstance(undefined, FIXTURE_REGISTRY);
    expect(inst.slug).toBe("gazzetta");
    expect(inst.contentDir).toBe("input/gazzetta-daily");
  });

  it("stringa vuota equivale ad assente (INSTANCE= in CI) → default", async () => {
    const mod: any = await import("../../src/lib/instance");
    expect(mod.resolveInstance("", FIXTURE_REGISTRY).slug).toBe("gazzetta");
  });

  it("slug valido non-default → quella istanza, branding incluso", async () => {
    const mod: any = await import("../../src/lib/instance");
    const inst = mod.resolveInstance("bollettino", FIXTURE_REGISTRY);
    expect(inst).toEqual(FIXTURE_INSTANCE_SECONDARY);
    expect(inst.basePath).toBe("/codewhisperer/bollettino/");
  });

  it("slug sconosciuto → errore che elenca TUTTI gli slug validi", async () => {
    const mod: any = await import("../../src/lib/instance");
    const call = () => mod.resolveInstance("fantasma", FIXTURE_REGISTRY);
    expect(call).toThrowError(/gazzetta/);
    expect(call).toThrowError(/bollettino/);
    // Lo slug richiesto compare nel messaggio: l'errore deve dire cosa
    // è stato chiesto, non solo cosa era lecito.
    expect(call).toThrowError(/fantasma/);
  });
});

describe("activeInstance — registry vero via env INSTANCE", () => {
  it("senza INSTANCE ritorna l'istanza default del registry (rassegnai)", async () => {
    const { instance, error } = await importAndCallActiveInstance();
    expect(error, error?.message).toBeUndefined();
    expect(instance.slug).toBe("rassegnai");
    expect(instance.contentDir).toBe("input/rassegnai-daily");
    expect(instance.basePath).toBe("/codewhisperer/");
  });

  it("INSTANCE=rassegnai ritorna l'istanza esplicita", async () => {
    vi.stubEnv("INSTANCE", "rassegnai");
    vi.resetModules();
    const { instance, error } = await importAndCallActiveInstance();
    expect(error, error?.message).toBeUndefined();
    expect(instance.slug).toBe("rassegnai");
  });

  it("slug sconosciuto: fallisce subito, con gli slug validi nel messaggio", async () => {
    vi.stubEnv("INSTANCE", "istanza-inesistente");
    vi.resetModules();
    const { instance, error } = await importAndCallActiveInstance();
    expect(instance).toBeUndefined();
    expect(error).toBeDefined();
    expect(error!.message).toMatch(/istanza-inesistente/);
    expect(error!.message).toMatch(/rassegnai/);
  });
});
