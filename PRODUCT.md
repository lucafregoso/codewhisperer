# Product

## Register

brand

## Users

Lettori tech italiani (sviluppatori, founder, security, policy-curious)
che ogni mattina vogliono la rassegna del giorno in 5 minuti — letta o
ascoltata (podcast). Skimmer per natura: decidono dal titolo se
approfondire la fonte. Luca è editore e primo lettore. Contesto d'uso:
colazione/commute, mobile e desktop, chiaro e scuro.

## Product Purpose

CodeWhisperer impagina come una testata quotidiana le rassegne markdown
prodotte da Hermes (agente esterno). L'edizione più recente è la
homepage; archivio per data, filtri per fonte/categoria, ricerca, RSS,
podcast. Successo = si torna ogni giorno, si scorre l'edizione con
piacere, si trova la storia in due secondi. Il contenuto è solo testo
(più audio): il design deve reggere il magazine senza fotografia.

## Brand Personality

**Tagliente · Denso · Quotidiano.** L'energia di una redazione, non la
calma di un blog. Voce da quotidiano di carta stampato in fretta e bene:
gerarchie nette, numeri di scala editoriale, un colore che è segnale.
Wired è il riferimento di densità ed energia, NON il modello da clonare:
palette e firme visive sono nostre.

## Anti-references

- **L'aggregatore RSS/feed reader**: lista piatta di item identici con
  link — l'anti-magazine.
- **Il blog minimal medium-like**: colonna singola centrata, aria
  ovunque, tipografia timida.
- **La dashboard SaaS**: card ovunque, ombre, icone decorative,
  gradienti — grammatica da prodotto, non da testata.
- **Il clone di Wired**: bianco/nero/rosso e griglia fotografica presi
  in prestito. L'ispirazione sì, il costume no.

## Design Principles

1. **La gerarchia è il prodotto.** Le storie sono una sequenza
   editoriale 1–8: il rango si deve VEDERE (scala, numero, anatomia
   diversa per fascia), mai otto blocchi uguali.
2. **Il colore è segnale, non decorazione.** Un accento di testata che
   marca ciò che si può fare o dove si è; mai sfondi decorativi a caso.
3. **La tipografia è la nostra fotografia.** Niente foto nel corpus: il
   peso, la scala e i glifi generati dal sistema fanno il lavoro delle
   immagini. (Il contratto Hermes resta pronto ad accogliere immagini
   future.)
4. **Densità da quotidiano.** Righe piene, regole nette, poca aria
   cerimoniale: il lettore skimma, il layout lo accompagna.
5. **Tutto funziona senza JavaScript.** Il contenuto e la lettura non
   dipendono mai da JS (costituzione §2); il movimento è rinunciabile.

## Accessibility & Inclusion

WCAG 2.2 AA verificata da axe in CI su entrambi i temi (chiaro/scuro).
Contrasto corpo ≥ 4.5:1. `prefers-reduced-motion` rispettato con
kill-switch globale. Navigazione completa da tastiera, skip link,
target touch ≥ 44px. Contenuto integralmente fruibile senza JavaScript.
