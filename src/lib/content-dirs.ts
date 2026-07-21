/**
 * Le sorgenti di contenuto, relative alla radice del repo. Modulo
 * condiviso da loader, integrazione asset e helper dei test: MAI
 * hardcodare queste path altrove (spec 013).
 *
 * Dalla spec 014 le path derivano dall'istanza attiva (registry
 * src/data/instances.json, env INSTANCE). Due lane:
 * - `input/` — drop manuali (publish-edition.sh, emergenze): SOLO per
 *   l'istanza default — con N istanze un drop in input/ sarebbe
 *   ambiguo (a quale magazine apparterrebbe?);
 * - `<contentDir>/` — submodule git alimentato dall'ambiente di
 *   generazione esterno; `editions/` è la sorgente canonica.
 * Le directory assenti vengono ignorate: il sito si costruisce anche
 * senza submodule inizializzato.
 */
import { activeInstance, isDefaultInstance, type Instance } from "./instance";

export interface ContentDirs {
  editionDirs: string[];
  podcastDirs: string[];
  imagesDir: string;
}

/**
 * Derivatore PURO (seam per i test, istanza come parametro).
 * Ordine = priorità: nelle liste la prima cartella che matcha vince,
 * quindi per la default la lane manuale sta davanti al submodule.
 */
export function deriveContentDirs(
  instance: Instance,
  isDefault: boolean,
): ContentDirs {
  const editions = `${instance.contentDir}/editions`;
  return {
    editionDirs: isDefault ? ["input", editions] : [editions],
    podcastDirs: isDefault
      ? ["input/podcast", `${editions}/podcast`]
      : [`${editions}/podcast`],
    imagesDir: `${editions}/images`,
  };
}

const active = activeInstance();
const derived = deriveContentDirs(active, isDefaultInstance(active));

export const EDITION_DIRS = derived.editionDirs;

/** Ordine = priorità: la prima cartella che matcha il basename vince. */
export const PODCAST_DIRS = derived.podcastDirs;

export const IMAGES_DIR = derived.imagesDir;
