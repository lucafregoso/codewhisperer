import { test, expect } from "@playwright/test";

test.describe("homepage shell", () => {
  test("renderizza l'identità CodeWhisperer", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/CodeWhisperer/);
    await expect(page.locator("h1")).toContainText("CodeWhisperer");
  });

  test("il contenuto è visibile senza JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
    await context.close();
  });
});
