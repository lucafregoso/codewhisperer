#!/usr/bin/env bash
# Pubblica un'edizione: valida → input/ → commit su master → push →
# back-merge su develop. Pensato per essere invocato da Hermes.
#
#   scripts/publish-edition.sh <file.md> [--dry-run]
#
# Il gate finale resta la CI di deploy: se qui qualcosa sfugge, la build
# su GitHub fallisce e il sito resta all'edizione precedente.
set -euo pipefail

export PATH="$HOME/.nvm/versions/node/v24.1.0/bin:$PATH"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FILE="${1:?Uso: publish-edition.sh <file.md> [--dry-run]}"
DRY_RUN="${2:-}"

cd "$REPO_ROOT"

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "ERRORE: working tree sporco — pubblicazione annullata." >&2
  exit 1
fi

# 1. Validazione col parser reale (stampa "YYYY-MM-DD — N storie…")
SUMMARY="$(node scripts/validate-edition.mjs "$FILE")"
DATE="${SUMMARY%% *}"
echo "Edizione valida: $SUMMARY"

if [[ "$DRY_RUN" == "--dry-run" ]]; then
  echo "Dry-run: mi fermo qui, repo intatto."
  exit 0
fi

# 2. Il drop entra in input/ (id = contenuto, il filename resta libero)
BASENAME="$(basename "$FILE")"
if [[ ! -f "input/$BASENAME" ]]; then
  cp "$FILE" "input/$BASENAME"
fi

# 2b. Podcast opzionale: un mp3 con lo stesso basename accanto al .md
#     viaggia nello stesso commit (docs/INGESTION.md §Podcast).
PODCAST_SRC="${FILE%.md}.mp3"
PODCAST_BASENAME=""
if [[ -f "$PODCAST_SRC" ]]; then
  PODCAST_BASENAME="$(basename "$PODCAST_SRC")"
  mkdir -p input/podcast
  if [[ ! -f "input/podcast/$PODCAST_BASENAME" ]]; then
    cp "$PODCAST_SRC" "input/podcast/$PODCAST_BASENAME"
  fi
  echo "Podcast trovato: input/podcast/$PODCAST_BASENAME"
fi

# 3. Il drop giornaliero È la release giornaliera (costituzione §10)
git checkout master
git add "input/$BASENAME"
if [[ -n "$PODCAST_BASENAME" ]]; then
  git add "input/podcast/$PODCAST_BASENAME"
fi
git commit -m "content: edizione $DATE"

if git remote get-url origin >/dev/null 2>&1; then
  git push origin master
else
  echo "Nessun remote 'origin': commit locale, push saltato."
fi

# 4. develop non resta indietro sul contenuto
git checkout develop
git merge --no-edit master
if git remote get-url origin >/dev/null 2>&1; then
  git push origin develop
fi
git checkout master

echo "Pubblicata: edizione $DATE (il deploy parte dal push su master)."
