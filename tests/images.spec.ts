import { test, expect } from "@playwright/test";
import { corpusDates, corpusImages } from "./helpers/corpus";

// Le immagini sono contenuto, mai decorazione (PRODUCT.md): compaiono
// solo se l'edizione porta la riga **Immagine:**. Il corpus è dinamico:
// presenza e assenza si derivano da input/ al momento del run.
const images = corpusImages();
const dates = corpusDates();

test.describe("immagini — solo dal contratto dell'edizione", () => {
  test("le storie senza immagine non mostrano alcun elemento immagine", async ({
    page,
  }) => {
    const datesWithImages = new Set(images.map((i) => i.date));
    const without = dates.filter((d) => !datesWithImages.has(d));
    test.skip(without.length === 0, "tutte le edizioni hanno immagini");
    await page.goto(`/edizioni/${without[0]}/`);
    await expect(page.locator(".story img")).toHaveCount(0);
  });

  test("una storia con immagine la mostra con alt", async ({ page }) => {
    test.skip(images.length === 0, "nessuna immagine nel corpus");
    const { date, slug } = images[0]!;
    await page.goto(`/edizioni/${date}/`);
    const story = page.locator(`.story:has([id="${slug}"])`);
    const img = story.locator("img");
    await expect(img.first()).toBeVisible();
    expect(await img.first().getAttribute("alt")).toBeTruthy();
  });
});
