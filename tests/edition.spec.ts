import { test, expect } from "@playwright/test";
import { corpusDates } from "./helpers/corpus";

test.describe("permalink edizione", () => {
  test("/edizioni/2026-07-14/ mostra l'edizione del 14 (filename variante)", async ({
    page,
  }) => {
    await page.goto("/edizioni/2026-07-14/");
    await expect(page.locator(".edition-date")).toContainText(
      "14 luglio 2026",
    );
    await expect(
      page.getByRole("heading", { name: /sanzioni cyber congiunte/i }),
    ).toBeVisible();
  });

  test("gli anchor delle storie sono navigabili", async ({ page }) => {
    await page.goto("/edizioni/2026-07-16/");
    const heroHeading = page.locator(".story--hero .story-title");
    const anchorId = await heroHeading.getAttribute("id");
    expect(anchorId).toMatch(/^[a-z0-9-]+$/);
    await page.goto(`/edizioni/2026-07-16/#${anchorId}`);
    await expect(page.locator(`#${anchorId}`)).toBeInViewport();
  });

  test("homepage e permalink dell'ultima edizione sono lo stesso layout", async ({
    page,
  }) => {
    await page.goto("/");
    const homeHero = await page
      .locator(".story--hero .story-title")
      .textContent();
    const latestDate = corpusDates().at(-1)!;
    await page.goto(`/edizioni/${latestDate}/`);
    const permalinkHero = await page
      .locator(".story--hero .story-title")
      .textContent();
    expect(homeHero).toBe(permalinkHero);
  });
});
