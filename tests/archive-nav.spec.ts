import { test, expect } from "@playwright/test";
import { t } from "../src/i18n";
import { formatMonthYear } from "../src/lib/dates";
import { corpusDates } from "./helpers/corpus";

// Il corpus è dinamico (lo popolano gli scraper): conteggi, date e mesi
// arrivano da input/ al momento del run, mai da valori fissi.
// Le stringhe UI arrivano da src/i18n (la lingua è impostata per
// istanza da EdicolAI): mai literal italiani nei test.
const ui = t();

const dates = corpusDates(); // ascendenti
const newestFirst = [...dates].reverse();
const latestMonth = formatMonthYear(new Date(newestFirst[0]!));

test.describe("archivio e navigazione per data", () => {
  test("/edizioni/ elenca tutte le edizioni del corpus raggruppate per mese", async ({
    page,
  }) => {
    await page.goto("/edizioni/");
    await expect(
      page.getByRole("heading", { name: ui.archive.title }),
    ).toBeVisible();
    await expect(
      page.locator(".archive-month-title", { hasText: latestMonth }),
    ).toBeVisible();
    await expect(page.locator(".archive-row")).toHaveCount(dates.length);
  });

  test("il MastHead porta all'archivio da ogni pagina", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: ui.nav.editions }).click();
    await expect(page).toHaveURL(/\/edizioni\/$/);
  });

  test("walk completo: dalla homepage alla più vecchia via 'precedente'", async ({
    page,
  }) => {
    await page.goto("/");
    const expected = newestFirst.slice(1); // tutte tranne l'ultima (homepage)
    const datesVisited: string[] = [];
    for (let hop = 0; hop < expected.length; hop++) {
      const prevLink = page.locator(".edition-nav-link", {
        hasText: ui.edition.previous,
      });
      await expect(prevLink).toBeVisible();
      await prevLink.click();
      const url = page.url();
      const dateInUrl = url.match(/edizioni\/(\d{4}-\d{2}-\d{2})/)?.[1];
      expect(dateInUrl).toBeTruthy();
      datesVisited.push(dateInUrl!);
    }
    expect(datesVisited).toEqual(expected);
    // La più vecchia non ha "precedente" ma ha "successiva".
    await expect(
      page.locator(".edition-nav-link", { hasText: ui.edition.previous }),
    ).toHaveCount(0);
    await expect(
      page.locator(".edition-nav-link", { hasText: ui.edition.next }),
    ).toBeVisible();
  });

  test("la homepage non ha 'successiva' (è l'ultima)", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.locator(".edition-nav-link", { hasText: ui.edition.next }),
    ).toHaveCount(0);
  });
});
