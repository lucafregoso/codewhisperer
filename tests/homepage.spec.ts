import { test, expect } from "@playwright/test";
import { formatFullDate } from "../src/lib/dates";
import { corpusEditions } from "./helpers/corpus";

const latest = corpusEditions().at(-1)!;

// Edizione immutabile con tutte le sezioni opzionali (radar, feed lento,
// copertura, via-pattern): i check strutturali vivono qui, non sulla
// homepage, che cambia contenuto a ogni nuova edizione.
const FROZEN = "/edizioni/2026-07-16/";

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

  test("le sezioni dell'edizione sono tutte presenti (edizione di riferimento)", async ({
    page,
  }) => {
    await page.goto(FROZEN);
    await expect(page.getByRole("heading", { name: "Radar" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /feed lento/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /nota di copertura/i }),
    ).toBeVisible();
    await expect(page.locator(".coverage")).toContainText("puoi ignorarlo");
  });

  test("il badge fonte risolve il pattern via (edizione di riferimento)", async ({
    page,
  }) => {
    await page.goto(FROZEN);
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
    await page.goto(FROZEN);
    await expect(page.locator(".radar")).toBeVisible();
    await expect(page.locator(".coverage")).toBeVisible();
    await context.close();
  });
});
