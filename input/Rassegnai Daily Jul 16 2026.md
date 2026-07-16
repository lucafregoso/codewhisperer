# RubricAI — Edizione del 16 luglio 2026

> Hyundai acquisisce la quota SoftBank e rende Boston Dynamics una controllata totale, Thinking Machines Lab lancia Inkling il primo modello open-weight da 975B parametri, OpenAI open-sourcela Grok Build dopo lo scandalo degli upload, e Microsoft addestra i venditori a parlare male di OpenAI e Anthropic.

## 🗞 In primo piano

### 1. Hyundai rende Boston Dynamics una controllata totale: acquisisce la quota SoftBank
Hyundai Motor Group ha annunciato l'intenzione di rendere Boston Dynamics una controllata interamente posseduta, acquisendo la quota di circa il 10% detenuta da SoftBank. Hyundai aveva già acquistato l'80% di Boston Dynamics nel 2021 per circa $1,1 miliardi. La mossa consolida il controllo della coreana sulla più nota azienda di robotica umanoide americana, in un momento in cui i robot umanoidi stanno entrando nella fase di commercializzazione industriale.
**Fonti:** [Techmeme (Reuters)](https://www.techmeme.com/260716/p2#a260716p2) — Hyundai acquisisce la quota SoftBank per rendere Boston Dynamics una controllata totale.

### 2. Thinking Machines Lab lancia Inkling: modello open-weight MoE da 975B parametri, 41B attivi
Thinking Machines Lab, la startup fondata dall'ex CTO di OpenAI Mira Murati, ha rilasciato il suo primo modello: Inkling, un MoE open-weight con 975B parametri totali e 41B attivi, che comprende tutte le modalità (immagine, audio, testo) con capacità agentiche e contesto di 1M token. A differenza dei modelli di punta di OpenAI e Anthropic ottimizzati per un'area specifica, Inkling è stato progettato per essere "ampio" piuttosto che specializzato. Il modello è disponibile su Hugging Face in versione BF16 e NVFP4 calibrata.
**Fonti:** [TechCrunch](https://techcrunch.com/2026/07/15/thinking-machines-amps-up-its-bet-against-one-size-fits-all-ai-with-its-first-open-model-inkling/) — Inkling come scommessa contro i modelli one-size-fits-all, 975B/41B attivi; [Hugging Face Blog](https://huggingface.co/blog/thinkingmachines-inkling) — dettagli tecnici: multimodale, agentic, contesto 1M, varianti BF16 e NVFP4; [Techmeme (Thinking Machines Lab)](https://www.techmeme.com/260715/p41#a260715p41) — conferma architettura MoE e posizionamento "ampio"; [Hacker News](https://thinkingmachines.ai/news/introducing-inkling/) — annuncio ufficiale.

### 3. xAI open-sourcela Grok Build dopo lo scandalo degli upload su Google Cloud
xAI ha rilasciato il codice del tool Grok Build con licenza Apache 2.0 dopo che lo strumento aveva generato una severa reazione della community per aver caricato le directory dei utenti sui bucket Google Cloud di xAI. Il problema era emerso quando un utente aveva segnalato che l'esecuzione del comando nella propria home directory aveva caricato SSH key, password manager e documenti privati. Simon Willison ha documentato la questione e analizzato il codice open-sourcelato, trovando un interessante renderer Mermaid-to-Unicode scritto in Rust all'interno del codebase.
**Fonti:** [Simon Willison](https://simonwillison.net/2026/Jul/15/grok-build/#atom-everything) — contesto del backlash, caricamento directory su GCS; [Techmeme (Simon Willison)](https://www.techmeme.com/260715/p52#a260715p52) — open-source sotto Apache 2.0 dopo l'incidente; [Simon Willison](https://simonwillison.net/2026/Jul/16/grok-mermaid/#atom-everything) — esplorazione del renderer Mermaid-to-Unicode nel codebase open-sourcelato.

### 4. Microsoft addestra i venditori a denigrare OpenAI, Google e Anthropic nelle vendite AI
Microsoft ha tenuto un meeting interno in cui ha delineato un piano per addestrare i propri salespeople a confrontare negativamente i prodotti AI di OpenAI, Google e Anthropic con le proprie offerte. La mossa segnala un'escalation nella competizione AI enterprise: Microsoft, che è anche partner e investitore di OpenAI, sta preparando il proprio team di vendita per posizionarsi direttamente contro i suoi alleati di un tempo. Il piano include confronti negativi su prodotti specifici e strategie di contrasto.
**Fonti:** [TechCrunch](https://techcrunch.com/2026/07/15/microsoft-is-reportedly-training-salespeople-to-talk-down-openai-and-anthropic/) — dettagli del meeting interno, piano di confronti negativi contro OpenAI, Google e Anthropic.

### 5. OpenAI lancia il Codex Micro: il primo hardware di OpenAI è un macropad da $230
OpenAI ha lanciato il suo primo dispositivo hardware marchiato: il Codex Micro, un macropad programmabile da $230 sviluppato in collaborazione con il produttore di tastiere Work Louder, dotato di tasti retroilluminati, una manopola rotativa e un piccolo joystick. Il dispositivo è progettato per integrarsi con l'AI coding assistant Codex, che ha raggiunto 9 milioni di utenti. Il lancio avviene mentre OpenAI è anche coinvolta in una battaglia legale con Apple su hardware e mentre circolano voci su un futuro dispositivo AI con Jony Ive.
**Fonti:** [TechCrunch](https://techcrunch.com/2026/07/15/amid-hardware-legal-battle-openai-releases-a-230-keyboard-for-codex/) — lancio del Codex Micro, collaborazione con Work Louder, contesto della battaglia legale con Apple; [The Verge](https://www.theverge.com/ai-artificial-intelligence/965901/openai-hardware-codex-micro-launch) — primo hardware marchiato OpenAI, specifiche del dispositivo; [Ars Technica](https://arstechnica.com/ai/2026/07/openais-first-branded-hardware-is-a-light-up-keyboard/) — dettagli: tasti RGB, manopola, joystick, contesto del dispositivo Ive; [The New Stack](https://thenewstack.io/openai-codex-micro-macropad/) — Codex raggiunge 9M utenti, macropad come nuova interfaccia.

### 6. Suno ha scrapeato milioni di canzoni da YouTube, Deezer e Genius per l'addestramento
Un hack ha rivelato che Suno, il generatore di musica AI, ha addestrato i suoi modelli scaricando milioni di canzoni e testi da YouTube Music, Deezer, Genius e librerie di stock music come Pond5, Jamendo e Freesound. I dati sono stati ottenuti tramite una supply chain attack che ha compromesso le credenziali di un dipendente. La rivelazione solleva ulteriori questioni legali per un'azienda già oggetto di cause per violazione del diritto d'autore.
**Fonti:** [404 Media](https://www.404media.co/hack-reveals-suno-ai-music-generator-scraped-youtube-deezer-and-genius/) — dettagli del hack, fonti dello scraping: YouTube Music, Deezer, Genius, Pond5, Jamendo; [The Verge](https://www.theverge.com/ai-artificial-intelligence/966072/suno-ai-music-training-scraping-youtube-hack) — conferma scraping milioni di canzoni; [TechCrunch](https://techcrunch.com/2026/07/15/hack-suggests-ai-music-generator-suno-scraped-youtube-for-training-data/) — supply chain attack, accesso credenziali dipendente.

### 7. xAI fa causa a un uomo per aver usato Grok per generare CSAM deepfake
xAI ha denunciato un cittadino del South Carolina, Terry Wayne Harwood, accusandolo di aver usato il chatbot Grok per generare materiale di abuso sessuale su bambini (CSAM) aggirando le safeguards del modello. La causa, riportata da Reuters, rappresenta uno dei primi casi in cui un'azienda AI denuncia un utente per aver generato contenuto illegale con il proprio modello, segnando un precedente nella lotta contro l'abuso degli strumenti AI generativi.
**Fonti:** [The Verge](https://www.theverge.com/ai-artificial-intelligence/966293/xai-grok-user-lawsuit-csam) — dettagli della causa contro Terry Wayne Harwood, aggiramento delle safeguards.

### 8. Linus Torvalds si pronuncia sull'uso degli LLM nello sviluppo del kernel Linux
In una email sulla mailing list del kernel, Linus Torvalds ha condiviso le proprie opinioni sull'uso dei Large Language Models nello sviluppo del kernel. La discussione è emersa nel contesto di un thread sulla qualità del codice e sull'accettazione di contributi generati con assistenza AI. La posizione di Torvalds è particolarmente rilevante dato il dibattito in corso sulla qualità e sicurezza del codice AI-generated nei progetti critici.
**Fonti:** [Lobste.rs](https://lore.kernel.org/linux-media/CAHk-=wi4zC+Ze8e+p3tMv8TtG_80KzsZ1syL9anBtmEh5Z40vg@mail.gmail.com/) — email originale di Torvalds sulla mailing list del kernel.

## 📡 Radar
- Sheetz migra 838 store da VMware a StorMagic: "Broadcom ha creato troppa incertezza" — [Ars Technica](https://arstechnica.com/information-technology/2026/07/sheetz-moves-838-stores-off-vmware-broadcom-created-too-much-uncertainty/)
- Elon Musk compra silenziosamente APR Energy per ~$1B, operatore di turbine gas simili a Colossus 2 — [Techmeme (Electrek)](https://www.techmeme.com/260715/p53#a260715p53)
- AI execs potenziano la sicurezza personale: minacce digitali contro dirigenti e data center cresciute 7x — [Techmeme (WSJ)](https://www.techmeme.com/260715/p54#a260715p54)
- GPT-Red: OpenAI dettaglia modello di automated red-teaming che scala la scoperta di vulnerabilità — [OpenAI News](https://openai.com/index/unlocking-self-improvement-gpt-red)
- Google Gemini CLI abusato come hacking agent da operatore di botnet malware — [BleepingComputer](https://www.bleepingcomputer.com/news/security/google-gemini-cli-abused-as-a-hacking-agent-malware-botnet-operator/)
- TuxBot v3: botnet IoT con codice sviluppato con assistenza LLM — [The Hacker News](https://thehackernews.com/2026/07/tuxbot-v3-evolution-shows-signs-of-llm.html)
- Anthropic, Blackstone e Hellman & Friedman lanciano "Ode", azienda di implementazione AI da $1,5B — [TechCrunch](https://techcrunch.com/2026/07/15/anthropic-blackstone-bet-the-next-trillion-dollar-ai-business-is-implementation-not-models/)
- OpenAI perde la disputa di marchio "OPENAI" presso il tribunale UE — [Hacker News](https://dpa-international.com/economics/urn:newsml:dpa.com:20090101:260715-930-389143/)
- FCC voting per abrogare il tetto del 39% sulle ownership TV: boost per broadcaster filo-Trump — [The Verge](https://www.theverge.com/policy/966283/fcc-broadcast-ownership-cap-brendan-carr)
- Giudice: Trump non può deportare ricercatori solo per lavoro in content moderation — [Ars Technica](https://arstechnica.com/tech-policy/2026/07/judge-trump-cant-deport-researchers-just-for-working-in-content-moderation/)
- Microsoft patcha un record di 622 vulnerabilità citando l'uso dell'AI per la scoperta — [TechCrunch](https://techcrunch.com/2026/07/15/microsoft-patches-record-number-of-security-vulnerabilities-citing-its-use-of-ai/)
- X open-sourcela l'intero codebase senza eccezioni, annuncia Musk — [The New Stack](https://thenewstack.io/x-open-source-codebase/)
- Progress conferma zero-day dietro il shutdown di ShareFile Storage Zones Controller — [SecurityWeek](https://www.securityweek.com/progress-confirms-zero-day-vulnerability-behind-sharefile-disruption/)

## 🐌 Dal feed lento
**"Linus Torvalds on LLM usage in kernel development"** dalla mailing list del kernel Linux. Non un articolo ma un intervento diretto di Torvalds in un thread sulla qualità del codice AI-generated nel kernel. Merita tempo perché la posizione di Torvalds definisce in pratica cosa è accettabile e cosa no nello sviluppo del kernel — e il kernel è il progetto open source più critico al mondo. — [Lobste.rs](https://lore.kernel.org/linux-media/CAHk-=wi4zC+Ze8e+p3tMv8TtG_80KzsZ1syL9anBtmEh5Z40vg@mail.gmail.com/)

## ✅ Nota di copertura
Fonti lette: 60/65. Irraggiungibili: Hacker News (front page, 100+ punti), Uber Engineering, CISA Advisories, Blef (Christophe Blefari), Chain of Thought (Every).
Item raccolti: 299; storie pubblicate: 21; scartati di proposito: 278.
Se non è qui, puoi ignorarlo.
