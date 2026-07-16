import { test, expect } from "@playwright/test";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

const THEMES = ["light", "dark"] as const;

for (const theme of THEMES) {
  test(`axe WCAG 2.2 AA — tema ${theme}`, async ({ page }) => {
    await page.goto("/");
    await page.evaluate((mode) => {
      document.documentElement.dataset.theme = mode;
    }, theme);
    await page.addScriptTag({ content: axeSource });
    const results = await page.evaluate(async () => {
      // @ts-expect-error axe è iniettato a runtime
      return await axe.run(document, {
        runOnly: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
      });
    });
    const violations = results.violations.map(
      (v: { id: string; nodes: unknown[] }) => `${v.id} (${v.nodes.length})`,
    );
    expect(violations, violations.join(", ")).toHaveLength(0);
  });
}
