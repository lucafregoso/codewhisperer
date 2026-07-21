/**
 * Registry fittizio per i test della spec 014 (istanze EdicolAI).
 *
 * Le istanze finte NON entrano mai in `src/data/instances.json`: il
 * design prescrive che "le istanze fittizie dei test vivono in fixture,
 * non nel registry vero". La shape replica il JSON del registry
 * (design.md §Registry): `default` + `instances[]` con
 * slug/contentDir/basePath/branding.
 */

export const FIXTURE_INSTANCE_DEFAULT = {
  slug: "gazzetta",
  contentDir: "input/gazzetta-daily",
  basePath: "/codewhisperer/",
  branding: {
    name: "Gazzetta Fixture",
    tagline: "Tagline di prova.",
    description: "Descrizione di prova per l'istanza fittizia di default.",
    themeColor: "#123456",
  },
};

export const FIXTURE_INSTANCE_SECONDARY = {
  slug: "bollettino",
  contentDir: "input/bollettino-daily",
  basePath: "/codewhisperer/bollettino/",
  branding: {
    name: "Bollettino Fixture",
    tagline: "Tagline secondaria di prova.",
    description: "Descrizione di prova per l'istanza fittizia non-default.",
    themeColor: "#654321",
  },
};

export const FIXTURE_REGISTRY = {
  default: "gazzetta",
  instances: [FIXTURE_INSTANCE_DEFAULT, FIXTURE_INSTANCE_SECONDARY],
};
