import { site } from "../data/site";
import type { Edition } from "./editions";
import { withBase } from "./url";

/**
 * JSON-LD per una pagina edizione: CollectionPage + ItemList di
 * NewsArticle (uno per storia in primo piano).
 */
export function editionStructuredData(
  edition: Edition,
  siteUrl: URL | undefined,
): Record<string, unknown>[] {
  const pageUrl = new URL(withBase(`/edizioni/${edition.id}/`), siteUrl);
  const published = edition.data.date.toISOString();

  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${site.name} — ${edition.id}`,
      description: edition.data.tldr,
      url: pageUrl.toString(),
      datePublished: published,
      inLanguage: site.meta.lang,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: edition.data.stories.map((story, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "NewsArticle",
            headline: story.title,
            url: `${pageUrl}#${story.slug}`,
            datePublished: published,
            inLanguage: site.meta.lang,
            publisher: { "@type": "Organization", name: site.name },
          },
        })),
      },
    },
  ];
}
