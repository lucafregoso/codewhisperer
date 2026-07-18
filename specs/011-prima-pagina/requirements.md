# 011 — Prima pagina a ranghi · Requirements

## Contesto

Il layout attuale è corretto ma non da magazine: hero sproporzionato,
storie 2-8 tutte uguali (3-up di card fotocopiate), zero colore in
pagina (gli accent per categoria non compaiono finché Hermes non
categorizza), navigazione tra edizioni solo a fondo pagina. Direzione
approvata da Luca: identità propria (non clone di Wired), accento
"arancio segnale", gerarchia a ranghi, stamp generativi al posto della
fotografia. PRODUCT.md è la base strategica.

## User stories

1. Come lettore, entro due secondi capisco qual è la storia del giorno
   e quante altre ce ne sono (rango visivo, non otto blocchi uguali).
2. Come skimmer, scorro le storie 4-8 come un indice denso da
   quotidiano e apro la fonte che mi interessa.
3. Come lettore abituale, salto all'edizione di ieri dalla testata,
   senza scrollare fino in fondo.
4. Come lettore, percepisco una testata con un colore suo (l'arancio
   segnale), non un documento in bianco e nero.

## Criteri di accettazione

- La homepage mostra tre anatomie distinte: hero (rango 1), lead
  (2-3), indice denso (4-8+). Ogni storia espone il proprio numero
  di sequenza.
- L'accento --signal compare in: numerali, marker di sezione, hover
  dei link, banda Radar, attribuzioni. AA verificato (axe, entrambi
  i temi): testo piccolo ≥4.5:1, display ≥3:1.
- Ogni storia ha uno stamp SVG deterministico derivato dallo slug
  (stesso slug → stesso stamp, per sempre), generato a build time,
  senza JS runtime né asset esterni.
- La testata dell'edizione offre link diretti a edizione precedente/
  successiva (etichettati con la data, in alto), oltre alla nav di
  fondo pagina esistente.
- Le fonti nelle storie diventano una riga discreta; l'attribuzione
  "via" resta visibile.
- Nessun hook dei test cambia: .edition-header, .edition-date,
  .story, .story--hero, .story-title (id anchor), .radar, .coverage,
  .edition-nav-link (solo fondo pagina), audio.podcast-audio dentro
  .edition-header, .source-badge.
- Tutto funziona senza JavaScript; reduced-motion rispettato;
  `pnpm gate` verde.

## Fuori scope

- Rendering di immagini per storia (il contratto INGESTION viene
  esteso su carta; l'implementazione arriva quando Hermes le emette).
- Redesign delle pagine archivio/fonte/categoria/cerca (ereditano i
  token nuovi; interventi mirati solo se il gate lo richiede).
- Motion di ingresso orchestrata (il brand sceglie la sobrietà; gli
  hover sono l'interazione).
