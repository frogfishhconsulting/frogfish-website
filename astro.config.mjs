import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.frogfishconsulting.com',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  compressHTML: false,
});
