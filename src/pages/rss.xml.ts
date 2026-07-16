import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { site } from "../data/site";
import { getEditionsSorted } from "../lib/editions";
import { renderInline } from "../lib/md";
import { withBase } from "../lib/url";

export const GET: APIRoute = async (context) => {
  const editions = await getEditionsSorted();

  const items = editions.flatMap((edition) =>
    edition.data.stories.map((story) => ({
      title: story.title,
      link: withBase(`/edizioni/${edition.id}/#${story.slug}`),
      pubDate: edition.data.date,
      description: renderInline(story.body),
      categories: story.categories,
    })),
  );

  return rss({
    title: site.name,
    description: site.meta.description,
    site: context.site ?? "https://lucafregoso.github.io",
    items,
    customData: `<language>${site.meta.lang}</language>`,
  });
};
