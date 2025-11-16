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

.electron-list {
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
Libreria JS per creare UI basate su componenti
-> https://react.dev/

---

## React – Quando usarlo
- UI complesse e dinamiche
- Componenti riutilizzabili
- Stato locale/globale

---

## React – Quando evitarlo
- Pagine statiche semplici
- SEO critico senza SSR

---

## React – Pro e Contro
**Pro**: Virtual DOM, ecosistema, TypeScript ready
**Contro**: toolchain obbligatoria, learning curve

---

## MongoDB – Cos’è
Database NoSQL orientato ai documenti JSON
-> https://www.mongodb.com/docs/

---

## MongoDB – Quando usarlo
- Schemi flessibili
- Dati annidati
- Rapid prototyping

---

## MongoDB – Quando evitarlo
- Dati relazionali complessi
- Transazioni multiple

---

## MongoDB – Pro e Contro
**Pro**: scalabile, schema-less, JSON-friendly
**Contro**: join manuali, storage maggiore

---

## Mongoose – Cos’è
ODM (Object Data Modeling) per **MongoDB** in ambiente **Node.js**
-> https://mongoosejs.com/docs/

---

## Mongoose – Quando usarlo
- Vuoi **schemi espliciti** sopra un database schema-less
- Hai molta **validazione** e regole di business lato backend
- Vuoi aggiungere **metodi custom** e middleware ai tuoi modelli

---

## Mongoose – Quando evitarlo
- Vuoi usare il **driver MongoDB nativo** senza astrazioni
- Progetto molto semplice, dove lo schema formale è superfluo
- Caso d’uso con **massime prestazioni** e minimo overhead

---

## Mongoose – Pro e Contro
**Pro**: schema chiaro, validazione integrata, middleware/hook, populate
**Contro**: livello di astrazione in più, learning curve, può vincolare il modello dati

---

## Come si incastrano tra loro
- **Electron + React**: UI desktop multipiattaforma con componenti riutilizzabili
- **MongoDB + Mongoose**: persistenza dati flessibile con schema e validazione
- Stack **JavaScript end‑to‑end**: client, backend e database parlano JSON/JS‑like
