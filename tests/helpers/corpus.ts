import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseEdition } from "../../src/lib/parser/parse-edition";
import { podcastFileFor } from "../../src/lib/podcast";

const INPUT = join(process.cwd(), "input");

/**
 * Il corpus reale, parsato e ordinato per data ascendente: l'ultima voce è
 * l'edizione che la homepage deve mostrare. I test e2e che dipendono da
 * "qual è l'ultima edizione" derivano SEMPRE da qui, mai da valori fissi:
 * il corpus cresce di un'edizione al giorno (vedi tests/unit/parse-edition).
 */
export function corpusEditions() {
  return readdirSync(INPUT)
    .filter((f) => f.endsWith(".md"))
    .map((f) => parseEdition(readFileSync(join(INPUT, f), "utf8")))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Date ISO del corpus, ascendenti. */
export function corpusDates(): string[] {
  return corpusEditions().map((e) => e.date);
}

/**
 * Le coppie edizione↔podcast presenti nel corpus (matching identico al
 * loader: stesso basename, estensione .mp3). Vuoto se input/podcast/
 * non esiste o non combacia nulla: i test che ne dipendono fanno skip.
 */
export function corpusPodcasts(): { date: string; file: string }[] {
  let mp3s: string[] = [];
  try {
    mp3s = readdirSync(join(INPUT, "podcast"));
  } catch {
    return [];
  }
  return readdirSync(INPUT)
    .filter((f) => f.endsWith(".md"))
    .flatMap((f) => {
      const match = podcastFileFor(f, mp3s);
      if (!match) return [];
      const date = parseEdition(readFileSync(join(INPUT, f), "utf8")).date;
      return [{ date, file: match }];
    });
}
