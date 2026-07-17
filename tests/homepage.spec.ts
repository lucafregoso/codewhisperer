import { test, expect } from "@playwright/test";
import { formatFullDate } from "../src/lib/dates";
import { corpusEditions } from "./helpers/corpus";

// Tutto derivato dal corpus reale al momento del run: il corpus è
// dinamico (lo popolano gli scraper), nessuna edizione o contenuto
// specifico è garantito. Dove una caratteristica può mancare, il test
// fa skip esplicito.
const editions = corpusEditions();
const latest = editions.at(-1)!;

// Un'edizione con tutte le sezioni opzionali, se esiste nel corpus.
const complete = editions.find(
  (e) => e.radar.length > 0 && e.slowFeed && e.coverage,
);

// Un riferimento fonte con attribuzione "via", se esiste nel corpus.
const viaEdition = editions.find((e) =>
  e.stories.some((s) => s.sources.some((src) => src.via)),
);
const viaRef = viaEdition?.stories
  .flatMap((s) => s.sources)
  .find((src) => src.via);

test.describe("homepage — ultima edizione", () => {
  test("mostra l'edizione con data massima del corpus", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/CodeWhisperer/);
    await expect(page.locator(".edition-date")).toContainText(
      formatFullDate(new Date(latest.date)),
    );
    await expect(
      page.getByRole("heading", { name: latest.stories[0]!.title }),
    ).toBeVisible();
  });

  test("le sezioni opzionali sono renderizzate quando presenti", async ({
    page,
  }) => {
    test.skip(!complete, "nessuna edizione con radar+feed lento+copertura");
    await page.goto(`/edizioni/${complete!.date}/`);
    await expect(page.getByRole("heading", { name: "Radar" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /feed lento/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /nota di copertura/i }),
    ).toBeVisible();
    await expect(page.locator(".coverage")).toContainText(
      complete!.coverage!.tagline ?? String(complete!.coverage!.sourcesRead),
    );
  });

  test("il badge fonte mostra l'attribuzione via", async ({ page }) => {
    test.skip(!viaRef, "nessuna fonte con attribuzione via nel corpus");
    await page.goto(`/edizioni/${viaEdition!.date}/`);
    const viaBadge = page.locator(".source-badge", {
      hasText: `via ${viaRef!.via!.name}`,
    });
    await expect(viaBadge.first()).toBeVisible();
  });

  test("il contenuto è visibile senza JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator(".edition-date")).toBeVisible();
    await expect(page.locator(".story").first()).toBeVisible();
    if (complete) {
      await page.goto(`/edizioni/${complete.date}/`);
      await expect(page.locator(".radar")).toBeVisible();
      await expect(page.locator(".coverage")).toBeVisible();
    }
    await context.close();
  });
});
