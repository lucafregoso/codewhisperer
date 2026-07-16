const base = import.meta.env.BASE_URL;

/**
 * Prefissa un path assoluto interno con il base path configurato
 * (obbligatorio per GitHub Pages in sottocartella — costituzione §6).
 */
export function withBase(path: string): string {
  const clean = path.startsWith("/") ? path.slice(1) : path;
  const prefix = base.endsWith("/") ? base : `${base}/`;
  return `${prefix}${clean}`;
}
