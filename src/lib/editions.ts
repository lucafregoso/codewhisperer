import { getCollection, type CollectionEntry } from "astro:content";
import { slugify } from "./parser/slug";

export type Edition = CollectionEntry<"editions">;
export type Story = Edition["data"]["stories"][number];
export type RadarItem = Edition["data"]["radar"][number];
export type SourceRef = Story["sources"][number];

/** Tutte le edizioni, dalla più recente. */
export async function getEditionsSorted(): Promise<Edition[]> {
  const editions = await getCollection("editions");
  return editions.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}

/** L'edizione più recente: la homepage (costituzione §3). */
export async function getLatestEdition(): Promise<Edition> {
  const [latest] = await getEditionsSorted();
  if (!latest) {
    throw new Error("Nessuna edizione in input/: impossibile costruire il sito");
  }
  return latest;
}

/** Un item pubblicabile in una lista trasversale (categoria/fonte). */
export interface CorpusItem {
  editionDate: Date;
  editionId: string;
  kind: "story" | "radar" | "slow-feed";
  title?: string;
  /** markdown inline */
  text: string;
  anchor?: string;
  categories: string[];
  sources: SourceRef[];
}

/** Tutto il corpus (storie + radar + feed lento) dal più recente. */
export async function getCorpus(): Promise<CorpusItem[]> {
  const editions = await getEditionsSorted();
  return editions.flatMap((edition): CorpusItem[] => {
    const base = { editionDate: edition.data.date, editionId: edition.id };
    const stories = edition.data.stories.map(
      (story): CorpusItem => ({
        ...base,
        kind: "story",
        title: story.title,
        text: story.body,
        anchor: story.slug,
        categories: story.categories,
        sources: story.sources,
      }),
    );
    const radar = edition.data.radar.map(
      (item): CorpusItem => ({
        ...base,
        kind: "radar",
        text: item.text,
        categories: item.categories,
        sources: [item.source],
      }),
    );
    const slow = edition.data.slowFeed
      ? [
          {
            ...base,
            kind: "slow-feed" as const,
            title: edition.data.slowFeed.title,
            text: edition.data.slowFeed.body,
            anchor: "feed-lento",
            categories: edition.data.slowFeed.categories,
            sources: [edition.data.slowFeed.source],
          },
        ]
      : [];
    return [...stories, ...radar, ...slow];
  });
}

export interface EmergentTerm {
  slug: string;
  /** Etichetta visuale: prima grafia incontrata (fonti) o slug title-case */
  label: string;
  count: number;
}

/** Categorie emergenti dal corpus, per frequenza (costituzione §2). */
export async function getEmergentCategories(): Promise<EmergentTerm[]> {
  const corpus = await getCorpus();
  const counts = new Map<string, number>();
  for (const item of corpus) {
    for (const category of item.categories) {
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([termSlug, count]) => ({
      slug: termSlug,
      label: termSlug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      count,
    }))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}

/** Fonti emergenti (source e via contano entrambe). */
export async function getEmergentSources(): Promise<EmergentTerm[]> {
  const corpus = await getCorpus();
  const seen = new Map<string, { label: string; count: number }>();
  const bump = (termSlug: string, label: string) => {
    const entry = seen.get(termSlug);
    if (entry) {
      entry.count += 1;
    } else {
      seen.set(termSlug, { label, count: 1 });
    }
  };
  for (const item of corpus) {
    for (const source of item.sources) {
      bump(source.slug, source.name);
      if (source.via) bump(source.via.slug, source.via.name);
    }
  }
  return [...seen.entries()]
    .map(([termSlug, { label, count }]) => ({ slug: termSlug, label, count }))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}

/** Item del corpus che appartengono a una categoria. */
export function inCategory(corpus: CorpusItem[], categorySlug: string): CorpusItem[] {
  return corpus.filter((item) => item.categories.includes(categorySlug));
}

/** Item del corpus firmati da una fonte (source O via). */
export function fromSource(corpus: CorpusItem[], sourceSlug: string): CorpusItem[] {
  return corpus.filter((item) =>
    item.sources.some(
      (s) => s.slug === sourceSlug || s.via?.slug === sourceSlug,
    ),
  );
}

/** Slug helper riesportato per le pagine. */
export { slugify };
