/**
 * Spec 014 — `src/data/site.ts` derives the site identity from the
 * active instance's branding (registry `src/data/instances.json`,
 * `INSTANCE` env).
 *
 * Asserted as DERIVATION + SHAPE, never as literal values. Branding,
 * language and every other per-instance field are set from EdicolAI:
 * name, tagline, description and theme colour belong to whichever
 * magazine is being built, and are expected to differ per instance and
 * to change over time. Pinning "CodeWhisperer" here would mean a
 * rebrand — or simply building another magazine — shows up as a failed
 * test instead of a different site.
 *
 * What must hold for every instance: `site` mirrors the branding of
 * the active instance, `titlePattern` is built from that same name,
 * the locale fields are well-formed and mutually consistent, and the
 * export keys stay exactly these (BaseLayout, MastHead, rss.xml,
 * structured-data and i18n consume this shape as-is).
 */
import { describe, expect, it } from "vitest";
import { site } from "../../src/data/site";
import { activeLocales } from "../../src/i18n";
import { activeInstance } from "../../src/lib/instance";

const { branding } = activeInstance();

describe("site — identità derivata dall'istanza attiva", () => {
  it("name e tagline vengono dal branding dell'istanza", () => {
    expect(site.name).toBe(branding.name);
    expect(site.tagline).toBe(branding.tagline);
  });

  it("description e themeColor vengono dal branding dell'istanza", () => {
    expect(site.meta.description).toBe(branding.description);
    expect(site.meta.themeColor).toBe(branding.themeColor);
    expect(site.meta.themeColor).toMatch(/^#[0-9a-f]{3,8}$/i);
  });

  it("titlePattern è costruito sul nome dell'istanza", () => {
    expect(site.meta.titlePattern).toBe(`%s — ${branding.name}`);
    expect(site.meta.titlePattern).toContain("%s");
  });

  it("lang è una lingua instradata e ogLocale ne è coerente", () => {
    expect(activeLocales).toContain(site.meta.lang);
    expect(site.meta.ogLocale).toMatch(/^[a-z]{2}_[A-Z]{2}$/);
    expect(site.meta.ogLocale.slice(0, 2)).toBe(site.meta.lang);
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
