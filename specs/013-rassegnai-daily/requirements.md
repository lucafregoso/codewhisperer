# 013 — Submodule rassegnai-daily · Requirements

## Contesto

Le rassegne nascono in un altro ambiente e vengono pushate su
github.com/lucafregoso/rassegnai-daily (privato, LFS per jpg/mp3).
Struttura: `editions/*.md` (formato RubricAI già noto) +
`editions/images/*.jpg` (cover `YYYY-MM-DD-hero.jpg` e per-storia
`-storyN.jpg`, referenziate con markdown standard `![alt](images/…)`
a path relativo) + `editions/podcast/*.mp3` (basename = edizione).
Il repo va montato come submodule dentro `input/`; a ogni modifica va
fatto pull e rigenerato il sito. `editions/` deve alimentare la
STESSA logica di generazione esistente.

## Criteri di accettazione

- `input/rassegnai-daily` è un submodule (URL https per la CI); il
  loader legge le edizioni sia da `input/*.md` (lane manuale) sia da
  `input/rassegnai-daily/editions/*.md`; date duplicate tra le due
  lane → errore di build (già garantito dalla mappa `seen`).
- Le righe-immagine markdown standalone sono contratto: quella dopo
  il TLDR è la cover dell'edizione; quelle nel corpo di una storia
  diventano `story.image` (la riga non resta mai nel body). La riga
  `**Immagine:**` resta valida (URL assolute).
- I path relativi (`images/x.jpg`) si risolvono in URL del sito
  (`/images/x.jpg` via withBase) e i file vengono serviti in dev e
  copiati in `dist/` alla build; un riferimento a un file inesistente
  rompe la build con un errore chiaro.
- Il podcast si risolve su entrambe le cartelle (`input/podcast/` e
  `editions/podcast/`), stesso matching per basename.
- Migrazione: le md e gli mp3 locali duplicati (12–17) vengono
  rimossi; la sorgente canonica è il subrepo (che porta anche il 18).
- Automazione: un workflow `content-sync` (cron ~30' +
  `repository_dispatch` + manuale) aggiorna il pointer del submodule;
  se cambia, committa su master e fa partire il deploy (il push con
  GITHUB_TOKEN non scatena workflow: il deploy va invocato via
  `workflow_dispatch`). CI e deploy fanno checkout con submodules e
  `git lfs pull` nel submodule.
- Vincolo di accesso: rassegnai-daily era privato; Luca ha scelto di
  renderlo PUBBLICO (fatto in corso d'opera), quindi i workflow usano
  il solo `github.token` — nessun secret da gestire. (Se mai tornasse
  privato: servirebbe un PAT che copra entrambi i repo, con write su
  codewhisperer per il push di content-sync.)
- I test restano corpus-agnostici (le dirs arrivano da un modulo
  condiviso, mai hardcoded nei singoli test); `pnpm gate` verde.

## Fuori scope

- Ottimizzazione/resize delle immagini (arrivano già 1024px).
- Rimozione della lane manuale `input/*.md` (resta per drop
  d'emergenza e per publish-edition.sh).
