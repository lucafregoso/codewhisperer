import { test, expect } from "@playwright/test";
import { formatFullDate } from "../src/lib/dates";
import { corpusDates } from "./helpers/corpus";

// Date derivate dal corpus al momento del run, mai hardcoded: il
// corpus è dinamico e i filename sono liberi (la data viene dall'H1).
const dates = corpusDates();
const oldestDate = dates[0]!;
const latestDate = dates.at(-1)!;

test.describe("permalink edizione", () => {
  test("ogni permalink mostra la data della propria edizione", async ({
    page,
  }) => {
    await page.goto(`/edizioni/${oldestDate}/`);
    await expect(page.locator(".edition-date")).toContainText(
      formatFullDate(new Date(oldestDate)),
    );
  });

  test("gli anchor delle storie sono navigabili", async ({ page }) => {
    await page.goto(`/edizioni/${latestDate}/`);
    const heroHeading = page.locator(".story--hero .story-title");
    const anchorId = await heroHeading.getAttribute("id");
    expect(anchorId).toMatch(/^[a-z0-9-]+$/);
    await page.goto(`/edizioni/${latestDate}/#${anchorId}`);
    await expect(page.locator(`#${anchorId}`)).toBeInViewport();
  });

  test("homepage e permalink dell'ultima edizione sono lo stesso layout", async ({
    page,
  }) => {
    await page.goto("/");
    const homeHero = await page
      .locator(".story--hero .story-title")
      .textContent();
    await page.goto(`/edizioni/${latestDate}/`);
    const permalinkHero = await page
      .locator(".story--hero .story-title")
      .textContent();
    expect(homeHero).toBe(permalinkHero);
  });
});
