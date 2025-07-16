import { defineConfig } from 'astro/config';
import github from '@astrojs/github';

export default defineConfig({
  base: '/pasaporteproducto-site/',
  output: 'static',
  adapter: github(),
});
