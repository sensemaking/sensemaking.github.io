// @ts-check
import { defineConfig } from 'astro/config'
import rehypeMermaid from 'rehype-mermaid'

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  markdown: {
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid']
    },
    rehypePlugins:[[rehypeMermaid, { strategy: 'img-svg', dark: true, colorScheme: 'forest' }]]
  },
  integrations: [mdx()]
});