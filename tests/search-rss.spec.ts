import { test, expect } from "@playwright/test";
import { corpusEditions } from "./helpers/corpus";

// Contenuti derivati dal corpus al momento del run, mai hardcoded.
const editions = corpusEditions();
const latest = editions.at(-1)!;
const totalStories = editions.reduce((n, e) => n + e.stories.length, 0);

// Una parola distintiva dal titolo dell'ultima hero, per la ricerca.
const searchWord = latest.stories[0]!.title
  .split(/[^\p{L}\p{N}]+/u)
  .filter((w) => w.length >= 6)
  .sort((a, b) => b.length - a.length)[0];

test.describe("rss", () => {
  test("/rss.xml è un feed valido con le storie di tutte le edizioni", async ({
    request,
  }) => {
    const res = await request.get("/rss.xml");
    expect(res.status()).toBe(200);
    const xml = await res.text();
    expect(xml).toContain("<rss");
    expect(xml).toContain("<language>it</language>");
    expect(xml).toContain(`/edizioni/${latest.date}/#`);
    const items = xml.match(/<item>/g) ?? [];
    expect(items.length).toBeGreaterThanOrEqual(totalStories);
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
    test.skip(!searchWord, "nessuna parola ricercabile nel titolo hero");
    await page.goto("/cerca/");
    const input = page.locator("#search input");
    await input.fill(searchWord!);
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
