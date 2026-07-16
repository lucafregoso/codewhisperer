# Costituzione — CodeWhisperer

Principi non negoziabili. Ogni spec li eredita; ogni review li verifica.
Modificare questo file richiede l'approvazione esplicita di Luca.

## Contenuto

1. **Il markdown di Hermes è l'unica fonte di verità.** I file in `input/`
   non si modificano mai a mano e non si trasformano in formati intermedi:
   il parsing avviene a build time. Un file malformato rompe la build con
   un errore che indica file e riga — mai un'edizione pubblicata a metà.
2. **Tassonomia e fonti sono emergenti.** Nessun elenco fisso: categorie e
   fonti si scoprono dal corpus. Gli alias curati servono solo a
   normalizzare grafie doppie e aggregatori (pattern "via").
3. **L'edizione più recente è la homepage.** Determinata a build time dalla
   data massima estratta dall'H1 (mai dal filename).

## Interfaccia

4. **Il contenuto non dipende mai da JavaScript.** Ogni storia, radar item
   e nota di copertura è leggibile con JS disabilitato. JS solo come
   progressive enhancement.
5. **Scala tipografica chiusa.** Ogni font-size, colore e spaziatura di
   sistema vive in `src/styles/tokens.css`. Nessun literal nei componenti;
   aggiungere un token significa motivarlo nella spec.
6. **Base-path safety.** Ogni href/asset interno passa da `withBase()`:
   il sito funziona identico su dominio radice e su sottocartella Pages.
7. **Accessibilità e movimento.** axe pulito (WCAG 2.2 AA) in entrambi i
   temi; ogni animazione ha il fallback `prefers-reduced-motion`.
8. **Copy UI solo da `src/i18n/index.ts`** (struttura `activeLocales`
   pronta per altre lingue, oggi solo `it`). Mai stringhe hardcoded nei
   componenti.

## Processo

9. **Spec-Driven Development con gate umani.** Nessuna implementazione
   senza `requirements.md` e `design.md` approvati da Luca nella cartella
   `specs/NNN-slug/`. La review pre-merge è del reviewer-agent + Luca.
10. **Git flow.** `master` = ciò che è live (deploy da qui); `develop` =
    integrazione; `feature/NNN-slug` per ogni spec. Il contenuto (nuove
    edizioni in `input/`) può andare dritto su `master`: il drop giornaliero
    è la release giornaliera, la CI resta il gate.
11. **`pnpm gate` verde prima di ogni merge**: `check` + `test:unit` +
    `build` + `test` (Playwright, axe incluso).
12. **Le regressioni sono sacre.** Ogni bug reale diventa una voce di
    `tests/regressions.spec.ts` e non si cancella mai.
