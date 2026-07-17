import { createReadStream } from "node:fs";
import { copyFile, mkdir, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Gli mp3 delle edizioni vivono in input/podcast/ (input/ è la fonte di
 * verità, costituzione §1), fuori da public/: questa integrazione fa da
 * ponte. In dev serve `<base>/podcast/*.mp3` direttamente da
 * input/podcast/ (con supporto Range per il seek); alla build copia i
 * file in dist/podcast/, così preview di Playwright e Pages servono lo
 * stesso artefatto. URL pubblico: withBase("/podcast/<file>").
 */
export default function podcastAssets() {
  let root;
  let base = "/";

  return {
    name: "podcast-assets",
    hooks: {
      "astro:config:done": ({ config }) => {
        root = config.root;
        base = config.base;
      },

      "astro:server:setup": ({ server }) => {
        const dir = fileURLToPath(new URL("./input/podcast/", root));
        // Il dev server di Astro/Vite può aver già rimosso il base dal
        // req.url: si accettano entrambe le forme.
        const prefixes = [
          ...new Set(["/podcast/", `${base.replace(/\/$/, "")}/podcast/`]),
        ];

        const serveMp3 = async (req, res, next) => {
          const url = (req.url || "").split("?")[0];
          const prefix = prefixes.find((p) => url.startsWith(p));
          if (!prefix || !url.endsWith(".mp3")) {
            return next();
          }
          let name;
          try {
            name = decodeURIComponent(url.slice(prefix.length));
          } catch {
            return next(); // percent-encoding malformato: non è roba nostra
          }
          if (name.includes("/") || name.includes("..")) {
            return next();
          }
          const path = join(dir, name);
          let info;
          try {
            info = await stat(path);
          } catch {
            return next();
          }

          const total = info.size;
          const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || "");
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
              return;
            }
            res.writeHead(206, {
              "Content-Type": "audio/mpeg",
              "Accept-Ranges": "bytes",
              "Content-Range": `bytes ${start}-${end}/${total}`,
              "Content-Length": end - start + 1,
            });
            createReadStream(path, { start, end }).pipe(res);
            return;
          }

          res.writeHead(200, {
            "Content-Type": "audio/mpeg",
            "Accept-Ranges": "bytes",
            "Content-Length": total,
          });
          createReadStream(path).pipe(res);
        };

        // In testa allo stack: il catch-all SSR di Astro risponde 404
        // a qualunque path non instradato, quindi registrare in coda
        // non funzionerebbe.
        server.middlewares.use(serveMp3);
        const entry = server.middlewares.stack.pop();
        server.middlewares.stack.unshift(entry);
      },

      "astro:build:done": async ({ dir }) => {
        const src = fileURLToPath(new URL("./input/podcast/", root));
        const out = join(fileURLToPath(dir), "podcast");
        let files;
        try {
          files = (await readdir(src)).filter((f) => f.endsWith(".mp3"));
        } catch {
          return; // input/podcast/ assente: nessun podcast, nessuna copia
        }
        if (files.length === 0) return;
        await mkdir(out, { recursive: true });
        await Promise.all(
          files.map((f) => copyFile(join(src, f), join(out, f))),
        );
      },
    },
  };
}
