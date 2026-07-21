/**
 * Selezione dell'istanza attiva (spec 014 — istanze EdicolAI).
 *
 * Il registry versionato è `src/data/instances.json` (JSON, non TS:
 * lo leggono anche astro.config.mjs e il loop di deploy senza
 * transpile). Questo modulo NON ha dipendenze Astro: è importabile da
 * loader, integrazioni `.mjs`, helper dei test e Vitest.
 *
 * Contratto slug (docs/INGESTION.md):
 *   profilo Hermes <slug> → repo <slug>-daily → submodule
 *   input/<slug>-daily → magazine su /codewhisperer/<slug>/
 * L'istanza storica `rassegnai` codifica l'eccezione root nel proprio
 * `basePath`: nessun caso speciale nel codice.
 */
import registry from "../data/instances.json";

export interface InstanceBranding {
  name: string;
  tagline: string;
  description: string;
  themeColor: string;
}

export interface Instance {
  slug: string;
  contentDir: string;
  basePath: string;
  branding: InstanceBranding;
}

export interface InstanceRegistry {
  default: string;
  instances: Instance[];
}

/**
 * Resolver PURO: il registry arriva come parametro (seam per i test,
 * che usano registry fittizi senza toccare instances.json). Slug
 * assente o vuoto → istanza `default` del registry; slug sconosciuto
 * → errore che nomina lo slug richiesto ED elenca quelli validi
 * (fail fast, prima di qualsiasi parse).
 */
export function resolveInstance(
  slug: string | undefined,
  reg: InstanceRegistry,
): Instance {
  const requested = slug || reg.default;
  const found = reg.instances.find((i) => i.slug === requested);
  if (!found) {
    const valid = reg.instances.map((i) => i.slug).join(", ");
    throw new Error(
      `Istanza sconosciuta "${requested}" (env INSTANCE): ` +
        `slug validi: ${valid}`,
    );
  }
  return found;
}

/** Il resolver applicato a `process.env.INSTANCE` sul registry vero. */
export function activeInstance(): Instance {
  return resolveInstance(process.env.INSTANCE, registry);
}

/** True se l'istanza è quella `default` del registry vero. */
export function isDefaultInstance(instance: Instance): boolean {
  return instance.slug === registry.default;
}
