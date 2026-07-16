#!/usr/bin/env node
/**
 * Valida una rassegna RubricAI col parser reale del sito (node 24 esegue
 * i .ts nativamente). Uso: node scripts/validate-edition.mjs <file.md>
 * Exit 0 = valida (stampa la data ISO); exit 1 = errore con file:riga.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const file = process.argv[2];
if (!file) {
  console.error("Uso: node scripts/validate-edition.mjs <file.md>");
  process.exit(2);
}

const parserUrl = pathToFileURL(
  resolve(import.meta.dirname, "../src/lib/parser/parse-edition.ts"),
);
const { parseEdition } = await import(parserUrl.href);

try {
  const edition = parseEdition(readFileSync(resolve(file), "utf8"));
  console.log(
    `${edition.date} — ${edition.stories.length} storie, ` +
      `${edition.radar.length} radar${edition.slowFeed ? ", feed lento" : ""}`,
  );
} catch (error) {
  const line = error?.line ? `:${error.line}` : "";
  console.error(`${file}${line} — ${error.message}`);
  process.exit(1);
}
