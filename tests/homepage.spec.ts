import { test, expect } from "@playwright/test";

test.describe("homepage — ultima edizione", () => {
  test("mostra l'edizione con data massima (16 luglio 2026)", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/CodeWhisperer/);
    await expect(page.locator(".edition-date")).toContainText(
      "16 luglio 2026",
    );
    await expect(
      page.getByRole("heading", {
        name: /Hyundai rende Boston Dynamics/,
      }),
    ).toBeVisible();
  });

  test("le sezioni dell'edizione sono tutte presenti", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Radar" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /feed lento/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /nota di copertura/i }),
    ).toBeVisible();
    await expect(page.locator(".coverage")).toContainText("puoi ignorarlo");
  });

  test("il badge fonte risolve il pattern via", async ({ page }) => {
    await page.goto("/");
    const viaBadge = page.locator(".source-badge", {
      hasText: "via Techmeme",
    });
    await expect(viaBadge.first()).toBeVisible();
  });

  test("il contenuto è visibile senza JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator(".edition-date")).toBeVisible();
    await expect(page.locator(".story").first()).toBeVisible();
    await expect(page.locator(".radar")).toBeVisible();
    await expect(page.locator(".coverage")).toBeVisible();
    await context.close();
  });
});
