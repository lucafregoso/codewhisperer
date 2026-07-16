const MONTHS: Record<string, number> = {
  gennaio: 1,
  febbraio: 2,
  marzo: 3,
  aprile: 4,
  maggio: 5,
  giugno: 6,
  luglio: 7,
  agosto: 8,
  settembre: 9,
  ottobre: 10,
  novembre: 11,
  dicembre: 12,
};

/**
 * Converte una data italiana in prosa ("16 luglio 2026", "1º luglio 2026")
 * in ISO "2026-07-16". Lancia su mese sconosciuto o giorno impossibile.
 */
export function parseItalianDate(text: string): string {
  const match = text
    .trim()
    .match(/^(\d{1,2})[º°]?\s+([a-zà-ù]+)\s+(\d{4})$/i);
  if (!match) {
    throw new Error(`Data italiana non riconosciuta: "${text}"`);
  }
  const day = Number(match[1]);
  const monthName = match[2]!.toLowerCase();
  const year = Number(match[3]);
  const month = MONTHS[monthName];
  if (!month) {
    throw new Error(`Mese italiano sconosciuto: "${monthName}"`);
  }
  // Il costruttore UTC non fa rollover-check: valida per confronto.
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error(`Giorno impossibile: "${text}"`);
  }
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}
