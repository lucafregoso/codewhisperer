import { test, expect } from "@playwright/test";

test.describe("archivio e navigazione per data", () => {
  test("/edizioni/ elenca le 5 edizioni raggruppate per mese", async ({
    page,
  }) => {
    await page.goto("/edizioni/");
    await expect(page.getByRole("heading", { name: "Edizioni" })).toBeVisible();
    await expect(page.locator(".archive-month-title")).toContainText(
      "luglio 2026",
    );
    await expect(page.locator(".archive-row")).toHaveCount(5);
  });

  test("il MastHead porta all'archivio da ogni pagina", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Edizioni" }).click();
    await expect(page).toHaveURL(/\/edizioni\/$/);
  });

  test("walk completo: dalla homepage alla più vecchia via 'precedente'", async ({
    page,
  }) => {
    await page.goto("/");
    const datesVisited: string[] = [];
    for (let hop = 0; hop < 4; hop++) {
      const prevLink = page.locator(".edition-nav-link", {
        hasText: "Edizione precedente",
      });
      await expect(prevLink).toBeVisible();
      await prevLink.click();
      const url = page.url();
      const dateInUrl = url.match(/edizioni\/(\d{4}-\d{2}-\d{2})/)?.[1];
      expect(dateInUrl).toBeTruthy();
      datesVisited.push(dateInUrl!);
    }
    expect(datesVisited).toEqual([
      "2026-07-15",
      "2026-07-14",
      "2026-07-13",
      "2026-07-12",
    ]);
    // La più vecchia non ha "precedente" ma ha "successiva".
    await expect(
      page.locator(".edition-nav-link", { hasText: "Edizione precedente" }),
    ).toHaveCount(0);
    await expect(
      page.locator(".edition-nav-link", { hasText: "Edizione successiva" }),
    ).toBeVisible();
  });

  test("la homepage non ha 'successiva' (è l'ultima)", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.locator(".edition-nav-link", { hasText: "Edizione successiva" }),
    ).toHaveCount(0);
  });
});
