# Glossario — CodeWhisperer

Vocabolario canonico lato impaginazione. Il glossario della filiera a monte
(profili, kit, apply) vive nel repo EdicolAI.

- **Edizione** — il markdown giornaliero di una rassegna
  (`editions/YYYY-MM-DD.md`); la data si legge dall'H1, mai dal filename.
- **Magazine (istanza)** — una build di questo repo che impagina il corpus
  di un profilo RassegnAI, servita a `/codewhisperer/<slug>/`. Eccezione
  storica: l'istanza `rassegnai` vive alla root `/codewhisperer/`.
- **Slug** — il nome unico che attraversa la filiera: profilo Hermes
  `<slug>` → repo contenuti `<slug>-daily` → submodule `input/<slug>-daily`
  → magazine `/codewhisperer/<slug>/`.
- **RassegnAI** — il sistema esterno che genera le rassegne (profili Hermes
  orchestrati da EdicolAI). Nome canonico: sostituisce il vecchio
  "RubricAI".
- **EdicolAI** — il control plane esterno (repo dedicato) che gestisce i
  profili e coordina la filiera; per questo repo è solo un vicino di
  contratto: ciò che conta qui è `docs/INGESTION.md`.
- **Testata** — il nome nell'H1 dell'edizione (`# <Testata> — Edizione del
  <data>`): libero per il parser, deciso dall'identità del profilo.
- **Corpus** — l'insieme delle edizioni di un'istanza; categorie e fonti
  sono emergenti dal corpus (costituzione §2).
