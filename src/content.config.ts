import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"

const articles = defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./articles"}),
    schema: z.object({
        title: z.string(),
        published: z.date(),
        slug: z.string(),
    })
})

export const collections = { articles }
