import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import type { Loader } from "astro/loaders";
import { parseEdition } from "./parser/parse-edition";
import { podcastFileFor } from "./podcast";
import { EditionParseError } from "./parser/types";

/**
 * Loader della collection `editions`: legge le rassegne markdown di Hermes
 * da input/ così come sono (costituzione §1). L'id dell'entry è la data
 * ISO estratta dall'H1 — mai dal filename. Un file malformato fa fallire
 * la build indicando file e riga.
 */
export function editionsLoader(): Loader {
  return {
    name: "editions-loader",
    load: async ({ store, parseData, generateDigest, config, logger, watcher }) => {
      const dirUrl = new URL("./input/", config.root);
      const dir = fileURLToPath(dirUrl);

      const podcastDirUrl = new URL("./podcast/", dirUrl);
      const podcastDir = fileURLToPath(podcastDirUrl);

      const sync = async () => {
        const files = (await readdir(dir)).filter((f) => f.endsWith(".md"));
        // L'audio dell'edizione è opzionale: input/podcast/ può non esserci.
        const podcastFiles = await readdir(podcastDir).catch(() => []);
        store.clear();
        const seen = new Map<string, string>();

        for (const file of files.sort()) {
          const raw = await readFile(new URL(file, dirUrl), "utf8");
          let edition;
          try {
            edition = parseEdition(raw);
          } catch (error) {
            if (error instanceof EditionParseError) {
              throw new Error(
                `input/${file}:${error.line} — ${error.message}`,
              );
            }
            throw error;
          }

          const clash = seen.get(edition.date);
          if (clash) {
            throw new Error(
              `Due edizioni con la stessa data ${edition.date}: "${clash}" e "${file}"`,
            );
          }
          seen.set(edition.date, file);

          const podcastFile = podcastFileFor(file, podcastFiles);
          const data = await parseData({
            id: edition.date,
            data: {
              ...edition,
              file,
              ...(podcastFile ? { podcast: { file: podcastFile } } : {}),
            },
          });
          store.set({
            id: edition.date,
            data,
            digest: generateDigest(raw),
          });
        }
        logger.info(`Caricate ${files.length} edizioni da input/`);
      };

      await sync();
      // In dev, un nuovo drop in input/ (rassegna o podcast) ricarica
      // la collection.
      watcher?.add(dir);
      watcher?.add(podcastDir);
      watcher?.on("all", (_event, path) => {
        if (
          path.startsWith(dir) &&
          (path.endsWith(".md") || path.endsWith(".mp3"))
        ) {
          void sync();
        }
      });
    },
  };
}
