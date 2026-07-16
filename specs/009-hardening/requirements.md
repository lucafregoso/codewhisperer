# Spec 009 — Hardening

## Obiettivo

Confidenza di produzione prima della prima release su master: review
integrale del reviewer-agent, fix dei bloccanti, hardening a costo zero,
documentazione completa.

## Criteri di accettazione

- La review del reviewer-agent (checklist di costituzione) non lascia
  bloccanti aperti.
- Zero stringhe UI hardcoded nei componenti (i18n completo).
- Il deploy da master esegue anche l'e2e (i content drop diretti su
  master restano completamente gated).
- Rendering markdown e JSON-LD induriti (escaping label/href, `<` nel
  JSON-LD).
- Spessori di sottolineatura tokenizzati (`--rule-weight`).
- README con architettura, comandi, setup GitHub/Pages/deploy key.
- `pnpm gate` verde; release `develop → master`.
