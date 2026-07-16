import { marked } from "marked";

const renderer = new marked.Renderer();

// Link induriti: i corpi arrivano da Hermes ma restano contenuto esterno.
// parseInline sui token (non il testo raw) preserva l'escaping di marked;
// href sanitizzato contro quote-breakout e schemi non-http.
renderer.link = function ({ href, tokens }) {
  const label = this.parser.parseInline(tokens);
  const safeHref = /^https?:\/\//i.test(href)
    ? href.replaceAll('"', "%22")
    : "#";
  return `<a href="${safeHref}" rel="noopener noreferrer">${label}</a>`;
};

/**
 * Converte markdown inline (bold, corsivi, link) in HTML a build time.
 * Nessun blocco: i corpi delle rassegne sono paragrafi singoli.
 */
export function renderInline(md: string): string {
  return marked.parseInline(md, { renderer }) as string;
}

/** Converte un piccolo blocco multiriga (feed lento) in paragrafi. */
export function renderBlock(md: string): string {
  return md
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${renderInline(paragraph.replace(/\n/g, " "))}</p>`)
    .join("\n");
}
