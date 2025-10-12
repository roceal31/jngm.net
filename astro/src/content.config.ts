// Import the glob loader
import type { Loader, LoaderContext } from 'astro/loaders';
import { glob } from "astro/loaders";
import { fetchContent, getRawBody, getImageUrl } from "./scripts/strapi";

// Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";
import { getImage } from 'astro:assets';

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
    load: async (context:LoaderContext): Promise<void> => {
      // Load data and update the store
      const articles = await fetchContent('articles');

      context.store.clear();
      for(const article of articles) {
        const articleBody = await getRawBody(article);
        const coverUrl = getImageUrl(article.cover);
        context.store.set({
          id: article.slug,
          data: {
            title: article.title,
            description: article.description,
            pubDate: new Date(article.publishedAt),
            slug: article.slug,
            coverImage: 'http://localhost:1337/uploads/IMG_3483_68797dd2cc.jpeg'
          },
          body: articleBody,
          rendered: {
            html: (await context.renderMarkdown(articleBody)).html
          }
        });

      }
    },

    // Optionally, define the schema of an entry.
    // It will be overridden by user-defined schema.
    schema: async () => z.object({
      title: z.string(),
      pubDate: z.date(),
      description: z.string(),
      slug: z.string(),
      coverImage: z.string()
    })
  };
}

const strapiBlog = defineCollection({
  loader: strapiLoader(),
})

// Export a single `collections` object to register your collection(s)
export const collections = { blog, strapiBlog };