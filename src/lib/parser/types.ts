/**
 * Contratto del parser delle rassegne RubricAI (spec 002).
 * I corpi restano markdown inline: la conversione HTML è del loader.
 */

export interface SourceRef {
  /** Nome visuale della testata, es. "Reuters" */
  name: string;
  /** Slug emergente della testata, es. "reuters" */
  slug: string;
  /** Aggregatore di provenienza (pattern via), es. {name:"Techmeme", slug:"techmeme"} */
  via?: { name: string; slug: string };
  url: string;
  /** L'annotazione dopo "—", markdown inline */
  note?: string;
}

export interface StoryImage {
  url: string;
  /** Alt dalla riga Immagine (dopo "—"); assente → fallback al titolo */
  alt?: string;
}

export interface Story {
  /** Ordine editoriale 1..n dalla numerazione H3 */
  position: number;
  /** Anchor stabile derivato dal titolo */
  slug: string;
  title: string;
  /** Corpo markdown inline (bold, link) */
  body: string;
  /** Slug categorie emergenti; [] se la riga Categorie manca */
  categories: string[];
  sources: SourceRef[];
  /** Arte del pezzo dalla riga **Immagine:** — opzionale */
  image?: StoryImage;
}

export interface RadarItem {
  /** Testo markdown inline, senza il link fonte finale */
  text: string;
  categories: string[];
  source: SourceRef;
}

export interface SlowFeed {
  title: string;
  author?: string;
  /** Corpo markdown inline */
  body: string;
  source: SourceRef;
  categories: string[];
}

export interface Coverage {
  sourcesRead: number;
  sourcesTotal: number;
  unreachable: string[];
  itemsCollected: number;
  itemsPublished: number;
  itemsDiscarded: number;
  tagline?: string;
}

export interface RawEdition {
  /** ISO yyyy-mm-dd estratta dall'H1 */
  date: string;
  /** Titolo testata dall'H1, es. "RubricAI" */
  masthead: string;
  /** Il blockquote di apertura, markdown inline */
  tldr: string;
  /** Cover dell'edizione: immagine markdown tra TLDR e prima sezione */
  image?: StoryImage;
  stories: Story[];
  radar: RadarItem[];
  slowFeed?: SlowFeed;
  coverage?: Coverage;
}

/** Errore di parse con posizione: fa fallire la build con file e riga. */
export class EditionParseError extends Error {
  /** Riga 1-based nel file sorgente */
  readonly line: number;

  constructor(message: string, line: number) {
    super(message);
    this.name = "EditionParseError";
    this.line = line;
  }
}
