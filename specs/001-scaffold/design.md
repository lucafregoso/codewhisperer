# Spec 001 — Design

## Stack

Astro 5 + pnpm + node 24 (`.nvmrc`), TypeScript strict, `@astrojs/sitemap`,
`@astrojs/rss` (usata dalla 006), `marked` (usata dalla 002), Vitest,
Playwright (webServer proprio su 4399), Fontsource variable self-hosted.

## Tipografia (v0, raffinata nella 007)

- Display: **Archivo Variable** (asse `wdth` 62–125 + `wght` fino a 900) —
  headline condensed/black, il match libero più vicino al display Wired.
- Corpo/deck: **Source Serif 4 Variable** — il serif leggibile da magazine.
- Kicker/meta: Archivo uppercase, tracking +0.08em.

## Token (tokens.css)

- Colore: `--paper`/`--ink` invertiti in dark mode via pre-paint script;
  `--rule` (bordi 3px sezione), `--hairline` (griglie), palette accent
  ciclica per categorie emergenti (`--accent-0..5`, AA su entrambi i temi).
- Scala chiusa: `--text-meta`, `--text-kicker`, `--text-body-sm`,
  `--text-body`, `--text-deck`, `--text-title`, `--text-headline`,
  `--text-hero` (clamp). Layout: `--shell`, `--measure`, `--ease-out`.

## File

- `astro.config.mjs` — pattern SITE_URL/BASE_PATH/PLAYWRIGHT_TEST del
  riferimento; base default `/codewhisperer/`.
- `src/lib/url.ts` — `withBase()`.
- `src/i18n/index.ts` — `activeLocales = ["it"]`, stringhe UI.
- `src/data/site.ts` — identità (nome, tagline, descrizione meta).
- `src/layouts/BaseLayout.astro` — head/SEO, preload font, pre-paint theme,
  skip link, slot.
- `src/pages/index.astro` — placeholder con identità (sostituita in 003).
- `src/pages/robots.txt.ts` — punta a sitemap-index.
- `.github/workflows/ci.yml` (PR → develop|master: gate) e `deploy.yml`
  (push master → Pages). Deploy da **master**: con git flow master è "ciò
  che è live".
- `tests/`: `homepage.spec.ts` (shell renderizza, no-JS),
  `regressions.spec.ts` (seed: audit href senza withBase),
  `accessibility.spec.ts` (axe, entrambi i temi).

## Subagent (.claude/agents/)

spec-writer (read-only), ui-designer, astro-engineer, test-engineer,
reviewer (read-only). Niente agent git/cicd: routine da CLAUDE.md.
