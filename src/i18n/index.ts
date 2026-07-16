import { site } from "../data/site";

export const locales = ["it"] as const;
export type Locale = (typeof locales)[number];

/**
 * Gate delle lingue instradate. Oggi solo italiano; la struttura resta
 * pronta per altre lingue senza toccare i componenti (costituzione §8).
 */
export const activeLocales: Locale[] = ["it"];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

const it = {
  meta: {
    siteName: site.name,
    tagline: site.tagline,
    description: site.meta.description,
  },
  nav: {
    home: "Ultima edizione",
    editions: "Edizioni",
    categories: "Categorie",
    sources: "Fonti",
    search: "Cerca",
    skipToContent: "Salta al contenuto",
  },
  theme: {
    toggle: "Cambia tema",
    light: "Tema chiaro",
    dark: "Tema scuro",
  },
  edition: {
    editionOf: (date: string) => `Edizione del ${date}`,
    lead: "In primo piano",
    radar: "Radar",
    slowFeed: "Dal feed lento",
    coverage: "Nota di copertura",
    sources: "Fonti",
    via: "via",
    previous: "Edizione precedente",
    next: "Edizione successiva",
    updatedAt: (date: string) => `Pubblicata il ${date}`,
  },
  archive: {
    title: "Edizioni",
    stories: (count: number) => (count === 1 ? "1 storia" : `${count} storie`),
  },
  filters: {
    category: "Categoria",
    source: "Fonte",
    uncategorized: "Senza categoria",
    allEditions: "Tutte le edizioni",
  },
  externalNewTab: "(si apre in una nuova scheda)",
} as const;

export const translations = { it } as const;

export function t(locale: Locale = "it") {
  return translations[locale];
}
