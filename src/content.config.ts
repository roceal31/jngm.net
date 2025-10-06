// Import the glob loader
import type { Loader, LoaderContext} from 'astro/loaders';
import { glob } from "astro/loaders";
import { fetchArticles } from "./scripts/strapi";

// Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";
import type { any } from 'astro:schema';
// Define a `loader` and `schema` for each collection
const blog = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: "./src/arjlog" }),
    schema: z.object({
      title: z.string(),
      pubDate: z.date(),
      description: z.string(),
      tags: z.array(z.string())
    })
});

function strapiLoader(): Loader {
  return {
    name: "strapi-loader",
    // Called when updating the collection.
    load: async (context: LoaderContext): Promise<void> => {
      // Load data and update the store
      const articles = await fetchArticles();
      console.log(articles);

      context.store.clear();
      articles.forEach((a: any) => {
        context.store.set({
          id: a.slug,
          data: {
            title: a.title,
            description: a.description,
            pubDate: new Date(a.publishedAt),
            slug: a.slug
          },
          rendered: {
            html: "<p>Stub</p>"
          }
        });
      });
    },

    // Optionally, define the schema of an entry.
    // It will be overridden by user-defined schema.
    schema: async () => z.object({
      title: z.string(),
      pubDate: z.date(),
      description: z.string(),
      slug: z.string()
    })
  };
}

const strapiBlog = defineCollection({
  loader: strapiLoader(),
})

// Export a single `collections` object to register your collection(s)
export const collections = { blog, strapiBlog };