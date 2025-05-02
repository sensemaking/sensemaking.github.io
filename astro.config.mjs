// @ts-check
import { defineConfig } from 'astro/config'

import mdx from '@astrojs/mdx'
import tailwindcss from "@tailwindcss/vite"

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://www.sensemaking.uk.com',
  integrations: [mdx()]
});