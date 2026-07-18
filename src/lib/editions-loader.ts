import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import type { Loader } from "astro/loaders";
import { EDITION_DIRS, IMAGES_DIR, PODCAST_DIRS } from "./content-dirs";
import { parseEdition } from "./parser/parse-edition";
import type { RawEdition } from "./parser/types";
import { podcastFileFor } from "./podcast";
import { EditionParseError } from "./parser/types";

/**
 * Loader della collection `editions`: legge le rassegne markdown così
 * come sono (costituzione §1) da tutte le EDITION_DIRS — la lane
 * manuale `input/` e il submodule `input/rassegnai-daily/editions/`.
 * L'id dell'entry è la data ISO estratta dall'H1 — mai dal filename.
 * Un file malformato fa fallire la build indicando file e riga.
 */
export function editionsLoader(): Loader {
  return {
    name: "editions-loader",
    load: async ({ store, parseData, generateDigest, config, logger, watcher }) => {
      const rootUrl = config.root;
      const imagesDir = fileURLToPath(new URL(`./${IMAGES_DIR}/`, rootUrl));

      // Path relative (contratto rassegnai-daily: `images/x.jpg`) →
      // URL del sito `/images/<basename>`; un riferimento rotto è un
      // errore di contratto e rompe la build. Le URL http(s) passano.
      const resolveImage = (
        image: RawEdition["image"],
        sourceLabel: string,
      ): RawEdition["image"] => {
        if (!image) return undefined;
        // Esterne (incluse protocol-relative) passano intatte.
        if (/^(https?:)?\/\//.test(image.url)) return image;
        const basename = image.url.replace(/^\.\//, "").split("/").pop();
        if (!basename) {
          throw new Error(
            `${sourceLabel}: riferimento immagine vuoto o invalido "${image.url}"`,
          );
        }
        if (!existsSync(`${imagesDir}${basename}`)) {
          throw new Error(
            `${sourceLabel}: immagine "${image.url}" non trovata in ${IMAGES_DIR}/`,
          );
        }
        return { ...image, url: `/images/${basename}` };
      };

      const sync = async () => {
        // Il podcast può stare in una qualsiasi PODCAST_DIRS: la
        // prima cartella che matcha il basename vince.
        const podcastFiles: string[] = [];
        for (const dirRel of PODCAST_DIRS) {
          const dir = fileURLToPath(new URL(`./${dirRel}/`, rootUrl));
          const files = await readdir(dir).catch(() => []);
          for (const f of files) {
            if (!podcastFiles.includes(f)) podcastFiles.push(f);
          }
        }

        store.clear();
        const seen = new Map<string, string>();
        let count = 0;

        for (const dirRel of EDITION_DIRS) {
          const dirUrl = new URL(`./${dirRel}/`, rootUrl);
          const dir = fileURLToPath(dirUrl);
          const files = (await readdir(dir).catch(() => []))
            .filter((f) => f.endsWith(".md"))
            .sort();

          for (const file of files) {
            const label = `${dirRel}/${file}`;
            const raw = await readFile(new URL(file, dirUrl), "utf8");
            let edition;
            try {
              edition = parseEdition(raw);
            } catch (error) {
              if (error instanceof EditionParseError) {
                throw new Error(`${label}:${error.line} — ${error.message}`);
              }
              throw error;
            }

            const clash = seen.get(edition.date);
            if (clash) {
              throw new Error(
                `Due edizioni con la stessa data ${edition.date}: "${clash}" e "${label}"`,
              );
            }
            seen.set(edition.date, label);

            const image = resolveImage(edition.image, label);
            const stories = edition.stories.map((s) => {
              const storyImage = resolveImage(s.image, label);
              return {
                ...s,
                ...(storyImage ? { image: storyImage } : {}),
              };
            });

            const podcastFile = podcastFileFor(file, podcastFiles);
            const data = await parseData({
              id: edition.date,
              data: {
                ...edition,
                ...(image ? { image } : {}),
                stories,
                file: label,
                ...(podcastFile ? { podcast: { file: podcastFile } } : {}),
              },
            });
            store.set({
              id: edition.date,
              data,
              digest: generateDigest(raw),
            });
            count += 1;
          }
        }
        logger.info(`Caricate ${count} edizioni da ${EDITION_DIRS.join(", ")}`);
      };

      await sync();
      // In dev, un nuovo drop (rassegna o podcast, in qualsiasi lane)
      // ricarica la collection.
      const watchDirs = [...EDITION_DIRS, ...PODCAST_DIRS].map((d) =>
        fileURLToPath(new URL(`./${d}/`, rootUrl)),
      );
      for (const d of watchDirs) watcher?.add(d);
      watcher?.on("all", (_event, path) => {
        if (
          watchDirs.some((d) => path.startsWith(d)) &&
          (path.endsWith(".md") || path.endsWith(".mp3"))
        ) {
          void sync();
        }
      });
    },
  };
}
