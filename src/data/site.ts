/**
 * Identità del sito — unica fonte di verità per nome, tagline e meta.
 * Dalla spec 014 l'identità deriva dal branding dell'istanza attiva
 * (registry src/data/instances.json, env INSTANCE); `lang` e
 * `ogLocale` restano globali (i18n, solo `it` — costituzione §8).
 * Le stringhe UI vivono in src/i18n/index.ts; qui solo l'identità.
 */
import { activeInstance } from "../lib/instance";

const { branding } = activeInstance();

export const site = {
  name: branding.name,
  tagline: branding.tagline,
  meta: {
    lang: "it",
    ogLocale: "it_IT",
    titlePattern: `%s — ${branding.name}`,
    description: branding.description,
    themeColor: branding.themeColor,
  },
} as const;
