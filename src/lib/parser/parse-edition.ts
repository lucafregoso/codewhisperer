import { parseItalianDate } from "./italian-date.ts";
import { slugify } from "./slug.ts";
import { parseSourceEntry, parseSourcesLine } from "./sources.ts";
import {
  EditionParseError,
  type Coverage,
  type RadarItem,
  type RawEdition,
  type SlowFeed,
  type Story,
} from "./types.ts";

/** Sezioni riconosciute per keyword: le emoji negli H2 possono variare. */
type SectionKey = "lead" | "radar" | "slowFeed" | "coverage";

const SECTION_KEYWORDS: Array<[SectionKey, RegExp]> = [
  ["lead", /in primo piano/i],
  ["radar", /radar/i],
  ["slowFeed", /dal feed lento/i],
  ["coverage", /nota di copertura/i],
];

interface Line {
  text: string;
  /** 1-based nel file sorgente */
  number: number;
}

function sectionOf(heading: string): SectionKey | null {
  for (const [key, pattern] of SECTION_KEYWORDS) {
    if (pattern.test(heading)) return key;
  }
  return null;
}

function parseCategories(raw: string): string[] {
  return raw
    .split(",")
    .map((c) => slugify(c))
    .filter(Boolean);
}

const CATEGORIE_LINE = /^\s*\*\*Categorie:\*\*\s*(.+)$/i;
const FONTI_LINE = /^\s*\*\*Fonti:\*\*/i;
// Riservata al contratto futuro (INGESTION.md §Immagini): oggi si
// ignora senza errori, così Hermes può emetterla in anticipo.
const IMMAGINE_LINE = /^\s*\*\*Immagine:\*\*/i;
const RADAR_CAT_SUFFIX = /\s*\[cat:\s*([^\]]+)\]\s*$/i;
const TRAILING_SOURCE = /\s+[—–]\s+(\[[^\]]+\]\([^)\s]+\))\s*$/;

function parseStories(lines: Line[]): Story[] {
  const stories: Story[] = [];
  let current: {
    position: number;
    title: string;
    titleLine: number;
    body: string[];
    sources?: Story["sources"];
    categories: string[];
  } | null = null;

  const flush = () => {
    if (!current) return;
    if (!current.sources) {
      throw new EditionParseError(
        `La storia "${current.title}" non ha una riga **Fonti:** (riga ${current.titleLine})`,
        current.titleLine,
      );
    }
    stories.push({
      position: current.position,
      slug: slugify(current.title),
      title: current.title,
      body: current.body.join("\n").trim(),
      categories: current.categories,
      sources: current.sources,
    });
    current = null;
  };

  for (const line of lines) {
    const heading = line.text.match(/^###\s+(\d+)\.\s+(.+)$/);
    if (heading) {
      flush();
      current = {
        position: Number(heading[1]),
        title: heading[2]!.trim(),
        titleLine: line.number,
        body: [],
        categories: [],
      };
      continue;
    }
    if (!current) continue;
    if (FONTI_LINE.test(line.text)) {
      current.sources = parseSourcesLine(line.text, line.number);
      continue;
    }
    const categorie = line.text.match(CATEGORIE_LINE);
    if (categorie) {
      current.categories = parseCategories(categorie[1]!);
      continue;
    }
    if (IMMAGINE_LINE.test(line.text)) {
      continue;
    }
    current.body.push(line.text);
  }
  flush();
  return stories;
}

function parseRadar(lines: Line[]): RadarItem[] {
  const items: RadarItem[] = [];
  for (const line of lines) {
    const bullet = line.text.match(/^\s*[-*]\s+(.+)$/);
    if (!bullet) continue;
    let text = bullet[1]!.trim();

    let categories: string[] = [];
    const catMatch = text.match(RADAR_CAT_SUFFIX);
    if (catMatch) {
      categories = parseCategories(catMatch[1]!);
      text = text.replace(RADAR_CAT_SUFFIX, "").trim();
    }

    const sourceMatch = text.match(TRAILING_SOURCE);
    if (!sourceMatch) {
      throw new EditionParseError(
        `Radar item senza link fonte finale "— [Fonte](url)" (riga ${line.number})`,
        line.number,
      );
    }
    const source = parseSourceEntry(sourceMatch[1]!);
    if (!source) {
      throw new EditionParseError(
        `Link fonte del radar illeggibile (riga ${line.number})`,
        line.number,
      );
    }
    items.push({
      text: text.replace(TRAILING_SOURCE, "").trim(),
      categories,
      source,
    });
  }
  return items;
}

function parseSlowFeed(lines: Line[]): SlowFeed | undefined {
  const paragraph = lines
    .map((l) => l.text)
    .join("\n")
    .trim();
  if (!paragraph) return undefined;
  const firstLine = lines.find((l) => l.text.trim().length > 0);
  const lineNumber = firstLine?.number ?? 1;

  let categories: string[] = [];
  let text = paragraph;
  const catLine = text.match(CATEGORIE_LINE_MULTI);
  if (catLine) {
    categories = parseCategories(catLine[1]!);
    text = text.replace(CATEGORIE_LINE_MULTI, "").trim();
  }

  const titleMatch = text.match(/^\*\*[""]?(.+?)[""]?\*\*\s*/);
  if (!titleMatch) {
    throw new EditionParseError(
      `Feed lento senza titolo **"…"** (riga ${lineNumber})`,
      lineNumber,
    );
  }
  const title = titleMatch[1]!.replace(/^"|"$/g, "").trim();
  let rest = text.slice(titleMatch[0].length).trim();

  let author: string | undefined;
  const authorMatch = rest.match(/^di\s+([^.]+)\.\s*/);
  if (authorMatch) {
    author = authorMatch[1]!.trim();
    rest = rest.slice(authorMatch[0].length).trim();
  }

  const sourceMatch = rest.match(TRAILING_SOURCE);
  if (!sourceMatch) {
    throw new EditionParseError(
      `Feed lento senza link fonte finale (riga ${lineNumber})`,
      lineNumber,
    );
  }
  const source = parseSourceEntry(sourceMatch[1]!);
  if (!source) {
    throw new EditionParseError(
      `Link fonte del feed lento illeggibile (riga ${lineNumber})`,
      lineNumber,
    );
  }

  return {
    title,
    ...(author ? { author } : {}),
    body: rest.replace(TRAILING_SOURCE, "").trim(),
    source,
    categories,
  };
}

const CATEGORIE_LINE_MULTI = /^\s*\*\*Categorie:\*\*\s*(.+)$/im;

function parseCoverage(lines: Line[]): Coverage | undefined {
  const text = lines.map((l) => l.text).join("\n").trim();
  if (!text) return undefined;
  const firstLine = lines.find((l) => l.text.trim().length > 0);
  const lineNumber = firstLine?.number ?? 1;

  const readMatch = text.match(/Fonti lette:\s*(\d+)\s*\/\s*(\d+)/i);
  const collectedMatch = text.match(
    /Item raccolti:\s*(\d+);\s*storie pubblicate:\s*(\d+);\s*scartati di proposito:\s*(\d+)/i,
  );
  if (!readMatch || !collectedMatch) {
    throw new EditionParseError(
      `Nota di copertura presente ma illeggibile (riga ${lineNumber})`,
      lineNumber,
    );
  }

  const unreachableMatch = text.match(/Irraggiungibili:\s*([^\n]+)/i);
  const unreachable = unreachableMatch
    ? unreachableMatch[1]!
        .replace(/\.\s*$/, "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const taglineMatch = text.match(/^Se non è qui.*$/im);

  return {
    sourcesRead: Number(readMatch[1]),
    sourcesTotal: Number(readMatch[2]),
    unreachable,
    itemsCollected: Number(collectedMatch[1]),
    itemsPublished: Number(collectedMatch[2]),
    itemsDiscarded: Number(collectedMatch[3]),
    ...(taglineMatch ? { tagline: taglineMatch[0].trim() } : {}),
  };
}

/**
 * Parsa una rassegna RubricAI completa. Lancia EditionParseError con la
 * riga incriminata su qualsiasi struttura inattesa: la build deve fallire,
 * mai pubblicare un'edizione parziale (costituzione §1).
 */
export function parseEdition(raw: string): RawEdition {
  const lines: Line[] = raw
    .split("\n")
    .map((text, index) => ({ text, number: index + 1 }));

  const h1 = lines.find((l) => /^#\s+/.test(l.text));
  if (!h1) {
    throw new EditionParseError("Manca l'H1 della testata", 1);
  }
  const h1Match = h1.text.match(/^#\s+(.+?)\s+—\s+Edizione del\s+(.+)$/i);
  if (!h1Match) {
    throw new EditionParseError(
      `H1 non nel formato "# Testata — Edizione del <data>" (riga ${h1.number})`,
      h1.number,
    );
  }
  let date: string;
  try {
    date = parseItalianDate(h1Match[2]!);
  } catch (error) {
    throw new EditionParseError(
      `${(error as Error).message} (riga ${h1.number})`,
      h1.number,
    );
  }

  const tldrLines = lines
    .filter((l) => /^>\s?/.test(l.text))
    .map((l) => l.text.replace(/^>\s?/, "").trim());

  // Raggruppa le righe per sezione H2.
  const sections = new Map<SectionKey, Line[]>();
  let currentSection: SectionKey | null = null;
  for (const line of lines) {
    const h2 = line.text.match(/^##\s+(.+)$/);
    if (h2) {
      currentSection = sectionOf(h2[1]!);
      if (currentSection && !sections.has(currentSection)) {
        sections.set(currentSection, []);
      }
      continue;
    }
    if (currentSection) {
      sections.get(currentSection)!.push(line);
    }
  }

  const leadLines = sections.get("lead");
  if (!leadLines) {
    throw new EditionParseError('Manca la sezione "In primo piano"', h1.number);
  }
  const stories = parseStories(leadLines);
  if (stories.length === 0) {
    throw new EditionParseError(
      'La sezione "In primo piano" non contiene storie',
      h1.number,
    );
  }

  const slowFeed = parseSlowFeed(sections.get("slowFeed") ?? []);
  const coverage = parseCoverage(sections.get("coverage") ?? []);

  return {
    date,
    masthead: h1Match[1]!.trim(),
    tldr: tldrLines.join(" ").trim(),
    stories,
    radar: parseRadar(sections.get("radar") ?? []),
    ...(slowFeed ? { slowFeed } : {}),
    ...(coverage ? { coverage } : {}),
  };
}
