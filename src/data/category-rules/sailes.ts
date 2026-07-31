import type { CategoryRule } from "../../lib/category-derivation";

/**
 * Derivation rules for the `sailes` instance (spec 016). Curated by
 * reading its own corpus (`input/sailes-daily/editions`, 11 editions /
 * 214 items as of 2026-07-31), with the same method used for
 * `rassegnai` but NOT the same vocabulary: sailes is a commercial
 * radar for a sales team, so what recurs here is public deadlines,
 * money moving, and who is buying — AI Act and Cyber Resilience Act
 * countdowns, Italian rounds and grants, M&A, telco and PA as buyers.
 * Nothing is shared with the rassegnai rule set on purpose: applying
 * those keywords here would tag almost everything `mercati` and leave
 * `chip` empty (constitution §2 — the taxonomy is emergent per corpus).
 *
 * Same two design constraints as the other instance:
 *
 * 1. **Array order is editorial priority** (`deriveCategories()` emits
 *    in declaration order, `CategoryKicker` prints `categories[0]`).
 *    Public money outranks private money — a Simest or voucher item is
 *    `incentivi` first, not `regolamentazione` or `funding` — and the
 *    subject of the news outranks its financial framing, which is why
 *    `trimestrali` and `adozione` sit low.
 * 2. **Keywords match as substrings on title + body**, so several
 *    entries carry load-bearing spaces or stems that guard against
 *    collisions found in this very corpus: ` bando` (vs. "abbandono"),
 *    ` opa`/`'opa` (vs. "Europa"), ` formazione` (vs.
 *    "trasformazione"), ` roi` (vs. "eroi"), `rileva ` (vs.
 *    "rilevante"), ` tim ` (vs. "ultimo", "stima"), ` bond` (vs.
 *    "abbondante"), `legge regionale`/`legge italiana` (vs. the verb
 *    "legge"). Dropped for the same reason: bare `arr` ("arrivano",
 *    "arranca"), bare `cede` ("succede", "concede"), bare `modello`
 *    (in this corpus it is usually "modello di business", not an AI
 *    model — hence the narrow `modelli` list below).
 *
 * Coverage is partial by design: ~15% of the corpus matches nothing
 * (space economy, single-company briefs) and stays uncategorized,
 * which is a valid outcome.
 */
export const CATEGORY_RULES: CategoryRule[] = [
  {
    slug: "incentivi",
    keywords: [
      "voucher",
      " bando",
      "bandi pubblici",
      "incentiv",
      "iperammortamento",
      "credito d'imposta",
      "agevolaz",
      "simest",
      "pnrr",
      "contributi",
      "transizione 5.0",
      "finanza agevolata",
      "sovvenzion",
      "sportello",
      "fondo perduto",
    ],
  },
  {
    slug: "regolamentazione",
    keywords: [
      "ai act",
      "cyber resilience act",
      "cybersecurity act",
      "digital markets act",
      "dma",
      "nis2",
      "gdpr",
      "data act",
      "digital omnibus",
      "commissione ue",
      "commissione europea",
      "normativ",
      "obblig",
      "conformità",
      "compliance",
      "linee guida",
      "vigilanza",
      "multa",
      "multe",
      "sanzion",
      "garante",
      "antitrust",
      "decreto",
      "alto rischio",
      "entra in vigore",
      "scadenza",
      "legge regionale",
      "legge italiana",
      "legge sull",
      "disegno di legge",
      "copyright",
      "settlement",
    ],
  },
  {
    slug: "acquisizioni",
    keywords: [
      "acquisisc",
      "acquisizion",
      " opa",
      "'opa",
      " ops",
      "'ops",
      "rileva ",
      "exit",
      "fusione",
      "buy and build",
      "delisting",
      "merger",
      "co-controllo",
    ],
  },
  {
    slug: "partnership",
    keywords: [
      "partnership",
      "joint venture",
      "alleanza",
      "accordo con",
      "intesa con",
      "collaborazione",
      "co-sviluppo",
    ],
  },
  {
    slug: "funding",
    keywords: [
      "raccogl",
      "round",
      "seed",
      "serie a",
      "serie b",
      "serie c",
      "series a",
      "series b",
      "series c",
      "valutazione",
      "valuation",
      "unicorn",
      "venture capital",
      "investitori",
      "investitore",
      "investe ",
      "cdp venture",
      "eic fund",
      "minibond",
      " bond",
      "finanziament",
      "pre-money",
      "fundrais",
      "business angel",
      "fondo",
      "fondi",
      "grant",
      "stealth",
    ],
  },
  {
    slug: "data-center",
    keywords: [
      "data center",
      "datacenter",
      "gigafactory",
      "supercalcolo",
      "capacità di calcolo",
      "gigawatt",
      "megawatt",
      "capex",
      "hyperscaler",
      "colocation",
    ],
  },
  {
    slug: "telco",
    keywords: [
      "telco",
      "poste-tim",
      "poste italiane-tim",
      "telecom italia",
      " tim ",
      "vodafone",
      "open fiber",
      "nokia",
      "fastweb",
      "operatori telefonici",
      "fibra",
      "5g",
    ],
  },
  {
    slug: "cybersecurity",
    keywords: [
      "cybersecurity",
      "cyber",
      "sicurezza informatica",
      "vulnerabilit",
      "ransomware",
      "phishing",
      "malware",
      "attacc",
      "breach",
      "hackerat",
      "zero-day",
      "threat",
    ],
  },
  {
    slug: "trimestrali",
    keywords: [
      "trimestr",
      "anno fiscale",
      "ricavi",
      "fatturato",
      "guidance",
      "yoy",
      "in utile",
      "utile netto",
      "risultati finanziari",
    ],
  },
  {
    slug: "adozione",
    keywords: [
      "adozion",
      " roi",
      "deployment",
      "enterprise",
      "use case",
      "produttività",
      "caso studio",
      "sondaggio",
      "pilot",
      "tool sprawl",
      "integrazione dati",
      "data governance",
      "ai governance",
    ],
  },
  {
    slug: "lavoro",
    keywords: [
      "posti di lavoro",
      "licenziament",
      "assunzion",
      "recruiting",
      "hiring",
      "competenze",
      "skill",
      " formazione",
      "lavorator",
      "dipendenti",
      "stipend",
      "retribu",
      "sindacat",
      "sciopero",
      "ristrutturazion",
      "talent",
    ],
  },
  {
    slug: "modelli",
    keywords: [
      "modello ai",
      "modelli ai",
      "modelli di ai",
      "modelli generalisti",
      "modelli linguistici",
      "guerra dei modelli",
      "llm",
      "open-weight",
      "open weight",
      "frontier",
      "inferenza",
    ],
  },
  // Single keyword on purpose: as a substring it already covers
  // "agente", "agenti", "agentic" and "agents".
  { slug: "agenti", keywords: ["agent"] },
  {
    slug: "pubblica-amministrazione",
    keywords: [
      "pubblica amministrazione",
      " pa ",
      "sovranità digitale",
      "it-wallet",
      "ministero",
      "agid",
      "consip",
      "cdm",
    ],
  },
];
