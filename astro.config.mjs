import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';
import contentAssets from './src/integrations/content-assets.mjs';
// Import TS da .mjs: regge perché astro.config viene bundlato (vedi
// la stessa nota in src/integrations/content-assets.mjs).
import { resolveInstance } from './src/lib/instance.ts';
import instancesRegistry from './src/data/instances.json';

// Public deployment configuration comes from an untracked .env.local or from
// GitHub Actions repository variables. Playwright forces a local, base-less
// build so tests never depend on the deploy target.
const env = { ...loadEnv(process.env.NODE_ENV || 'production', process.cwd(), ''), ...process.env };
const isPlaywright = env.PLAYWRIGHT_TEST === '1';

// Istanza attiva (spec 014): fallback del base path quando BASE_PATH
// non è in env — `INSTANCE=<slug> pnpm build` basta da solo in locale.
// Slug sconosciuto = throw del resolver, prima di qualsiasi parse.
const instance = resolveInstance(env.INSTANCE, instancesRegistry);

export default defineConfig({
  site: isPlaywright
    ? 'http://127.0.0.1:4399'
    : env.SITE_URL || 'https://lucafregoso.github.io',
  // Keep base directory-like to avoid slash/no-slash sitemap duplicates.
  base: isPlaywright
    ? '/'
    : env.BASE_PATH || instance.basePath,
  integrations: [sitemap(), contentAssets()],
});
