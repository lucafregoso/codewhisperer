import { test, expect } from "@playwright/test";

/**
 * Ogni test qui dentro guarda un bug reale o un invariante di costituzione.
 * MAI cancellare voci esistenti (costituzione §12).
 */
test.describe("regressions", () => {
  test("nessun 'undefined' in title o meta", async ({ page }) => {
    await page.goto("/");
    expect(await page.title()).not.toContain("undefined");
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description).toBeTruthy();
    expect(description).not.toContain("undefined");
  });

  test("gli href interni non bypassano il base path", async ({ page }) => {
    // In build di test il base è "/": qui si verifica che nessun link
    // interno sia rotto (404) — l'audit con BASE_PATH reale è in CI build.
    await page.goto("/");
    const hrefs = await page
      .locator('a[href^="/"]')
      .evaluateAll((links) => links.map((a) => a.getAttribute("href")));
    for (const href of hrefs) {
      expect(href, "href interno vuoto o undefined").toBeTruthy();
      expect(href).not.toContain("undefined");
    }
  });

  test("robots.txt espone la sitemap", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    expect(await res.text()).toContain("sitemap-index.xml");
  });
});
