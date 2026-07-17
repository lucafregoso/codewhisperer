import { defineCollection, z } from "astro:content";
import { editionsLoader } from "./lib/editions-loader";

const slug = z.string().regex(/^[a-z0-9-]+$/);

const sourceRef = z.object({
  name: z.string().min(1),
  slug,
  via: z.object({ name: z.string().min(1), slug }).optional(),
  url: z.string().url(),
  note: z.string().optional(),
});

const story = z.object({
  position: z.number().int().positive(),
  slug,
  title: z.string().min(1),
  body: z.string().min(1),
  categories: z.array(slug),
  sources: z.array(sourceRef).min(1),
});

const radarItem = z.object({
  text: z.string().min(1),
  categories: z.array(slug),
  source: sourceRef,
});

const editions = defineCollection({
  loader: editionsLoader(),
  schema: z
    .object({
      date: z.coerce.date(),
      masthead: z.string().min(1),
      tldr: z.string().min(1),
      file: z.string().min(1),
      // Audio dell'edizione: input/podcast/<basename>.mp3, opzionale.
      podcast: z.object({ file: z.string().min(1) }).optional(),
      stories: z.array(story).min(1),
      radar: z.array(radarItem).default([]),
      slowFeed: z
        .object({
          title: z.string().min(1),
          author: z.string().optional(),
          body: z.string().min(1),
          source: sourceRef,
          categories: z.array(slug),
        })
        .optional(),
      coverage: z
        .object({
          sourcesRead: z.number().int().nonnegative(),
          sourcesTotal: z.number().int().nonnegative(),
          unreachable: z.array(z.string()).default([]),
          itemsCollected: z.number().int().nonnegative(),
          itemsPublished: z.number().int().nonnegative(),
          itemsDiscarded: z.number().int().nonnegative(),
          tagline: z.string().optional(),
        })
        .optional(),
    })
    .refine(
      (e) =>
        e.stories.every(
          (s, i, all) => all.findIndex((x) => x.slug === s.slug) === i,
        ),
      { message: "Slug di storia duplicati nella stessa edizione" },
    ),
});

export const collections = { editions };
