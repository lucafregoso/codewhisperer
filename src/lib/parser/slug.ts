/**
 * Slug stabile e deterministico per anchor di storia e slug di fonte:
 * minuscole, accenti rimossi, tutto il resto compresso in trattini.
 */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
