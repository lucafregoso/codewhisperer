import { test, expect } from "@playwright/test";
import { corpusDates, corpusPodcasts } from "./helpers/corpus";

// Coppie md↔mp3 derivate dal corpus reale, mai hardcoded: prima del
// commit contenuto con input/podcast/ questi test fanno skip espliciti.
const podcasts = corpusPodcasts();
const dates = corpusDates();
const latestDate = dates.at(-1)!;
const datesWithPodcast = new Set(podcasts.map((p) => p.date));
const latestPodcast = podcasts.find((p) => p.date === latestDate);

test.describe("podcast — player audio dell'edizione", () => {
  test("l'edizione con podcast mostra il player in testa alla pagina", async ({
    page,
  }) => {
    test.skip(podcasts.length === 0, "nessun podcast nel corpus");
    const { date, file } = podcasts[0]!;
    await page.goto(`/edizioni/${date}/`);
    const audio = page.locator(".edition-header audio.podcast-audio");
    await expect(audio).toBeVisible();
    expect(await audio.getAttribute("src")).toContain(
      `/podcast/${encodeURIComponent(file)}`,
    );
  });

  test("la homepage mostra il player se l'ultima edizione ha il podcast", async ({
    page,
  }) => {
    test.skip(!latestPodcast, "l'ultima edizione non ha il podcast");
    await page.goto("/");
    const audio = page.locator(".edition-header audio.podcast-audio");
    await expect(audio).toBeVisible();
    expect(await audio.getAttribute("src")).toContain(
      `/podcast/${encodeURIComponent(latestPodcast!.file)}`,
    );
  });

  test("l'mp3 è servito con status 200 e content-type audio", async ({
    request,
  }) => {
    test.skip(podcasts.length === 0, "nessun podcast nel corpus");
    const res = await request.get(
      `/podcast/${encodeURIComponent(podcasts[0]!.file)}`,
    );
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("audio");
  });

  test("le edizioni senza podcast non mostrano il player", async ({
    page,
  }) => {
    const without = dates.filter((d) => !datesWithPodcast.has(d));
    test.skip(without.length === 0, "tutte le edizioni hanno il podcast");
    await page.goto(`/edizioni/${without[0]}/`);
    await expect(page.locator("audio")).toHaveCount(0);
  });

  test("il player è presente anche senza JavaScript", async ({ browser }) => {
    test.skip(podcasts.length === 0, "nessun podcast nel corpus");
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`/edizioni/${podcasts[0]!.date}/`);
    await expect(page.locator("audio.podcast-audio")).toBeVisible();
    await context.close();
  });
});
