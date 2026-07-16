const FULL = new Intl.DateTimeFormat("it-IT", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Rome",
});

const MONTH_YEAR = new Intl.DateTimeFormat("it-IT", {
  month: "long",
  year: "numeric",
  timeZone: "Europe/Rome",
});

/** "16 luglio 2026" */
export function formatFullDate(date: Date): string {
  return FULL.format(date);
}

/** "luglio 2026" — per i raggruppamenti d'archivio */
export function formatMonthYear(date: Date): string {
  return MONTH_YEAR.format(date);
}

/** "2026-07-16" — id/permalink */
export function toIsoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}
