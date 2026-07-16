import { describe, expect, it } from "vitest";
import { parseItalianDate } from "../../src/lib/parser/italian-date";

describe("parseItalianDate", () => {
  it.each([
    ["1 gennaio 2026", "2026-01-01"],
    ["14 febbraio 2026", "2026-02-14"],
    ["3 marzo 2026", "2026-03-03"],
    ["30 aprile 2026", "2026-04-30"],
    ["9 maggio 2026", "2026-05-09"],
    ["21 giugno 2026", "2026-06-21"],
    ["16 luglio 2026", "2026-07-16"],
    ["8 agosto 2026", "2026-08-08"],
    ["30 settembre 2026", "2026-09-30"],
    ["31 ottobre 2026", "2026-10-31"],
    ["11 novembre 2026", "2026-11-11"],
    ["25 dicembre 2026", "2026-12-25"],
  ])("converte %s in %s", (input, iso) => {
    expect(parseItalianDate(input)).toBe(iso);
  });

  it("gestisce il primo del mese ordinale (1º/1°)", () => {
    expect(parseItalianDate("1º luglio 2026")).toBe("2026-07-01");
    expect(parseItalianDate("1° luglio 2026")).toBe("2026-07-01");
  });

  it("è case-insensitive sul mese", () => {
    expect(parseItalianDate("16 Luglio 2026")).toBe("2026-07-16");
  });

  it("rifiuta mesi sconosciuti", () => {
    expect(() => parseItalianDate("16 smarch 2026")).toThrow();
  });

  it("rifiuta giorni impossibili", () => {
    expect(() => parseItalianDate("32 luglio 2026")).toThrow();
    expect(() => parseItalianDate("31 novembre 2026")).toThrow();
  });
});
