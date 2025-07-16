import { defineConfig } from 'astro/config';
import staticAdapter from '@astrojs/adapter-static';

export default defineConfig({
  site: 'https://pasaporteproducto.es',
  adapter: staticAdapter(),
  build: {
    format: 'directory',
  }
});
