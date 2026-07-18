import { createReadStream } from "node:fs";
import { copyFile, mkdir, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
// NB: import di un modulo TS da un .mjs — regge perché questo file è
// caricato SOLO via astro.config (Vite lo bundla). Non importarlo da
// script Node puri.
import { IMAGES_DIR, PODCAST_DIRS } from "../lib/content-dirs";

const AUDIO_EXT = /\.mp3$/;
const IMAGE_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

/**
 * Gli asset delle edizioni vivono in input/ (fonte di verità,
 * costituzione §1), fuori da public/: questa integrazione fa da
 * ponte. In dev serve `<base>/podcast/*` dalle PODCAST_DIRS e
 * `<base>/images/*` da IMAGES_DIR (Range per il seek audio); alla
 * build copia tutto in dist/podcast/ e dist/images/, così la preview
 * di Playwright e Pages servono lo stesso artefatto.
 * URL pubblici: withBase("/podcast/<file>") e withBase("/images/<file>").
 */
export default function contentAssets() {
  let root;
  let base = "/";

  const imageType = (name) => {
    const dot = name.lastIndexOf(".");
    return dot >= 0 ? IMAGE_TYPES[name.slice(dot).toLowerCase()] : undefined;
  };

  return {
    name: "content-assets",
    hooks: {
      "astro:config:done": ({ config }) => {
        root = config.root;
        base = config.base;
      },

      "astro:server:setup": ({ server }) => {
        const podcastDirs = PODCAST_DIRS.map((d) =>
          fileURLToPath(new URL(`./${d}/`, root)),
        );
        const imagesDir = fileURLToPath(new URL(`./${IMAGES_DIR}/`, root));
        // Il dev server può aver già rimosso il base dal req.url:
        // si accettano entrambe le forme.
        const prefixesFor = (ns) => [
          ...new Set([`/${ns}/`, `${base.replace(/\/$/, "")}/${ns}/`]),
        ];
        const podcastPrefixes = prefixesFor("podcast");
        const imagePrefixes = prefixesFor("images");

        const serveFile = async (res, path, contentType, rangeHeader) => {
          let info;
          try {
            info = await stat(path);
          } catch {
            return false;
          }
          const total = info.size;
          const range = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader || "");
          if (range && (range[1] || range[2])) {
            let start;
            let end;
            if (range[1]) {
              start = Number.parseInt(range[1], 10);
              end = range[2]
                ? Math.min(Number.parseInt(range[2], 10), total - 1)
                : total - 1;
            } else {
              // Suffix range (RFC 9110): "bytes=-N" = ultimi N byte.
              const suffix = Number.parseInt(range[2], 10);
              start = Math.max(total - suffix, 0);
              end = total - 1;
            }
            if (start >= total || start > end) {
              res.writeHead(416, { "Content-Range": `bytes */${total}` });
              res.end();
              return true;
            }
            res.writeHead(206, {
              "Content-Type": contentType,
              "Accept-Ranges": "bytes",
              "Content-Range": `bytes ${start}-${end}/${total}`,
              "Content-Length": end - start + 1,
            });
            createReadStream(path, { start, end }).pipe(res);
            return true;
          }
          res.writeHead(200, {
            "Content-Type": contentType,
            "Accept-Ranges": "bytes",
            "Content-Length": total,
          });
          createReadStream(path).pipe(res);
          return true;
        };

        const decodeName = (url, prefix) => {
          let name;
          try {
            name = decodeURIComponent(url.slice(prefix.length));
          } catch {
            return undefined; // percent-encoding malformato
          }
          if (name.includes("/") || name.includes("..")) return undefined;
          return name;
        };

        const serveContent = async (req, res, next) => {
          const url = (req.url || "").split("?")[0];

          const podcastPrefix = podcastPrefixes.find((p) => url.startsWith(p));
          if (podcastPrefix && AUDIO_EXT.test(url)) {
            const name = decodeName(url, podcastPrefix);
            if (name) {
              for (const dir of podcastDirs) {
                if (await serveFile(res, join(dir, name), "audio/mpeg", req.headers.range)) {
                  return;
                }
              }
            }
            return next();
          }

          const imagePrefix = imagePrefixes.find((p) => url.startsWith(p));
          if (imagePrefix) {
            const name = decodeName(url, imagePrefix);
            const type = name && imageType(name);
            if (
              type &&
              (await serveFile(res, join(imagesDir, name), type, req.headers.range))
            ) {
              return;
            }
            return next();
          }

          return next();
        };

        // In testa allo stack: il catch-all SSR di Astro risponde 404
        // a qualunque path non instradato, quindi registrare in coda
        // non funzionerebbe.
        server.middlewares.use(serveContent);
        const entry = server.middlewares.stack.pop();
        server.middlewares.stack.unshift(entry);
      },

      "astro:build:done": async ({ dir }) => {
        const out = fileURLToPath(dir);

        // Podcast: unione delle PODCAST_DIRS, la prima occorrenza vince.
        const copied = new Set();
        for (const dirRel of PODCAST_DIRS) {
          const src = fileURLToPath(new URL(`./${dirRel}/`, root));
          const files = (await readdir(src).catch(() => [])).filter((f) =>
            AUDIO_EXT.test(f),
          );
          if (files.length === 0) continue;
          await mkdir(join(out, "podcast"), { recursive: true });
          for (const f of files) {
            if (copied.has(f)) continue;
            copied.add(f);
            await copyFile(join(src, f), join(out, "podcast", f));
          }
        }

        const imagesSrc = fileURLToPath(new URL(`./${IMAGES_DIR}/`, root));
        const images = (await readdir(imagesSrc).catch(() => [])).filter(
          (f) => imageType(f),
        );
        if (images.length > 0) {
          await mkdir(join(out, "images"), { recursive: true });
          await Promise.all(
            images.map((f) =>
              copyFile(join(imagesSrc, f), join(out, "images", f)),
            ),
          );
        }
      },
    },
  };
}
