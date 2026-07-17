import { test, expect } from "@playwright/test";

test.describe("filtri per fonte", () => {
  test("/fonte/ elenca le fonti emergenti con conteggi", async ({ page }) => {
    await page.goto("/fonte/");
    await expect(page.getByRole("heading", { name: "Fonti" })).toBeVisible();
    const rows = page.locator(".term-row");
    expect(await rows.count()).toBeGreaterThan(10);
    await expect(
      rows.locator(".term-label", { hasText: "Techmeme" }).first(),
    ).toBeVisible();
  });

  test("/fonte/reuters/ include gli item arrivati via Techmeme", async ({
    page,
  }) => {
    await page.goto("/fonte/reuters/");
    await expect(page.getByRole("heading", { name: "Reuters" })).toBeVisible();
    const items = page.locator(".corpus-item");
    expect(await items.count()).toBeGreaterThan(0);
    await expect(
      items.locator(".source-badge", { hasText: "via Techmeme" }).first(),
    ).toBeVisible();
  });

  test("/fonte/techcrunch/ elenca item dal più recente con link edizione", async ({
    page,
  }) => {
    await page.goto("/fonte/techcrunch/");
    const firstDate = page.locator(".corpus-item .corpus-date").first();
    await expect(firstDate).toBeVisible();
    const href = await firstDate.getAttribute("href");
    expect(href).toMatch(/\/edizioni\/2026-07-\d{2}\//);
  });

  test("gli item del corpus linkano l'anchor della storia", async ({
    page,
  }) => {
    await page.goto("/fonte/techcrunch/");
    const storyLink = page
      .locator(".corpus-item .corpus-title a")
      .first();
    const href = await storyLink.getAttribute("href");
    expect(href).toMatch(/#[a-z0-9-]+$/);
  });
});

test.describe("filtri per categoria", () => {
  test("/categoria/ mostra lo stato vuoto o le categorie emergenti", async ({
    page,
  }) => {
    // Finché Hermes non emette righe **Categorie:** la pagina mostra lo
    // stato vuoto; alla prima edizione categorizzata compaiono le righe.
    // Entrambi gli stati sono validi: il test non deve congelare il corpus.
    await page.goto("/categoria/");
    await expect(
      page.getByRole("heading", { name: "Categorie" }),
    ).toBeVisible();
    const emptyState = page.locator(".term-empty");
    const termRows = page.locator(".term-row");
    expect((await emptyState.count()) + (await termRows.count())).toBeGreaterThan(0);
  });
});
