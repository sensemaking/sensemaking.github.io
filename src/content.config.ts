import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./content/articles" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        published: z.coerce.date(),
        slug: z.string()
    })
});

export const collections = { articles };