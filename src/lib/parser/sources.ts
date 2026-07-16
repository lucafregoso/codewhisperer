import {
  AGGREGATOR_HOSTS,
  AGGREGATOR_SLUGS,
  SOURCE_ALIASES,
} from "../../data/source-aliases";
import { slugify } from "./slug";
import { EditionParseError, type SourceRef } from "./types";

function canonicalSlug(label: string): string {
  return SOURCE_ALIASES[label.trim().toLowerCase()] ?? slugify(label);
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

/**
 * Risolve una label di fonte (con eventuale pattern "A (B)") e la sua URL
 * in {name, slug, via?}. L'aggregatore — riconosciuto dallo slug o
 * dall'host del link — è sempre `via`, in entrambi gli ordini della label.
 */
export function parseSourceLink(label: string, url: string): SourceRef {
  const parenMatch = label.trim().match(/^(.+?)\s*\((.+)\)$/);
  if (parenMatch) {
    const outer = parenMatch[1]!.trim();
    const inner = parenMatch[2]!.trim();
    const outerSlug = canonicalSlug(outer);
    const innerSlug = canonicalSlug(inner);
    const hostSlug = AGGREGATOR_HOSTS[hostOf(url)];

    const outerIsAggregator =
      AGGREGATOR_SLUGS.has(outerSlug) || hostSlug === outerSlug;
    const innerIsAggregator =
      AGGREGATOR_SLUGS.has(innerSlug) || hostSlug === innerSlug;

    if (outerIsAggregator && !innerIsAggregator) {
      return {
        name: inner,
        slug: innerSlug,
        via: { name: outer, slug: outerSlug },
        url,
      };
    }
    if (innerIsAggregator && !outerIsAggregator) {
      return {
        name: outer,
        slug: outerSlug,
        via: { name: inner, slug: innerSlug },
        url,
      };
    }
    // Nessuno dei due (o entrambi) è un aggregatore: la label esterna è la
    // testata, quella interna resta comunque un'attribuzione via.
    return {
      name: outer,
      slug: outerSlug,
      via: { name: inner, slug: innerSlug },
      url,
    };
  }

  return { name: label.trim(), slug: canonicalSlug(label), url };
}

const LINK_PATTERN = /\[([^\]]+)\]\(([^)\s]+)\)/;

/**
 * Parsa una singola voce "[Label](url) — nota" in SourceRef.
 * Ritorna null se la voce non contiene un link markdown.
 */
export function parseSourceEntry(entry: string): SourceRef | null {
  const match = entry.match(LINK_PATTERN);
  if (!match) return null;
  const ref = parseSourceLink(match[1]!, match[2]!);
  const after = entry.slice((match.index ?? 0) + match[0].length);
  const note = after.replace(/^\s*[—–-]\s*/, "").replace(/[.;\s]+$/, "").trim();
  if (note) ref.note = note;
  return ref;
}

/**
 * Parsa l'intera riga "**Fonti:** [A](u) — nota; [B](u) — nota."
 * `line` è la riga 1-based nel file, usata per l'errore.
 */
export function parseSourcesLine(raw: string, line: number): SourceRef[] {
  const body = raw.replace(/^\s*\*\*Fonti:\*\*\s*/i, "");
  const refs = body
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => parseSourceEntry(entry))
    .filter((ref): ref is SourceRef => ref !== null);
  if (refs.length === 0) {
    throw new EditionParseError(
      `Riga Fonti senza alcun link markdown valido (riga ${line})`,
      line,
    );
  }
  return refs;
}
