import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  return rss({
    title: 'Japanese New-Girl Monkey',
    description: 'Personal website and blog of Andrea Roceal James. Maybe one day I will think of a less bland description.',
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.pubDate,
      description: p.data.description,
      link: `/posts/${p.id}`
    })),
    customData: `<language>en-au</language>`,
  });
}