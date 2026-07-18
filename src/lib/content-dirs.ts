/**
 * Le sorgenti di contenuto, relative alla radice del repo. Modulo
 * condiviso da loader, integrazione asset e helper dei test: MAI
 * hardcodare queste path altrove (spec 013).
 *
 * Due lane:
 * - `input/` — drop manuali (publish-edition.sh, emergenze);
 * - `input/rassegnai-daily/` — submodule git alimentato dall'ambiente
 *   di generazione esterno; `editions/` è la sorgente canonica.
 * Le directory assenti vengono ignorate: il sito si costruisce anche
 * senza submodule inizializzato.
 */

export const EDITION_DIRS = ["input", "input/rassegnai-daily/editions"];

/** Ordine = priorità: la prima cartella che matcha il basename vince. */
export const PODCAST_DIRS = [
  "input/podcast",
  "input/rassegnai-daily/editions/podcast",
];

export const IMAGES_DIR = "input/rassegnai-daily/editions/images";
