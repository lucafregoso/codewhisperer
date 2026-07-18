import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  EDITION_DIRS,
  PODCAST_DIRS,
} from "../../src/lib/content-dirs";
import { parseEdition } from "../../src/lib/parser/parse-edition";
import { podcastFileFor } from "../../src/lib/podcast";

const ROOT = process.cwd();

const listDir = (rel: string): string[] => {
  try {
    return readdirSync(join(ROOT, rel));
  } catch {
    return [];
  }
};

/** I file .md del corpus con la loro lane, nell'ordine delle EDITION_DIRS. */
function corpusFiles(): { dir: string; file: string }[] {
  return EDITION_DIRS.flatMap((dir) =>
    listDir(dir)
      .filter((f) => f.endsWith(".md"))
      .map((file) => ({ dir, file })),
  );
}

/**
 * Il corpus reale, parsato e ordinato per data ascendente: l'ultima voce
 * è l'edizione che la homepage deve mostrare. I test e2e che dipendono
 * da "qual è l'ultima edizione" derivano SEMPRE da qui, mai da valori
 * fissi: il corpus è dinamico (lane manuale + submodule rassegnai-daily,
 * vedi src/lib/content-dirs.ts).
 */
export function corpusEditions() {
  return corpusFiles()
    .map(({ dir, file }) =>
      parseEdition(readFileSync(join(ROOT, dir, file), "utf8")),
    )
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Date ISO del corpus, ascendenti. */
export function corpusDates(): string[] {
  return corpusEditions().map((e) => e.date);
}

/**
 * Le storie del corpus che portano un'immagine (markdown `![…](…)` o
 * riga **Immagine:**). Vuoto se nessuna: i test di presenza fanno
 * skip, quelli di assenza girano.
 */
export function corpusImages(): { date: string; slug: string }[] {
  return corpusEditions().flatMap((e) =>
    e.stories
      .filter((s) => s.image)
      .map((s) => ({ date: e.date, slug: s.slug })),
  );
}

/** Le edizioni con immagine di copertina (preambolo). */
export function corpusCovers(): string[] {
  return corpusEditions()
    .filter((e) => e.image)
    .map((e) => e.date);
}

/**
 * Le coppie edizione↔podcast presenti nel corpus (matching identico al
 * loader: stesso basename, estensione .mp3, su tutte le PODCAST_DIRS).
 * Vuoto se non combacia nulla: i test che ne dipendono fanno skip.
 */
export function corpusPodcasts(): { date: string; file: string }[] {
  const mp3s = [...new Set(PODCAST_DIRS.flatMap((dir) => listDir(dir)))];
  return corpusFiles().flatMap(({ dir, file }) => {
    const match = podcastFileFor(file, mp3s);
    if (!match) return [];
    const date = parseEdition(
      readFileSync(join(ROOT, dir, file), "utf8"),
    ).date;
    return [{ date, file: match }];
  });
}
