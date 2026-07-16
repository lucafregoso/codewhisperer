import { test, expect } from "@playwright/test";

test.describe("rss", () => {
  test("/rss.xml è un feed valido con le storie di tutte le edizioni", async ({
    request,
  }) => {
    const res = await request.get("/rss.xml");
    expect(res.status()).toBe(200);
    const xml = await res.text();
    expect(xml).toContain("<rss");
    expect(xml).toContain("Hyundai rende Boston Dynamics");
    expect(xml).toContain("/edizioni/2026-07-16/#");
    expect(xml).toContain("<language>it</language>");
  });
});

test.describe("ricerca", () => {
  test("l'indice Pagefind è generato post-build", async ({ request }) => {
    const res = await request.get("/pagefind/pagefind-ui.js");
    expect(res.status()).toBe(200);
  });

  test("/cerca/ con JS monta la UI Pagefind", async ({ page }) => {
    await page.goto("/cerca/");
    await expect(page.getByRole("heading", { name: "Cerca" })).toBeVisible();
    await expect(page.locator("#search .pagefind-ui")).toBeVisible();
  });

  test("una query trova una storia del corpus", async ({ page }) => {
    await page.goto("/cerca/");
    const input = page.locator("#search input");
    await input.fill("Boston Dynamics");
    const results = page.locator(".pagefind-ui__result");
    await expect(results.first()).toBeVisible();
  });

  test("senza JS la pagina offre i percorsi alternativi", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/cerca/");
    await expect(page.locator(".search-fallback")).toBeVisible();
    await expect(
      page.locator(".search-paths a", { hasText: "Edizioni" }),
    ).toBeVisible();
    await context.close();
  });
});
