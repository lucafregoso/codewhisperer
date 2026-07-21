/**
 * Spec 014 — REGRESSION GUARD su src/data/site.ts (criterio 2).
 *
 * Dopo T3 `site` sarà derivato dal branding dell'istanza attiva: con
 * l'istanza default e NESSUNA env `INSTANCE` i valori devono restare
 * ESATTAMENTE quelli pre-014, fissati qui come snapshot. La shape
 * dell'export è vincolante: BaseLayout, MastHead, rss.xml,
 * structured-data e i18n la consumano così com'è.
 *
 * Questi test sono verdi oggi e devono restare verdi dopo
 * l'implementazione: se diventano rossi, T3 ha rotto l'istanza storica.
 */
import { describe, expect, it } from "vitest";
import { site } from "../../src/data/site";

describe("site — snapshot istanza default (nessuna env)", () => {
  it("identità: name e tagline invariati", () => {
    expect(site.name).toBe("CodeWhisperer");
    expect(site.tagline).toBe("La rassegna tech quotidiana, impaginata.");
  });

  it("meta invariata: lang, ogLocale, titlePattern, themeColor", () => {
    expect(site.meta.lang).toBe("it");
    expect(site.meta.ogLocale).toBe("it_IT");
    expect(site.meta.titlePattern).toBe("%s — CodeWhisperer");
    expect(site.meta.themeColor).toBe("#111111");
  });

  it("meta.description invariata (stringa esatta)", () => {
    expect(site.meta.description).toBe(
      "CodeWhisperer impagina ogni giorno la rassegna tech di Hermes: " +
        "le storie in primo piano, il radar e il feed lento, con filtri per " +
        "fonte e categoria.",
    );
  });

  it("shape dell'export invariata (nessuna chiave aggiunta o rimossa)", () => {
    expect(Object.keys(site).sort()).toEqual(["meta", "name", "tagline"]);
    expect(Object.keys(site.meta).sort()).toEqual([
      "description",
      "lang",
      "ogLocale",
      "themeColor",
      "titlePattern",
    ]);
  });
});
