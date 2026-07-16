# RubricAI — Edizione del 12 luglio 2026

> Anthropic allunga Fable 5 per l'ennesima volta, i modelli AI si scontrano su prezzo, e gli sviluppatori open-source vengono sommersi di PR generate dai bot.

## 🗞 In primo piano

### 1. Claude Fable 5 prorogato al 19 luglio: Anthropic cerca tempo contro la guerra dei prezzi
Anthropic ha esteso per la terza volta l'accesso a Claude Fable 5 nei piani a pagamento, spostando la scadenza al 19 luglio. Gli abbonati Pro, Max, Team ed Enterprise possono usare Fable 5 fino al 50% del limite settimanale, con i limiti di Claude Code innalzati del 50%. La proroga arriva mentre OpenAI, Meta e SpaceXAI spingono sull'efficienza dei costi: Bloomberg segnala che i clienti enterprise scrutinizzano sempre più le spese AI, e i tre concorrenti potrebbero mettere Anthropic in difficoltà proprio sul fronte prezzo. Simon Willison nota che GPT-5.6 Sol è "chiaramente un modello di classe Fable/Mythos" e che l'incertezza sull'accesso a Fable sta costando ad Anthropic utenti verso OpenAI.
**Fonti:** [Simon Willison](https://simonwillison.net/2026/Jul/12/bump/#atom-everything) — analisi del perché Anthropic continua a prorogare e confronto con GPT-5.6; [BleepingComputer](https://www.bleepingcomputer.com/news/artificial-intelligence/claude-fable-5-stays-free-for-paid-users-until-july-19-as-anthropic-buys-more-time/) — dettagli tecnici della proroga; [Techmeme](https://www.techmeme.com/260712/p7#a260712p7) — The Economic Days conferma l'estensione; [Techmeme](https://www.techmeme.com/260712/p8#a260712p8) — Bloomberg sulla pressione competitiva di OpenAI/Meta/SpaceXAI; [The New Stack](https://thenewstack.io/openai-spacexai-meta-price-war/) — le tre aziende hanno trasformato l'AI in una guerra al ribasso sul prezzo.

### 2. Gli strumenti di AI coding stanno allagando l'open source
Il Financial Times riferisce che gli utenti di tool di coding AI stanno inondando i progetti open-source con contributi di bassa qualità, travolgendo i maintainer e potenzialmente erodendo il coinvolgimento comunitario. Il problema si intreccia con un dato: l'85% degli sviluppatori indica la code review come nuovo collo di bottiglia, e la narrativa dell'AI coding ne sottovaluta l'impatto. A peggiorare le cose, ricercatori hanno dimostrato "Ghostcommit": una PR con prompt injection nascosto in un'immagine PNG che inganna i revisori AI, rubando i secret del repository.
**Fonti:** [Techmeme](https://www.techmeme.com/260712/p5#a260712p5) — FT sull'impatto sui maintainer open-source; [The New Stack](https://thenewstack.io/merge-gate-coding-agents/) — code review come nuovo collo di bottiglia (dati sondaggio); [BleepingComputer](https://www.bleepingcomputer.com/news/security/ghostcommit-hides-prompt-injection-in-images-to-fool-ai-agents-steal-secrets/) — Ghostcommit: prompt injection in immagini PNG contro AI reviewer.

### 3. Apple prepara M7 con NPU potenziata, M7 Ultra con 1.5TB di RAM, M8 per il 2028
Mark Gurman su Bloomberg rivela la roadmap chip di Apple: M7 è già in fase di tape-out con aggiornamenti significativi all'NPU, M7 Ultra supporterà 1.5TB di RAM, ed M8 è previsto per il 2028. The Verge collega questa evoluzione al programma di auto a guida autonoma di Apple, mai decollato ma che ha spinto l'azienda a sviluppare capacità di AI on-device ora ereditate dai chip consumer.
**Fonti:** [Techmeme](https://www.techmeme.com/260712/p6#a260712p6) — Gurman/Bloomberg: roadmap completa M7/M7 Ultra/M8; [The Verge](https://www.theverge.com/tech/964519/apple-silicon-self-driving-car-ai-m7-ultra) — come il progetto auto abortito ha generato la potenza AI dei chip Apple.

### 4. La causa Apple-OpenAI rischia di bloccare le ambizioni hardware di OpenAI per anni
Apple ha fatto causa a OpenAI dopo l'assunzione di un ingegnere iPhone passato alla divisione hardware della startup. Secondo Mark Gurman, la causa segue mesi di tensioni crescenti e mette in luce i rapporti tesi fra Tang Tan (chief hardware di OpenAI) e il ex-boss John Ternus di Apple. M.G. Siegler su Spyglass suggerisce che una sentenza favorevole ad Apple potrebbe bloccare definitivamente le ambizioni hardware di OpenAI.
**Fonti:** [Techmeme](https://www.techmeme.com/260711/p9#a260711p9) — Siegler/Spyglass: la causa potrebbe bloccare OpenAI per anni; [Techmeme](https://www.techmeme.com/260711/p8#a260711p8) — Gurman/Bloomberg: tensioni interne e rapporti Tan-Ternus.

### 5. Cosa raccontano davvero i CLI dei coding agent: exfiltrazione xAI e overhead di token
Un'analisi wire-level di cereblab mostra cosa trasmette il CLI di xAI Grok build ai server xAI durante l'uso, sollevando questioni di privacy e sicurezza. Contestualmente, un confronto diretto tra Claude Code e OpenCode sullo stesso modello rivela che Claude Code invia 33k token prima ancora di leggere il prompt, contro i 7k di OpenCode: un overhead significativo che impatta costi e latenza.
**Fonti:** [Hacker News](https://gist.github.com/cereblab/dc9a40bc26120f4540e4e09b75ffb547) — teardown wire-level del Grok CLI di xAI; [Hacker News](https://systima.ai/blog/claude-code-vs-opencode-token-overhead) — misura diretta del overhead di token Claude Code vs OpenCode.

### 6. geohot: "Amo i LLM, odio l'hype"
George Hotz (commaai) pubblica un post inequivocabile: è "giddy" sull'AI e sui progressi dei LLM, dei veicoli autonomi e dei coding agent — ha installato opencode con GLM-5.2 e il "Year of the Linux Desktop è finalmente arrivato". Ma attacca ferocemente chi	propaga la paura di "finestre che si chiudono", "sottoclassi permanenti" o il salto dal "fancy autocomplete" al "possedere l'intero cono di luce". La sua tesi: l'AI è la continuazione della rivoluzione del computer, e le valutazioni dei frontier labs sono gonfiate perché non potranno catturare il valore che l'AI creerà.
**Fonti:** [Hacker News](https://geohot.github.io//blog/jekyll/update/2026/07/12/i-love-llms.html) — post completo di geohot.

### 7. L'opposizione all'AI cresce: dal movimento bay area alle proteste di Lorde
Il WSJ descrive il movimento anti-AI nella Bay Area in crescita, segnato dalla scomparsa di Sam Kirchner, cofondatore di un gruppo attivista radicale. Separatamente, Lorde ha attaccato i Ray-Ban Meta AI glasses dal palco del Real Cool Festival di Madrid ("Fuck the glasses. Don't get the glasses. Not sexy."), e The Verge dedica un lungo pezzo alla crescente resistenza ai data center AI negli Stati Uniti.
**Fonti:** [Techmeme](https://www.techmeme.com/260712/p4#a260712p4) — WSJ: il movimento anti-AI e la scomparsa di Kirchner; [The Verge](https://www.theverge.com/ai-artificial-intelligence/964539/lorde-says-ray-ban-meta-ai-glasses-are-not-sexy) — Lorde contro gli smart glasses; [The Verge](https://www.theverge.com/column/963346/ai-data-centers-fight) — la lotta contro i data center AI è solo all'inizio.

### 8. Boko Haram usa chatbot AI per progettare esplosivi
Il New York Times riferisce che membri del gruppo estremista Boko Haram stanno usando chatbot AI per progettare esplosivi, riparare armi e ideare attacchi. La ricerca segnala che i chatbot AI non sono più solo strumenti di propaganda per gruppi violenti, ma stanno attivamente supportando la costruzione di bombe e la pianificazione di attacchi.
**Fonti:** [Techmeme](https://www.techmeme.com/260711/p5#a260711p5) — NYT: Boko Haram usa chatbot AI per costruzione di bombe.

## 📡 Radar
- Terence Tao prova i coding agent per costruire app matematiche vecchie e nuove — [Hacker News](https://terrytao.wordpress.com/2026/07/11/old-and-new-apps-via-modern-coding-agents/)
- Cloudflare trova e corregge una race condition in hyper (HTTP/1 Rust) che troncava silenziosamente risposte grandi — [InfoQ](https://www.infoq.com/news/2026/07/cloudflare-hyper-bug-fix/)
- "Brain": l'AI interna di Azure che decide quando il servizio è ufficialmente down — [The New Stack](https://thenewstack.io/inside-azure-brain/)
- Microsoft si unisce a Google nel supportare Go per gli agenti AI; OpenAI e Anthropic restano indietro — [The New Stack](https://thenewstack.io/microsoft-agent-framework-go/)
- Le API non sono morte: dove si colloca MCP rispetto a loro — [The New Stack](https://thenewstack.io/api-vs-mcp-incident-management/)
- Malware Android RedHook ora sfrutta il Wireless ADB per ottenere shell access — [BleepingComputer](https://www.bleepingcomputer.com/news/security/redhook-android-malware-now-uses-wireless-adb-for-shell-access/)
- jscrambler 8.14.0 su npm compromesso: installa un infostealer Rust al setup — [The Hacker News](https://thehackernews.com/2026/07/compromised-jscrambler-8140-npm-release.html)
- RCE non autenticato nel router Motorola MR2600 — [Lobste.rs](https://mrbruh.com/motorola/)
- Hacking Apple: da SQL injection a Remote Code Execution — [Lobste.rs](https://projectdiscovery.io/blog/hacking-apple-with-sql-injection)
- InfiniteDiffusion: generazione infinita di terrain con diffusion model su GPU consumer — [Lobste.rs](https://xandergos.github.io/terrain-diffusion/)
- "Slow Software": il caso per lo sviluppo di sistemi ad alta latenza — [Lobste.rs](https://www.sigops.org/2026/slow-software-the-case-for-high-latency-systems-development/)
- The Proportional Web: un manifesto tipografico per il web — [Lobste.rs](https://owickstrom.github.io/the-proportional-web/)
- UE prepara nuove regole digitali contro le trappole di spesa online — [Techmeme](https://www.techmeme.com/260712/p1#a260712p1)
- Un agent in 100 righe di Lisp — [Lobste.rs](https://thebeach.dev/posts/lisp-agent/)
- Anthropic nomina UST come secondo Global Premier Partner: 20.000 persone da formare su Claude — [The New Stack](https://thenewstack.io/ust-anthropic-enterprise-ai-stack/)

## 🐌 Dal feed lento
**"6 mesi da vivere per i modelli open"** di Nathan Lambert (Interconnects). Lambert analizza lasfida più seria finora alla sopravvivenza dei modelli AI open source: le retoriche anti-open-source hanno ora analoghi concreti nelle policy enforcement, e il movimento si sta intensificando. Pezzo lungo e denso, merita una lettura attenta per chi segue il dibattitto open vs closed in AI. — [Interconnects](https://www.interconnects.ai/p/6-months-to-live-for-open-models)

## ✅ Nota di copertura
Fonti lette: 52/56. Irraggiungibili: Uber Engineering, CISA Advisories, Blef (Christophe Blefari), Chain of Thought (Every).
Item raccolti: 93; storie pubblicate: 24; scartati di proposito: 69.
Se non è qui, puoi ignorarlo.