import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import github from '@astrojs/github';

export default defineConfig({
  site: 'https://dterpaspro.github.io/pasaporteproducto-site/',
  base: '/pasaporteproducto-site/',
  output: 'static',
  integrations: [sitemap(), github()],
});
