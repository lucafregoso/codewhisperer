import { marked } from "marked";

const renderer = new marked.Renderer();

// Link induriti: i corpi arrivano da Hermes ma restano contenuto esterno.
renderer.link = ({ href, text }) =>
  `<a href="${href}" rel="noopener noreferrer">${text}</a>`;

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
