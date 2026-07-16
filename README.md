# CodeWhisperer

Magazine statico in stile [Wired](https://www.wired.com/) per le rassegne
tech giornaliere scritte da **Hermes** (agente AI, locale + VPS).
Astro 5, tutto statico, deploy su GitHub Pages. L'edizione più recente è
sempre la homepage; archivio per data, filtri emergenti per fonte e
categoria, ricerca full-text Pagefind, RSS.

## Come funziona

```
Hermes ──(markdown)──▶ input/*.md ──(commit su master)──▶ CI ──▶ Pages
                            │
                    build Astro: custom loader
                    parsa e valida ogni rassegna
                    (file malformato = build rossa,
                     il sito non regredisce mai)
```

- `input/` — le rassegne markdown così come Hermes le produce, **unica
  fonte di verità**. Il contratto completo è in
  [docs/INGESTION.md](docs/INGESTION.md).
- La data si estrae dall'H1 (`# RubricAI — Edizione del 16 luglio 2026`),
  mai dal filename.
- Categorie e fonti sono **emergenti** dal corpus: nessun enum da
  mantenere, le pagine `/categoria/` e `/fonte/` si generano da ciò che
  esiste.

## Sviluppo

La shell di default ha node v12 — sempre nvm node 24:

```bash
export PATH="$HOME/.nvm/versions/node/v24.1.0/bin:$PATH"
pnpm install
pnpm dev          # dev server
pnpm gate         # check + unit (44) + build + e2e — IL gate pre-merge
```

Processo: **Spec-Driven Development** (`specs/`, costituzione inclusa),
subagent dedicati (`.claude/agents/`), git flow (`master` = live,
`develop` = integrazione, `feature/NNN-slug`). Istruzioni per gli agent
in [CLAUDE.md](CLAUDE.md).

## Pubblicare un'edizione

```bash
scripts/publish-edition.sh /percorso/rassegna.md            # valida + commit + push
scripts/publish-edition.sh /percorso/rassegna.md --dry-run  # solo validazione
```

## Setup GitHub (una tantum, manuale)

1. Creare il repo GitHub e aggiungere il remote:
   `git remote add origin git@github.com:USERNAME/codewhisperer.git`,
   poi `git push -u origin master develop`.
2. **Pages**: Settings → Pages → Source: *GitHub Actions*.
3. **Variabili** (Settings → Actions → Variables): `SITE_URL`
   (es. `https://USERNAME.github.io`) e `BASE_PATH`
   (es. `/codewhisperer/`; con custom domain: `/`).
4. **Deploy key per Hermes** (VPS): generare una chiave
   (`ssh-keygen -t ed25519 -f hermes_deploy`), aggiungerla in Settings →
   Deploy keys con *write access*, e configurarla nell'ssh-config del VPS.
5. **Branch protection** consigliata su `develop`: richiedere la CI verde
   sulle PR. `master` resta scrivibile dal publish script (il deploy
   stesso rivalida tutto).

## Struttura

| Percorso | Cosa |
|---|---|
| `input/` | Rassegne markdown di Hermes (contenuto) |
| `src/lib/parser/` | Parser puro testato (Vitest, 44 test) |
| `src/lib/editions-loader.ts` | Custom loader Astro su `input/` |
| `src/components/` | EditionLayout, StoryCard, RadarRail, … |
| `src/styles/tokens.css` | Design token (scala chiusa) |
| `specs/` | Costituzione + spec per feature (SDD) |
| `docs/INGESTION.md` | Contratto per Hermes |
| `tests/` | Playwright e2e (`tests/unit/` = Vitest) |
