import { test, expect } from "@playwright/test";
import { corpusEditions } from "./helpers/corpus";

// Le fonti sono emergenti dal corpus (dinamico, popolato dagli
// scraper): i test derivano slug e attribuzioni da input/ al momento
// del run, mai da fonti specifiche hardcoded.
const editions = corpusEditions();
const allRefs = editions.flatMap((e) => [
  ...e.stories.flatMap((s) => s.sources),
  ...e.radar.map((r) => r.source),
  ...(e.slowFeed ? [e.slowFeed.source] : []),
]);

// La fonte più frequente del corpus: ha sicuramente una pagina e item.
const bySlug = new Map<string, { name: string; count: number }>();
for (const ref of allRefs) {
  const entry = bySlug.get(ref.slug) ?? { name: ref.name, count: 0 };
  entry.count += 1;
  bySlug.set(ref.slug, entry);
}
const [topSlug, topSource] = [...bySlug.entries()].sort(
  (a, b) => b[1].count - a[1].count,
)[0]!;

// Un riferimento con attribuzione via, se il corpus ne ha.
const viaRef = allRefs.find((r) => r.via);

test.describe("filtri per fonte", () => {
  test("/fonte/ elenca le fonti emergenti dal corpus", async ({ page }) => {
    await page.goto("/fonte/");
    await expect(page.getByRole("heading", { name: "Fonti" })).toBeVisible();
    const rows = page.locator(".term-row");
    expect(await rows.count()).toBeGreaterThanOrEqual(1);
    await expect(
      rows.locator(".term-label", { hasText: topSource.name }).first(),
    ).toBeVisible();
  });

  test("la pagina fonte include gli item arrivati via aggregatore", async ({
    page,
  }) => {
    test.skip(!viaRef, "nessuna attribuzione via nel corpus");
    await page.goto(`/fonte/${viaRef!.slug}/`);
    await expect(
      page.getByRole("heading", { name: viaRef!.name }),
    ).toBeVisible();
    const items = page.locator(".corpus-item");
    expect(await items.count()).toBeGreaterThan(0);
    await expect(
      items
        .locator(".source-badge", { hasText: `via ${viaRef!.via!.name}` })
        .first(),
    ).toBeVisible();
  });

  test("la pagina fonte elenca item con link all'edizione", async ({
    page,
  }) => {
    await page.goto(`/fonte/${topSlug}/`);
    const firstDate = page.locator(".corpus-item .corpus-date").first();
    await expect(firstDate).toBeVisible();
    const href = await firstDate.getAttribute("href");
    expect(href).toMatch(/\/edizioni\/\d{4}-\d{2}-\d{2}\//);
  });

  test("gli item del corpus linkano l'anchor della storia", async ({
    page,
  }) => {
    await page.goto(`/fonte/${topSlug}/`);
    const storyLink = page.locator(".corpus-item .corpus-title a").first();
    const href = await storyLink.getAttribute("href");
    expect(href).toMatch(/#[a-z0-9-]+$/);
  });
});

test.describe("filtri per categoria", () => {
  test("/categoria/ mostra lo stato vuoto o le categorie emergenti", async ({
    page,
  }) => {
    // Finché le edizioni non portano righe **Categorie:** la pagina
    // mostra lo stato vuoto; con le categorie compaiono le righe.
    // Entrambi gli stati sono validi: il corpus è dinamico.
    await page.goto("/categoria/");
    await expect(
      page.getByRole("heading", { name: "Categorie" }),
    ).toBeVisible();
    const emptyState = page.locator(".term-empty");
    const termRows = page.locator(".term-row");
    expect(
      (await emptyState.count()) + (await termRows.count()),
    ).toBeGreaterThan(0);
  });
});
