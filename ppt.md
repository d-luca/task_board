---
marp: true
paginate: true
---

<style>
section::after {
  content: attr(data-marpit-pagination);
  position: absolute;
  bottom: 16px;
  right: 24px;
  font-size: 0.75rem;
  color: #666;
}

.electron-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.8rem;
}

.electron-card {
  position: relative;
  flex: 1 1 30%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.1rem 0.7rem 0.6rem;
  font-size: 0.8rem;
}

.electron-card:nth-child(1) { border-color: #3b82f6; } /* blu */
.electron-card:nth-child(2) { border-color: #10b981; } /* verde */
.electron-card:nth-child(3) { border-color: #f59e0b; } /* arancione */
.electron-card:nth-child(4) { border-color: #ec4899; } /* rosa */
.electron-card:nth-child(5) { border-color: #8b5cf6; } /* viola */
.electron-card:nth-child(6) { border-color: #f97316; } /* arancio acceso */

.electron-card-title {
  position: absolute;
  top: 0;
  left: 0.7rem;
  padding: 0 0.3rem;
  transform: translateY(-50%);
  background: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  color: #333;
}

.electron-card:nth-child(1) .electron-card-title { color: #3b82f6; }
.electron-card:nth-child(2) .electron-card-title { color: #10b981; }
.electron-card:nth-child(3) .electron-card-title { color: #f59e0b; }
.electron-card:nth-child(4) .electron-card-title { color: #ec4899; }
.electron-card:nth-child(5) .electron-card-title { color: #8b5cf6; }
.electron-card:nth-child(6) .electron-card-title { color: #f97316; }

.electron-card-body {
  font-size: 0.8rem;
}

.electron-list,
.tech-list {
  font-size: 0.9rem;
}

.pros-cons {
  display: flex;
  gap: 1rem;
  margin-top: 0.8rem;
}

.pros-cons-column {
  flex: 1 1 50%;
  border-radius: 10px;
  padding: 0.8rem 1rem;
  font-size: 0.9rem;
}

.pros-column {
  background: #ecfdf5;
  border: 1px solid #10b981;
}

.cons-column {
  background: #fef2f2;
  border: 1px solid #ef4444;
}

.pros-cons-title {
  font-weight: 700;
  margin-bottom: 0.4rem;
}

.pros-cons ul {
  padding-left: 1.1rem;
  margin: 0;
}

.stack-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
  margin-top: 0.9rem;
}

.stack-card {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.7rem 0.9rem;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  font-size: 0.9rem;
}

.stack-card:nth-child(1) { border-left: 4px solid #3b82f6; }
.stack-card:nth-child(2) { border-left: 4px solid #0ea5e9; }
.stack-card:nth-child(3) { border-left: 4px solid #16a34a; }
.stack-card:nth-child(4) { border-left: 4px solid #f97316; }

.stack-logo {
  flex: 0 0 32px;
}

.stack-logo img {
  display: block;
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.stack-text-title {
  font-weight: 600;
  margin-bottom: 0.1rem;
}

.stack-text-sub {
  font-size: 0.8rem;
  color: #4b5563;
}
</style>

# Introduzione a Electron, React, MongoDB e Mongoose

Una breve panoramica di tecnologie per sviluppare applicazioni desktop moderne con React, gestione dei dati con database NoSQL, e distribuire applicazioni cross-platform utilizzando uno stack tecnologico unificato.

---

## Obiettivi della sessione
- Capire **cosa sono** Electron, React, MongoDB e Mongoose
- Capire **quando usarli** e **quando evitarli**
- Vedere come possono lavorare **insieme** in uno stack JavaScript end‑to‑end

---

## Stack in breve

<div class="stack-cards">
  <div class="stack-card">
    <div class="stack-logo">
      <img src="https://www.electronjs.org/assets/img/logo.svg" alt="Electron logo">
    </div>
    <div>
      <div class="stack-text-title">Electron</div>
      <div class="stack-text-sub">Container desktop cross‑platform basato su Chromium + Node.js.</div>
    </div>
  </div>
  <div class="stack-card">
    <div class="stack-logo">
      <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React logo">
    </div>
    <div>
      <div class="stack-text-title">React</div>
      <div class="stack-text-sub">Libreria a componenti per costruire la UI dell’applicazione.</div>
    </div>
  </div>
  <div class="stack-card">
    <div class="stack-logo">
      <img src="https://webassets.mongodb.com/_com_assets/global/mongodb-logo.png" alt="MongoDB logo">
    </div>
    <div>
      <div class="stack-text-title">MongoDB</div>
      <div class="stack-text-sub">Database NoSQL a documenti JSON/BSON per i dati dell’app.</div>
    </div>
  </div>
  <div class="stack-card">
    <div class="stack-logo">
      <img src="https://mongoosejs.com/docs/images/mongoose5_62x30_transparent.png" alt="Mongoose logo">
    </div>
    <div>
      <div class="stack-text-title">Mongoose</div>
      <div class="stack-text-sub">ODM che modella gli schemi e valida i dati su MongoDB.</div>
    </div>
  </div>
</div>

---

## Electron – Cos’è

<div class="electron-cards">
  <div class="electron-card">
    <div class="electron-card-title">Basato sul web</div>
    <div class="electron-card-body">
      Usa le tecnologie web che già conosci per costruire UI moderne.
    </div>
  </div>
  <div class="electron-card">
    <div class="electron-card-title">Multipiattaforma</div>
    <div class="electron-card-body">
      Le app Electron girano nativamente su <strong>macOS</strong>, <strong>Windows</strong> e <strong>Linux</strong> sulle architetture supportate.
    </div>
  </div>
  <div class="electron-card">
    <div class="electron-card-title">Open source per tutti</div>
    <div class="electron-card-body">
      Progetto <strong>open‑source</strong> sotto la <strong>OpenJS Foundation</strong>, mantenuto da una community attiva di contributor.
    </div>
  </div>
  <div class="electron-card">
    <div class="electron-card-title">Stabile</div>
    <div class="electron-card-body">
      Il Chromium integrato offre un target di rendering stabile con le ultime funzionalità della piattaforma web.
    </div>
  </div>
  <div class="electron-card">
    <div class="electron-card-title">Sicuro</div>
    <div class="electron-card-body">
      Le major release seguono Chromium, così ricevi rapidamente le <strong>patch di sicurezza</strong>.
    </div>
  </div>
  <div class="electron-card">
    <div class="electron-card-title">Estendibile</div>
    <div class="electron-card-body">
      Puoi usare qualunque pacchetto dall’ecosistema <strong>npm</strong> o scrivere add‑on nativi per estendere Electron.
    </div>
  </div>
</div>

Fonte: [electronjs.org](https://www.electronjs.org/)

---

## Electron – Quando usarlo
<div class="electron-list">

- **App desktop cross‑platform**: vuoi distribuire la stessa app su **macOS, Windows e Linux** partendo da un unico stack basato su HTML, CSS, JavaScript, Node.js e (se serve) codice nativo.
- **Prodotti enterprise / mission‑critical**: ti serve una piattaforma **affidabile, sicura, stabile e matura**, già usata da app come Slack, VS Code, ChatGPT, Notion e Docker.
- **Team con forte competenza web**: vuoi sfruttare l’ecosistema **web + npm** e riusare best practice su performance, sicurezza e UI del mondo browser.
- **App con update frequenti e sotto controllo**: vuoi rilasciare direttamente **fix di sicurezza e bugfix** grazie al bundle di Chromium e Node.js, senza dipendere dagli aggiornamenti del sistema operativo.
</div>

Fonte: [Why Electron](https://www.electronjs.org/docs/latest/why-electron)

---

## Electron – Quando evitarlo
<div class="electron-list">

- **Dispositivi / IoT a risorse molto limitate**: pochissima CPU e memoria (micro‑controllori, smartwatch, ecc.) → meglio framework ultra‑leggeri o codice nativo diretto sul display.
- **Footprint su disco molto ridotto**: le app Electron compresse sono spesso **80‑100 MB**; se lo spazio è un vincolo forte, conviene valutare soluzioni alternative.
- **UI quasi completamente native**: se vuoi costruire l’intera interfaccia con **WinUI, SwiftUI, AppKit**, in genere è più semplice sviluppare app completamente native per ogni OS.
- **Giochi / grafica 3D in tempo reale**: per titoli AAA o grafica 3D spinta è più adatto usare engine e framework nativi (es. **Unity, Unreal, DirectX/OpenGL**).
- **App native che incorporano solo un piccolo sito**: se ti serve solo un webview leggero in un’app principalmente nativa, è spesso meglio usare il webview dell’OS o soluzioni come ultralight.
</div>

Fonte: [Why Electron](https://www.electronjs.org/docs/latest/why-electron)

---

## Electron – Pro e Contro

<div class="pros-cons">
  <div class="pros-cons-column pros-column">
    <div class="pros-cons-title">Pro ⚡</div>
    <ul>
      <li><strong>Ecosistema npm enorme</strong>: puoi riusare librerie e tool del mondo Node.js.</li>
      <li><strong>Riuso skill web</strong>: HTML, CSS, JavaScript e framework come React.</li>
      <li><strong>API di sistema</strong>: accesso a funzionalità native tramite il main process e moduli Node.</li>
      <li><strong>Cross‑platform</strong>: una sola codebase per macOS, Windows e Linux.</li>
    </ul>
  </div>
  <div class="pros-cons-column cons-column">
    <div class="pros-cons-title">Contro ⚠️</div>
    <ul>
      <li><strong>Bundle pesante</strong>: app spesso nell’ordine di ~80‑100MB o più.</li>
      <li><strong>Uso di memoria superiore</strong>: ogni app porta con sé Chromium e Node.js.</li>
      <li><strong>Non ideale per casi ultra‑performance</strong>: giochi AAA, grafica 3D estrema, IoT molto limitato.</li>
    </ul>
  </div>
</div>

---

## React – Cos’è

React è una **libreria JavaScript per costruire interfacce utente**.
Permette di descrivere la UI in modo **dichiarativo**, componendo piccole unità riutilizzabili (componenti) che si aggiornano in base allo **stato** dell’applicazione, così da rendere il codice più prevedibile e facile da testare.
La filosofia ufficiale è “**UI = f(state)**”: ti concentri su come la UI dovrebbe apparire per ogni stato, e React si occupa di aggiornare il DOM in modo efficiente.
-> https://react.dev/

---

## React – Quando usarlo
<div class="tech-list">

- **UI complesse e dinamiche**: molte viste e interazioni (form ricchi, dashboard, app data‑driven) con stato che cambia spesso nel tempo.
- **Componenti riutilizzabili**: creazione di design system e librerie di componenti condivisi tra team e progetti (“build encapsulated components that manage their own state” – [React docs](https://react.dev/)).
- **Applicazioni a lungo ciclo di vita**: progetti che evolvono nel tempo, dove la manutenibilità del codice UI diventa critica.
- **Gestione di stato locale/globale**: quando serve orchestrare lo stato tra molte parti dell’interfaccia, sfruttando state, context e librerie di state management dell’ecosistema React.
- **Team già dentro l’ecosistema JS**: quando vuoi integrare facilmente tooling moderno (TypeScript, bundler, test, linting) in una codebase front‑end strutturata.
</div>

---

## React – Quando evitarlo
<div class="tech-list">

- **Pagine statiche molto semplici**: mini‑siti vetrina o contenuti quasi mai aggiornati, dove HTML/CSS statico o un semplice static site generator bastano.
- **SEO critico senza SSR/SSG**: se non puoi usare tecniche come SSR/SSG (es. Next.js, Remix) e dipendi molto dai crawler tradizionali, una SPA client‑side pura può penalizzare l’indicizzazione.
- **Vincoli forti su bundle e runtime JS**: contesti con pochissimo JavaScript consentito (es. email, alcune integrazioni embedded) dove una libreria client‑side non è adatta.
- **Team non familiari con tool moderni**: se non puoi introdurre bundler, transpiler e tooling tipici dell’ecosistema React, potresti preferire soluzioni più leggere.
</div>

---

## React – Pro e Contro

<div class="pros-cons">
  <div class="pros-cons-column pros-column">
    <div class="pros-cons-title">Pro ⚛️</div>
    <ul>
      <li><strong>Virtual DOM</strong>: aggiornamenti efficienti della UI sulla base dello stato.</li>
      <li><strong>Componenti riutilizzabili</strong>: facilita design system e manutenzione.</li>
      <li><strong>Ecosistema enorme</strong>: router, state management, tooling, integrazione con TypeScript.</li>
      <li><strong>Community matura</strong>: tanta documentazione, pattern e best practice.</li>
    </ul>
  </div>
  <div class="pros-cons-column cons-column">
    <div class="pros-cons-title">Contro ⚠️</div>
    <ul>
      <li><strong>Toolchain necessaria</strong>: bundler, dev server, configurazioni (anche se spesso scaffolding automatico).</li>
      <li><strong>Learning curve</strong>: JSX, hooks, gestione dello stato possono richiedere tempo.</li>
      <li><strong>Ecosistema in rapido movimento</strong>: librerie e best practice evolvono spesso.</li>
    </ul>
  </div>
</div>

---

## MongoDB – Cos’è
MongoDB è un **database NoSQL orientato ai documenti**: memorizza i dati in documenti JSON/BSON con **schema flessibile**, pensato per scalare in larghezza e per dare ai team di sviluppo grande agilità.
La documentazione lo descrive come un “document database” progettato per applicazioni moderne che richiedono **alta disponibilità**, **scalabilità orizzontale** e un modello dati naturale per gli oggetti delle applicazioni.
-> https://www.mongodb.com/docs/

---

## MongoDB – Quando usarlo
<div class="tech-list">

- **Schemi flessibili**: domini in cui la struttura dei dati cambia spesso o non è rigidamente definita; il modello a documenti riduce la necessità di migrazioni schema complesse.
- **Dati annidati e complessi**: oggetti con sotto‑documenti, array e strutture gerarchiche che si mappano bene in un singolo documento (es. ordini con righe ordine, profili utente con preferenze).
- **Applicazioni cloud‑native / scalabili**: quando servono **scalabilità orizzontale** (sharding), replica e alta disponibilità in cluster distribuiti.
- **Sviluppo rapido**: progetti in cui vuoi iterare velocemente, prototipare e modificare la struttura dei dati man mano che il dominio si chiarisce.
</div>

---

## MongoDB – Quando evitarlo
<div class="tech-list">

- **Dati fortemente relazionali**: molti join complessi tra entità (tipico di ERP, contabilità, domini molto normalizzati) dove un RDBMS tradizionale è più naturale.
- **Transazioni complesse multi‑documento**: casi con numerose operazioni che devono essere sempre atomiche al 100% (sebbene MongoDB supporti transazioni ACID, il modello relazionale rimane più adatto in scenari fortemente transazionali).
- **Reporting SQL‑heavy**: quando il team e gli strumenti sono centrati su SQL tradizionale e query analitiche complesse direttamente sul database operazionale.
</div>

---

## MongoDB – Pro e Contro

<div class="pros-cons">
  <div class="pros-cons-column pros-column">
    <div class="pros-cons-title">Pro 🍃</div>
    <ul>
      <li><strong>Schema flessibile</strong>: facile adattarsi a nuove esigenze di business.</li>
      <li><strong>Scalabilità orizzontale</strong>: replica e sharding per grandi volumi di dati.</li>
      <li><strong>JSON‑friendly</strong>: integrazione naturale con JavaScript/Node.js e formati JSON.</li>
    </ul>
  </div>
  <div class="pros-cons-column cons-column">
    <div class="pros-cons-title">Contro ⚠️</div>
    <ul>
      <li><strong>Join manuali</strong>: relazioni complesse richiedono aggregazioni e lookup più verbosi.</li>
      <li><strong>Storage maggiore</strong>: i documenti possono occupare più spazio rispetto a strutture relazionali normalizzate.</li>
      <li><strong>Consistenza eventuale</strong>: in alcuni setup distribuiti va gestita con attenzione.</li>
    </ul>
  </div>
</div>

---

## Mongoose – Cos’è
Mongoose è una libreria di **Object Data Modeling (ODM)** per MongoDB in ambiente **Node.js**.
Fornisce una soluzione basata su **schemi** per modellare i dati, con funzionalità integrate di **casting dei tipi, validazione, costruzione di query, middleware (hook)** e utility per lavorare con un database a documenti in modo più strutturato.
È pensato per fare da “collante” tra il modello a oggetti della tua applicazione Node.js e i documenti MongoDB.
-> https://mongoosejs.com/docs/

---

## Mongoose – Quando usarlo
<div class="tech-list">

- Stai costruendo un’applicazione **Node.js che usa MongoDB** e vuoi un livello di modellazione più ricco rispetto al driver nativo.
- Vuoi **schemi espliciti** sopra un database schema‑less per avere struttura, tipi e regole di validazione centralizzate.
- Hai molta **logica di business legata al ciclo di vita dei dati** (es. prima/dopo il salvataggio) che vuoi incapsulare in middleware/hook.
- Vuoi definire **metodi custom** sui modelli (instance & static methods) e plugin riutilizzabili per cross‑cutting concerns (audit, soft delete, ecc.).
</div>

---

## Mongoose – Quando evitarlo
<div class="tech-list">

- Vuoi usare il **driver MongoDB nativo** per avere pieno controllo sulle query e zero overhead di astrazione.
- Progetto molto semplice o script monouso, dove introdurre schemi e modelli formali aggiunge solo complessità.
- Casi d’uso con **requisiti di prestazioni estremi** e profiling molto spinto, dove ogni millisecondo conta e vuoi evitare strati intermedi.
</div>

---

## Mongoose – Pro e Contro

<div class="pros-cons">
  <div class="pros-cons-column pros-column">
    <div class="pros-cons-title">Pro 🧩</div>
    <ul>
      <li><strong>Schema chiaro</strong>: modella esplicitamente le collezioni MongoDB.</li>
      <li><strong>Validazione integrata</strong>: regole sui campi prima del salvataggio.</li>
      <li><strong>Middleware / hook</strong>: logica condivisa su eventi (save, update, remove, ecc.).</li>
      <li><strong>Populate</strong>: gestione più comoda delle relazioni tra documenti.</li>
    </ul>
  </div>
  <div class="pros-cons-column cons-column">
    <div class="pros-cons-title">Contro ⚠️</div>
    <ul>
      <li><strong>Layer di astrazione in più</strong>: un po’ di overhead rispetto al driver nativo.</li>
      <li><strong>Learning curve</strong>: schema, hook, populate e plugin richiedono tempo per essere padroneggiati.</li>
      <li><strong>Vincolo sul modello dati</strong>: gli schemi possono diventare rigidi se il dominio evolve spesso.</li>
    </ul>
  </div>
</div>

---

## Come si incastrano tra loro
- **Electron + React**: UI desktop multipiattaforma con componenti riutilizzabili
- **MongoDB + Mongoose**: persistenza dati flessibile con schema e validazione
- Stack **JavaScript end‑to‑end**: client, backend e database parlano JSON/JS‑like
