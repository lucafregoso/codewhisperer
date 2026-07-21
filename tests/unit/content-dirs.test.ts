/**
 * Spec 014 — derivazione delle sorgenti di contenuto per istanza (T6).
 *
 * Due blocchi:
 *
 * 1. REGRESSION GUARD (criterio 2 dei requirements): con l'istanza
 *    default e NESSUNA env `INSTANCE`, gli export di
 *    `src/lib/content-dirs.ts` valgono ESATTAMENTE i valori pre-014.
 *    Import statico: questi test sono verdi oggi e devono restarlo.
 *
 * 2. Contratto nuovo (T2): il modulo espone anche il derivatore PURO
 *    `deriveContentDirs(instance, isDefault)` →
 *    `{ editionDirs, podcastDirs, imagesDir }`. È il SEAM scelto per le
 *    istanze fittizie: l'istanza arriva come parametro (fixture fuori
 *    dal registry vero, vedi tests/unit/fixtures/instances.ts), senza
 *    stub di env né slug finti in `src/data/instances.json`. Le
 *    costanti esportate restano `deriveContentDirs(activeInstance(), …)`
 *    calcolate a load: export names invariati per loader,
 *    content-assets.mjs e tests/helpers/corpus.ts.
 *    Import dinamico: rosso pulito finché l'export non esiste.
 */
import { describe, expect, it } from "vitest";
import {
  EDITION_DIRS,
  IMAGES_DIR,
  PODCAST_DIRS,
} from "../../src/lib/content-dirs";
import {
  FIXTURE_INSTANCE_DEFAULT,
  FIXTURE_INSTANCE_SECONDARY,
} from "./fixtures/instances";

describe("content-dirs — REGRESSION GUARD istanza default (nessuna env)", () => {
  it("EDITION_DIRS: lane manuale + submodule, identico a pre-014", () => {
    expect(EDITION_DIRS).toEqual(["input", "input/rassegnai-daily/editions"]);
  });

  it("PODCAST_DIRS: identico a pre-014 (ordine = priorità)", () => {
    expect(PODCAST_DIRS).toEqual([
      "input/podcast",
      "input/rassegnai-daily/editions/podcast",
    ]);
  });

  it("IMAGES_DIR: identico a pre-014", () => {
    expect(IMAGES_DIR).toBe("input/rassegnai-daily/editions/images");
  });
});

describe("content-dirs — deriveContentDirs (seam puro, istanze fixture)", () => {
  async function deriveOrFail(): Promise<
    (instance: unknown, isDefault: boolean) => any
  > {
    const mod: any = await import("../../src/lib/content-dirs");
    expect(
      typeof mod.deriveContentDirs,
      "export deriveContentDirs mancante (T2)",
    ).toBe("function");
    return mod.deriveContentDirs;
  }

  it("istanza NON-default: solo i path del submodule, MAI la lane manuale", async () => {
    const derive = await deriveOrFail();
    const dirs = derive(FIXTURE_INSTANCE_SECONDARY, false);
    expect(dirs.editionDirs).toEqual(["input/bollettino-daily/editions"]);
    expect(dirs.podcastDirs).toEqual([
      "input/bollettino-daily/editions/podcast",
    ]);
    expect(dirs.imagesDir).toBe("input/bollettino-daily/editions/images");
  });

  it("istanza default: lane manuale davanti ai path del submodule", async () => {
    const derive = await deriveOrFail();
    const dirs = derive(FIXTURE_INSTANCE_DEFAULT, true);
    expect(dirs.editionDirs).toEqual([
      "input",
      "input/gazzetta-daily/editions",
    ]);
    expect(dirs.podcastDirs).toEqual([
      "input/podcast",
      "input/gazzetta-daily/editions/podcast",
    ]);
    expect(dirs.imagesDir).toBe("input/gazzetta-daily/editions/images");
  });
});
