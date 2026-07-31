import type { CategoryRule } from "../../lib/category-derivation";

/**
 * Derivation rules for the `rassegnai` instance (spec 016). Curated by
 * reading the real corpus (`input/rassegnai-daily/editions`, 20
 * editions / 476 items as of 2026-07-31): every slug below names a
 * theme that actually recurs in those editions, and every keyword was
 * checked against the corpus for false positives — no invented
 * taxonomy (constitution §2).
 *
 * Two things drive the shape of this list:
 *
 * 1. **Array order is editorial priority.** `deriveCategories()` emits
 *    slugs in declaration order, and `CategoryKicker` prints
 *    `categories[0]`: the more a category identifies the *subject* of
 *    an item, the higher it sits. Money and law are usually context,
 *    not subject, so `mercati` and `regolamentazione` sit low.
 * 2. **Keywords are matched as substrings against title + body**, so a
 *    short keyword can fire from the middle of an unrelated word.
 *    Leading/trailing spaces below are load-bearing guards against
 *    real collisions found in the corpus: ` rce` (vs. "source"),
 *    ` tpu` (vs. "output"), ` dma` (vs. "roadmap", "Friedman",
 *    "landmark"), `fab ` (vs. "fabbrica"), `cyber ` (vs. "Cybercab").
 *    Same reason for the stem-only entries (`sfruttat`, `investiment`,
 *    `hackerat`): they cover the inflections without swallowing
 *    lookalikes.
 *
 * Coverage is deliberately partial — roughly a fifth of the corpus
 * matches nothing and stays uncategorized, which is a valid outcome
 * (an item with no categories is filterable by source and date, as
 * before). Adding keywords to chase 100% is how a derived taxonomy
 * turns into noise.
 */
export const CATEGORY_RULES: CategoryRule[] = [
  {
    slug: "sicurezza",
    keywords: [
      "vulnerabilit",
      "zero-day",
      "zero day",
      "cve-",
      "cvss",
      " rce",
      "code execution",
      "exploit",
      "sfruttat",
      "malware",
      "ransomware",
      "backdoor",
      "supply chain",
      "phishing",
      "stealer",
      "botnet",
      "cisa",
      " patch",
      "cybersecurity",
      "cybercrime",
      "cyberattacc",
      "cyber ",
      "sicurezza informatica",
      "red-team",
      "prompt injection",
      "jailbreak",
      "breach",
      "wiper",
      "trojan",
      "spyware",
      "hackerat",
      "hacking",
      "attacco",
      "attaccant",
      "credenziali",
      "exfiltra",
    ],
  },
  {
    slug: "chip",
    keywords: [
      "chip",
      "gpu",
      " tpu",
      "semicondutt",
      "semiconductor",
      "nvidia",
      "tsmc",
      "asml",
      "euv",
      "hbm",
      "foundry",
      "silicio",
      "wafer",
      "litografia",
      "sk hynix",
      "micron",
      "fab ",
    ],
  },
  {
    slug: "data-center",
    keywords: [
      "data center",
      "datacenter",
      "gigawatt",
      "megawatt",
      "hyperscaler",
      "capacità di calcolo",
    ],
  },
  {
    slug: "robotica",
    keywords: [
      "robot",
      "umanoid",
      "guida autonoma",
      "veicoli autonomi",
      "drone",
      "boston dynamics",
    ],
  },
  {
    slug: "open-source",
    keywords: [
      "open source",
      "open sourc",
      "open-sourc",
      "open weight",
      "open weights",
      "open-weight",
      "pesi aperti",
      "floss",
      "software libero",
      "licenza mit",
      "apache 2",
    ],
  },
  {
    slug: "coding",
    keywords: [
      "coding agent",
      "cursor",
      "copilot",
      "claude code",
      "codex",
      "vibe coding",
      "pull request",
      "github",
      "gitlab",
      "npm",
      "pypi",
      "refactor",
      "compilatore",
      "kernel linux",
      "python",
      "javascript",
      "typescript",
      "mcp",
    ],
  },
  // Single keyword on purpose: as a substring it already covers
  // "agente", "agenti", "agentic" and "agents".
  { slug: "agenti", keywords: ["agent"] },
  {
    slug: "modelli",
    keywords: [
      "modello",
      "modelli",
      "llm",
      "chatbot",
      "foundation model",
      "model ",
      "models",
      "parametri",
      "mixture-of-experts",
      "moe",
      "addestrament",
      "fine-tuning",
      "inferenza",
      "benchmark",
      "training",
    ],
  },
  {
    slug: "regolamentazione",
    keywords: [
      "antitrust",
      " dma",
      "gdpr",
      "dsa",
      "sanzion",
      "regolament",
      "commissione europea",
      "unione europea",
      "parlamento ue",
      "congresso",
      "casa bianca",
      "senato",
      "class action",
      "tribunale",
      "giudice",
      "legal",
      "querela",
      "ftc",
      "fcc",
      "doj",
      "nhtsa",
      "normativ",
      "legislat",
      "divieto",
      "vieta",
      "bandire",
      "banna",
    ],
  },
  {
    slug: "mercati",
    keywords: [
      "miliard",
      "milioni di dollari",
      "milioni di euro",
      "dollari",
      "$",
      "acquisisc",
      "acquisizione",
      "borsa",
      "azionar",
      "azionist",
      "capitalizzazione",
      "valuation",
      "valutazione",
      "funding",
      "fundrais",
      "series a",
      "series b",
      "series c",
      "pre-money",
      "unicorn",
      "revenue",
      "fatturato",
      "trimestre",
      "investiment",
      "investe ",
      "investito",
      "quotat",
      "wall street",
      "hedge fund",
    ],
  },
  {
    slug: "ricerca",
    keywords: [
      "paper",
      "arxiv",
      "preprint",
      "congettura",
      "teorema",
      "peer review",
      "dimostrazione",
    ],
  },
];
