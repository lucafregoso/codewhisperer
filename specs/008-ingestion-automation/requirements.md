# Spec 008 — Automazione ingestione Hermes

## Obiettivo

Hermes (in locale o dal VPS) pubblica un'edizione senza intervento umano:
drop in `input/`, validazione, commit su master, push → deploy. Il gate
resta la CI: un file rotto non arriva mai online.

## Criteri di accettazione

- Dato `scripts/publish-edition.sh <file.md>`, il file viene validato col
  parser reale; se invalido lo script esce con l'errore file:riga e il
  repo resta pulito.
- Se valido: il file entra in `input/`, commit su master
  (`content: edizione YYYY-MM-DD`), push (se il remote esiste),
  back-merge su develop.
- Con `--dry-run` lo script si ferma dopo la validazione.
- `docs/INGESTION.md` documenta il contratto completo (formato + script +
  deploy key) — è il documento da dare a Hermes.
- Il README documenta il setup GitHub (repo, Pages, variabili, deploy key)
  che solo Luca può eseguire.

## Fuori scope

Chiamate dirette all'API GitHub (repository_dispatch): si adotta il push
via deploy key, più semplice e già coperto dalla CI.
