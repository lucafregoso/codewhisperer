/**
 * Identità del sito — unica fonte di verità per nome, tagline e meta.
 * Le stringhe UI vivono in src/i18n/index.ts; qui solo l'identità.
 */
export const site = {
  name: "CodeWhisperer",
  tagline: "La rassegna tech quotidiana, impaginata.",
  meta: {
    lang: "it",
    ogLocale: "it_IT",
    titlePattern: "%s — CodeWhisperer",
    description:
      "CodeWhisperer impagina ogni giorno la rassegna tech di Hermes: " +
      "le storie in primo piano, il radar e il feed lento, con filtri per " +
      "fonte e categoria.",
    themeColor: "#111111",
  },
} as const;
