import { test, expect } from "@playwright/test";
import { corpusCovers, corpusDates, corpusImages } from "./helpers/corpus";

// Le immagini sono contenuto, mai decorazione (PRODUCT.md): compaiono
// solo se l'edizione le porta (markdown ![…](…) o riga **Immagine:**).
// Il corpus è dinamico: presenza e assenza derivano dalle lane reali.
const images = corpusImages();
const covers = corpusCovers();
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

  test("una storia con immagine la mostra con alt e file servito", async ({
    page,
    request,
  }) => {
    test.skip(images.length === 0, "nessuna immagine nel corpus");
    const { date, slug } = images[0]!;
    await page.goto(`/edizioni/${date}/`);
    const story = page.locator(`.story:has([id="${slug}"])`);
    const img = story.locator("img").first();
    await expect(img).toBeVisible();
    expect(await img.getAttribute("alt")).toBeTruthy();
    const src = (await img.getAttribute("src"))!;
    if (src.startsWith("/")) {
      const res = await request.get(src);
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toContain("image");
    }
  });

  test("l'edizione con cover la mostra in testa", async ({ page }) => {
    test.skip(covers.length === 0, "nessuna cover nel corpus");
    await page.goto(`/edizioni/${covers.at(-1)}/`);
    const cover = page.locator(".edition-cover img");
    await expect(cover).toBeVisible();
    expect(await cover.getAttribute("alt")).toBeTruthy();
  });
});
