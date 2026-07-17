import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';
import podcastAssets from './src/integrations/podcast-assets.mjs';

// Public deployment configuration comes from an untracked .env.local or from
// GitHub Actions repository variables. Playwright forces a local, base-less
// build so tests never depend on the deploy target.
const env = { ...loadEnv(process.env.NODE_ENV || 'production', process.cwd(), ''), ...process.env };
const isPlaywright = env.PLAYWRIGHT_TEST === '1';

export default defineConfig({
  site: isPlaywright
    ? 'http://127.0.0.1:4399'
    : env.SITE_URL || 'https://lucafregoso.github.io',
  // Keep base directory-like to avoid slash/no-slash sitemap duplicates.
  base: isPlaywright
    ? '/'
    : env.BASE_PATH || '/codewhisperer/',
  integrations: [sitemap(), podcastAssets()],
});
