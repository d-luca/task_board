## Part 2 – Practical Implementation

Descrizione approfondita di come lo stack Electron + React + MongoDB + Mongoose è stato implementato nel progetto `task_board`, seguendo la scaletta della Parte 2.

---

## Electron Deep Dive

Nella [documentazione ufficiale](https://www.electronjs.org/) e nella sezione [Why Electron](https://www.electronjs.org/docs/latest/why-electron), Electron è presentato come il framework per creare **app desktop multipiattaforma** combinando web stack e codice nativo, particolarmente adatto a prodotti “enterprise‑grade” che richiedono integrazione profonda con l’OS, aggiornamenti frequenti e un’unica codebase per macOS/Windows/Linux.
Questo progetto ne sfrutta esattamente lo scopo: fornire un **contenitore desktop** per una Kanban app avanzata, con tray, menu, scorciatoie globali, dialog e gestione embedded di MongoDB che una normale web app non potrebbe avere.
### 1. Main Process Architecture

Il cuore dell’applicazione desktop è il **main process** definito in `src/main/index.ts`. Qui vengono orchestrati:

- **Ciclo di vita dell’app**
  - `app.whenReady().then(...)` inizializza:
    - la finestra principale (`createWindow`)
    - la connessione a MongoDB (`connectDatabase`)
    - i canali IPC (`setupIpcHandlers`)
    - il menu applicativo (`createApplicationMenu`)
    - le scorciatoie globali (`registerGlobalShortcuts`)
    - l’icona di tray (`createTray`)
  - `app.on("window-all-closed")` è volutamente “vuoto”: l’app non esce quando chiudi la finestra, ma rimane nel **tray**.
  - `app.on("before-quit")` gestisce lo **spegnimento pulito**:
    - disconnessione da MongoDB (`disconnectDatabase`)
    - stop del server Mongo embedded/Docker
    - deregistrazione delle scorciatoie globali (`globalShortcut.unregisterAll`).

- **Gestione della finestra principale + persistenza stato**
  - Una struttura `WindowState` e le funzioni `loadWindowState` / `saveWindowState` leggono e scrivono un JSON in `app.getPath("userData")/window-state.json`.
  - All’avvio, `createWindow` usa questi dati per ripristinare dimensioni, posizione e stato massimizzato.
  - Eventi `resize` e `move` sulla finestra chiamano `saveWindowState` per aggiornare il file.

- **Menu nativo e tray icon**
  - `createApplicationMenu()` definisce un menu a più voci:
    - **File**: New Project, New Task, Export Data, Import Data, Quit – ognuna invia un evento al renderer (`webContents.send("open-...-dialog")`) o chiude l’app.
    - **View**: comandi standard (reload, toggle devtools, zoom, fullscreen).
    - **Window**: include una voce “Hide to Tray” che nasconde la finestra invece di chiuderla.
    - **Help**: link a Electron, apertura del file di log, apertura cartella userData, voce “About”.
  - `createTray()` crea una `Tray` con:
    - menu rapido (Show App, New Task, New Project, Quit)
    - click sull’icona per mostrare/nascondere la finestra.
  - `registerGlobalShortcuts()` registra una scorciatoia globale (`CmdOrCtrl+Shift+T`) per mostrare/nascondere l’app da qualsiasi contesto.

- **Ambiente Node.js con accesso completo al sistema**
  - Il main process importa `fs`, `path`, `electron`, `electron-toolkit`, usa il file system per salvataggio dello stato, gestisce processi, percorsi di sistema (download, userData), controlla **MongoDB embedded o Docker** tramite `mongoServer.ts`.
  - Tutto ciò è accessibile **solo nel main process** (e nei moduli backend); il renderer non vede direttamente queste API ma passa dall’IPC.

**Concetto chiave:** il main process è il **backend desktop**: controlla finestra, menu, tray, scorciatoie, log e ciclo di vita del database, con accesso completo al sistema operativo tramite Node.js ed Electron.
**Ragion d’essere:** è il punto in cui applichiamo il modello consigliato nelle docs di Electron (main come orchestratore) per risolvere problemi tipici delle app reali: riaperture coerenti, shutdown puliti, gestione centralizzata delle risorse di sistema.

---

### 2. IPC Communication

La comunicazione tra renderer (React) e main (Node + Mongo) è mediata da **IPC** e da un layer di sicurezza nel preload.

- **Pattern dei canali (entity:action)** – `src/main/ipc/handlers.ts`
  - Viene registrata una serie di `ipcMain.handle("entity:action", ...)` che espongono un’API remota:
    - **Project**: `project:create`, `project:getAll`, `project:getById`, `project:update`, `project:delete`, `project:archive`, `project:unarchive`, `project:search`.
    - **Task**: `task:create`, `task:getByProject`, `task:getById`, `task:update`, `task:delete`, `task:archive`, `task:updatePosition`, `task:reorder`, `task:getByDueDate`, `task:search`.
    - **Export/Import**: `export:toJSON`, `export:toCSV`, `export:createBackup`, `export:listBackups`, `import:fromJSON`, `import:restoreBackup`, `import:selectFile`.
    - **Status**: `database:getStatus`.
  - Ogni handler:
    - riceve argomenti tipizzati,
    - chiama un metodo del servizio (es. `projectService.create`, `taskService.findByProject`),
    - ritorna un valore o lancia un errore gestito dal renderer.

- **Preload e `contextBridge` – `src/preload/index.ts`**
  - Il preload definisce un oggetto `api` che wrappa `ipcRenderer.invoke` e `ipcRenderer.on`:
    - `api.project.*`, `api.task.*`, `api.export.*`, `api.import.*`
    - Eventi one-way dal main: `onOpenTaskDialog`, `onOpenProjectDialog`, `onOpenExportDialog`, `onOpenImportDialog`, `onDatabaseStatus`
    - `getDatabaseStatus()` per recuperare lo stato iniziale.
  - Tramite `contextBridge.exposeInMainWorld("api", api)` queste funzioni sono esposte al renderer come `window.api`, senza esporre direttamente `ipcRenderer` o altre API sensibili.
  - In `App.tsx` il renderer usa solo `window.api` (tipizzato da `preload/types/*.d.ts`) per tutte le operazioni verso il backend.

- **Flusso completo: click → IPC → database → risposta**
  - Esempio “Create Task”:
    1. L’utente compila la form/kanban e preme **Save / New Task**.
    2. Il componente React chiama `useStore().createTask(...)`.
    3. Lo store fa un **optimistic update** (aggiunge una task temporanea) e chiama `window.api.task.create(data)`.
    4. In preload, questo invoca `ipcRenderer.invoke("task:create", data)`.
    5. Nel main, `ipcMain.handle("task:create", ...)` delega a `taskService.create`, che usa il modello Mongoose `Task` per fare `save()` su MongoDB.
    6. Il risultato (con `_id`/`projectId` convertiti in stringa per la serializzazione IPC) viene ritornato al renderer.
    7. Lo store sostituisce la task temporanea con quella reale oppure esegue un **rollback** in caso di errore.

**Concetto chiave:** i processi sono **isolati** (renderer non ha accesso diretto a Node), e tutta la comunicazione passa per canali IPC ben definiti e tipizzati, incapsulati nel preload per ridurre la superficie d’attacco.
**Ragion d’essere:** questo pattern permette di sfruttare la potenza del backend Node/Mongo restando aderenti alle linee guida di sicurezza di Electron (context isolation, API “surface” ridotta), così che nessun componente React possa accidentalmente eseguire operazioni pericolose sul sistema.

---

### 3. Desktop Integration

L’app sfrutta diverse integrazioni native che una normale web app non avrebbe:

- **Global shortcuts** – `registerGlobalShortcuts` in `src/main/index.ts`
  - Registra `CmdOrCtrl+Shift+T` per mostrare/nascondere la finestra da qualunque app attiva.

- **Tray menu** – `createTray`
  - Icona nella system tray con:
    - “Show App” per aprire/focalizzare la finestra.
    - “New Task” / “New Project” che inviano `open-task-dialog` / `open-project-dialog` al renderer, aprendo direttamente le modali React.
    - “Quit” per uscire dall’app.
  - Click sull’icona alterna hide/show della finestra.

- **Application menu nativo** – `createApplicationMenu`
  - Usa il menu standard dell’OS con:
    - voci `File` per aprire dialog di export/import, creare progetti/task,
    - comandi `View` e `Window` integrati,
    - `Help` con link ad Electron, apertura log e cartella user data.

- **Dialog di sistema (import/export)** – `ipc/import:selectFile`
  - `handlers.ts` usa `dialog.showOpenDialog` con filtri per file `.json` per la selezione file di import.
  - I servizi di export (`exportService.ts`) scrivono file `.json` / `.csv` direttamente nelle cartelle **Downloads** o **userData**, sfruttando `app.getPath(...)`.

**Concetto chiave:** l’app sfrutta le API native di Electron (tray, menu, global shortcut, dialog, filesystem) per offrire un’esperienza da **vera app desktop**, non solo una SPA in una WebView.
**A cosa serve:** tutte queste integrazioni (citati come esempi nelle docs) trasformano la app da “sito web in una finestra” a strumento di produttività: avviabile da scorciatoie globali, sempre a portata di mano nel tray, capace di lavorare con file locali e con il file system dell’utente.

---

## React Deep Dive

Le [React docs](https://react.dev/) definiscono React come una libreria per “**costruire interfacce utente**” che diventano più potenti man mano che lo stato e l’interattività crescono: è pensata per UI dinamiche, stateful e a componenti.
Nel contesto di `task_board`, React è lo strumento ideale per modellare una **Kanban board interattiva**, con componenti riutilizzabili, drag‑and‑drop, form ricchi e uno state management strutturato che segue il paradigma `UI = f(state)`.
### 1. Component Architecture

La UI è costruita come una gerarchia di componenti React tipizzati, con una chiara separazione tra layout, contenuto e funzionalità.

- **`App.tsx`: composizione ad alto livello**
  - Usa `AppLayout` e `Sidebar` per definire lo scheletro della pagina.
  - Inserisce nella sidebar il componente `ProjectList`, che mostra i progetti e permette di selezionarne uno o crearne di nuovi.
  - Nel content area mostra una di tre viste:
    - `EmptyState` (nessun progetto),
    - `EmptyState` (nessun progetto selezionato),
    - `ProjectView` quando un progetto è attivo.
  - `ProjectDialog`, `TaskDialog`, `ExportDialog`, `ImportDialog` sono montati a fondo albero e controllati da state locali (`useState` per `open`).

- **Props drilling & parent–child communication**
  - `App` passa callback come `onCreateProject`, `onCreateTask`, `onEditTask`, `onOpenEditProjectDialog` verso i componenti figli:
    - `ProjectList` riceve `onCreateProject`.
    - `ProjectView` riceve `currentProject` + callback per aprire i dialog.
    - `KanbanBoard` (dentro `ProjectView`) riceve `onCreateTask` e `onEditTask`.
  - Il flusso dei dati è **unidirezionale**: lo stato risiede in `useStore` e negli state del componente root; i figli notificano eventi verso l’alto tramite callback.

- **`KanbanBoard.tsx`: layout a colonne e comunicazione con lo store**
  - Definisce tre colonne (`TODO`, `IN_PROGRESS`, `DONE`) con colori diversi.
  - Usa `useStore()` per accedere a:
    - `tasks`, `loadingTasks`
    - azioni `updateTaskPosition`, `deleteTask`.
  - Passa a `TaskColumn` l’elenco di task filtrati per status, più callback per edit e delete.

**Concetto chiave:** la UI è composta da componenti React a responsabilità singola, che comunicano principalmente tramite props, con un **data flow unidirezionale** orchestrato da uno store centrale (Zustand).
**Ragion d’essere:** seguendo il modello a componenti che React propone nelle sue guide, questa architettura rende semplice evolvere la UI (nuove colonne, nuove viste, filtraggio) senza dover cambiare la logica di base: ridefiniamo il tree di componenti, non l’intera app.

---

### 2. Hooks & State Management

La gestione dello stato client-side è affidata a **Zustand**, integrato con hook React (`useState`, `useEffect`, `useCallback`).

- **Store globale con Zustand – `useStore.ts`**
  - Stato per:
    - `projects`, `currentProjectId`, `showArchivedProjects`
    - `tasks`, `loadingProjects`, `loadingTasks`
  - Azioni principali:
    - `loadProjects`, `createProject`, `updateProject`, `deleteProject`, `archiveProject`, `unarchiveProject`, `setCurrentProject`, `toggleShowArchived`
    - `loadTasks`, `createTask`, `updateTask`, `deleteTask`, `updateTaskPosition`, `reorderTasks`
  - Getter computati:
    - `getCurrentProject()`
    - `getVisibleProjects()` (filtra progetti archiviati se richiesto).

- **Pattern di optimistic updates + rollback**
  - **Create Project / Task**:
    - crea un entity “temp” con `temp-${Date.now()}` come `_id`,
    - aggiorna lo stato localmente subito (**app più reattiva**),
    - chiama l’API IPC (`window.api.project.create` / `window.api.task.create`),
    - se la chiamata ha successo, sostituisce l’entity temporanea con quella reale ritornata dal backend,
    - se fallisce, effettua **rollback** e mostra un toast di errore.
  - **Update / Delete Project / Task**:
    - salva l’entity originale per eventuale rollback,
    - applica la modifica (o rimozione) in modo ottimistico,
    - se la chiamata IPC fallisce, ripristina lo stato precedente.

- **Hooks React in `App.tsx`**
  - `useEffect` per:
    - recuperare lo stato del database (`window.api.getDatabaseStatus`) e iscriversi agli eventi `onDatabaseStatus` (UI di loading/errore coerente con lo stato del backend).
    - ascoltare eventi provenienti da menu/tray (`onOpenTaskDialog`, `onOpenProjectDialog`, `onOpenExportDialog`, `onOpenImportDialog`) e aprire le modali corrispondenti.
  - `useCallback` per funzioni che vengono passate ai figli (create/edit project/task), evitando re-render inutili.

**Concetto chiave:** la combinazione React hooks + Zustand fornisce uno **state management client-side semplice ma potente**, con supporto nativo a pattern moderni come gli aggiornamenti ottimistici e il rollback in caso di errore.
**A cosa serve:** gli optimistic updates implementano l’idea, cara alla doc di React, che l’interfaccia debba reagire subito all’intento dell’utente; il rollback salvaguarda l’integrità dei dati anche in presenza di errori di rete o di backend, coniugando UX fluida e robustezza.

---

### 3. Modern React Patterns

Il progetto sfrutta diversi pattern moderni dell’ecosistema React:

- **Drag-and-drop con `@dnd-kit` – `KanbanBoard.tsx`**
  - Usa `DndContext`, `PointerSensor`, `DragOverlay` per gestire il trascinamento delle task tra colonne.
  - `handleDragStart` imposta `activeTask` per mostrare una card “staccata” durante il drag.
  - `handleDragEnd`:
    - calcola la nuova colonna (`newStatus`) e la posizione (`newPosition` = numero di task nella nuova colonna),
    - chiama `updateTaskPosition` dello store, che a sua volta invoca `window.api.task.updatePosition` → `taskService.updatePosition` → MongoDB.
  - L’ordinamento per colonna è sempre coerente perché le task sono ordinate per `position`.

- **Component library & design system – `components/ui/*`, `theme/*`**
  - Ampio set di componenti UI riutilizzabili (button, card, dialog, dropdown, input, badge, skeleton, ecc.), nello stile **shadcn/ui**.
  - `ThemeProvider` e `ThemeToggle` permettono di cambiare tema (es. light/dark) a livello di app.
  - Tutto il layout di Kanban, dialog, sidebar sfrutta questi componenti per avere una UI consistente e moderna.

- **Form moderne (React Hook Form)**
  - I dialog di progetto e task (es. `ProjectDialog.tsx`, `TaskDialog.tsx`) sono costruiti sopra una gestione form moderna (pattern tipico: `react-hook-form` + componenti UI + validazione), anche se la logica dettagliata non è riportata qui, la struttura è predisposta per TypeScript e per pattern type-safe.

**Concetto chiave:** l’app sfrutta l’ecosistema React moderno (DnD, UI library, state store) per costruire un’interfaccia **ricca, consistente e reattiva**, senza reinventare componenti di base.
**Ragion d’essere:** invece di reimplementare drag‑and‑drop, sistemi di theming o componenti UI low‑level, ci appoggiamo a librerie che incarnano le best practice dell’ecosistema, esattamente come React suggerisce quando parla di “building on a rich ecosystem” per ridurre complessità e debito tecnico.

---

## MongoDB Deep Dive

La documentazione di MongoDB descrive il prodotto come un **document database** con schema flessibile, pensato per applicazioni moderne che richiedono **alta disponibilità, scalabilità orizzontale** e un modello dati vicino agli oggetti applicativi ([MongoDB Manual – Introduction](https://www.mongodb.com/docs/manual/introduction/)).
Nel nostro caso lo usiamo come **database locale embedded** per progetti e task: la struttura a documenti (Project + Task) si mappa naturalmente sulle entità del dominio e consente query efficienti per stato, posizione, date, testo e archiviazione.
### 1. Schema Design with Mongoose

Il livello dati è modellato con **Mongoose**, che secondo le [Mongoose docs](https://mongoosejs.com/docs/) è una “schema‑based solution to model application data”, cioè una libreria ODM che aggiunge **schemi, validazione e middleware** sopra MongoDB.
Qui usiamo Mongoose per trasformare un database potenzialmente schema‑less in un livello dati **fortemente tipizzato e validato**, allineato alle esigenze di un’app desktop che deve preservare l’integrità delle task e dei progetti nel tempo.
**Ragion d’essere:** in un tool di gestione progetti non possiamo permettere dati incoerenti (task senza progetto, status invalidi, ecc.); gli schemi Mongoose concretizzano le raccomandazioni delle docs sul data modeling, facendo rispettare queste regole a ogni operazione CRUD.

- **`Project.ts` – Documento Project**
  - Campi principali:
    - `name` (obbligatorio, max 100, trim)
    - `description` (opzionale, max 500)
    - `color` (default `#3b82f6`)
    - `icon` (emoji o stringa)
    - `isArchived` (boolean, default `false`)
    - `settings` con:
      - `taskStatuses`: array di stringhe, di default `Object.values(TaskStatus)`
      - `defaultPriority`: enum `TaskPriority` con default `MEDIUM`
  - Opzione `timestamps: true` aggiunge `createdAt` e `updatedAt`.
  - Indici:
    - `{ isArchived: 1, updatedAt: -1 }` per ordinare rapidamente progetti attivi/archiviati.
    - indice full-text su `name` per la ricerca.

- **`Task.ts` – Documento Task**
  - Campi principali:
    - `projectId`: `ObjectId` con `ref: "Project"` (relazione **referenziata** Project→Tasks)
    - `title`, `description` con limiti di lunghezza
    - `status`: enum `TaskStatus` (`todo`, `in-progress`, `done`) con default `TODO`
    - `priority`: enum `TaskPriority` (`low`, `medium`, `high`)
    - `labels`: array di stringhe
    - `dueDate`: `Date`
    - `checklist`: array embedded di `{ id, text, completed }`
    - `position`: `Number` usato per l’ordinamento nelle colonne Kanban
    - `isArchived`: boolean
  - Indici:
    - `{ projectId: 1, status: 1, position: 1 }` per recuperare rapidamente task per progetto/colonna + ordine.
    - `{ projectId: 1, isArchived: 1 }` per filtri attivo/archiviato.
    - `{ dueDate: 1 }` per query sul calendario.
    - indice full-text su `title` e `description` per la ricerca.

- **Embedded vs referenced**
  - I **task** non sono embedded nel documento Project, ma referenziati via `projectId`, perché:
    - il numero di task può crescere molto,
    - serve ordinarli per `status`+`position`,
    - si vogliono query per data, ricerca testuale, ecc.

**Concetto chiave:** MongoDB è schema‑less, ma Mongoose aggiunge **schema e validazione**, e la scelta Project→Tasks referenziati è ottimale per Kanban, query complesse e scalabilità.
**A cosa serve:** modellare i Task come documenti separati referenziati dai Project segue il principio delle docs MongoDB (“modellare in base ai pattern di accesso”), ottimizzando per le esigenze reali dell’app: filtrare per progetto, status, data, testo e posizione senza costose trasformazioni lato client.

---

### 2. CRUD Operations

Le operazioni su MongoDB sono incapsulate in servizi che lavorano con Mongoose e vengono esposti al main process e al renderer via IPC.

- **`taskService.ts`: CRUD e query per Task**
  - `create(data)`:
    - calcola il prossimo `position` per la colonna (`status`) corrente con una query `findOne(...).sort({ position: -1 })`,
    - crea un nuovo `Task` con quella posizione,
    - salva e ritorna l’oggetto con `_id` e `projectId` convertiti in stringhe per il trasporto IPC.
  - `findByProject(projectId, includeArchived)`:
    - costruisce una query `projectId + isArchived` (facoltativo),
    - ordina per `{ status: 1, position: 1 }` per alimentare direttamente il Kanban.
  - `findById`, `update`, `delete`, `archive`: metodi standard Mongoose con `findById*` e `.lean()`.
  - `updatePosition(id, newStatus, newPosition)`: aggiornamento di `status` e `position` per supportare DnD.
  - `reorderTasks(projectId, status, taskIds)`:
    - costruisce una `bulkWrite` che aggiorna in un colpo solo tutte le task di una colonna con le nuove `position`.
  - `findByDueDate(startDate, endDate)`: query per data (es. viste Calendario).
  - `search(projectId, searchTerm)`: usa l’indice testuale per full-text search within project.

- **`projectService.ts` (non mostrato ma simile)**
  - Fornisce metodi `create`, `findAll`, `findById`, `update`, `delete`, `archive`, `unarchive`, `search` in modo analogo, lavorando sul modello `Project`.

**Concetto chiave:** tutte le operazioni CRUD sono **promise-based async** e restano incapsulate in servizi dedicati, mantenendo il main process e il renderer puliti e tipizzati.
**Ragion d’essere:** organizzare il codice in servizi allineati ai modelli Mongoose ci permette di evolvere il data layer secondo le best practice Mongo/Mongoose (nuovi indici, validazioni, plugin) senza toccare la logica Electron/React, mantenendo un confine chiaro tra livelli dell’app.

---

### 3. Advanced Features

Alcune funzionalità costruite sopra MongoDB/Mongoose mostrano bene l’integrazione applicativa:

- **Position management per drag-and-drop**
  - In `KanbanBoard`, quando una task viene spostata, si calcola la nuova `position` come `tasksInColumn.length`.
  - Lo store chiama `updateTaskPosition`, che:
    - fa un aggiornamento ottimistico locale (status + position),
    - invoca `window.api.task.updatePosition` → `taskService.updatePosition` su MongoDB.
  - Per operazioni più complesse (multi-drag) è disponibile `reorderTasks` con `bulkWrite`.

- **Import/Export servizi – `exportService.ts` e `importService.ts`**
  - Export:
    - `exportToJSON(options)`: crea un payload con `projects`, `tasks`, `metadata`, lo salva in un file `.json` nella cartella **Downloads**.
    - `exportToCSV(options)`: esporta le task in formato tabellare CSV (con join al nome progetto), salvando in Downloads.
    - `createBackup()`: genera un backup JSON completo e duraturo in `userData/backups`.
    - `listBackups()`: elenca i file di backup disponibili.
  - Import:
    - `importFromJSON(options)` e `restoreFromBackup(backupPath)` (non mostrati qui) ripristinano progetti e task da file esistenti.
  - Tutti questi metodi sono invocati dal renderer tramite dialog e componenti React (Export/Import modals).

- **Database connection lifecycle – `connection.ts` + `mongoServer.ts`**
  - `connectDatabase()`:
    - inizializza il server Mongo: prova a connettersi ad una docker image chiamata (`taskboard_mongo`)
    - costruisce una URI `.../taskboard`, si connette con `mongoose.connect`, e aggiorna lo `statusManager` con lo stato attuale (inizializzazione / connesso / errore).
    - gestisce eventi `mongoose.connection.on("error" | "disconnected")` per aggiornare lo stato e i log.
  - `disconnectDatabase()`:
    - chiude la connessione mongoose,
    - chiama `stopMongoServer()` per fermare l’istanza embedded (in prod).
  - Nel renderer (`App.tsx`), lo stato del database viene mostrato all’utente via `LoadingScreen` e messaggi di errore non bloccanti.

**Concetto chiave:** l’app costruisce feature di livello applicativo (Kanban, import/export, backup, status database visibile nella UI) direttamente sopra MongoDB/Mongoose, mantenendo una **separazione netta** tra frontend, IPC, servizi e modelli.
**A cosa serve:** qui diamo forma pratica all’idea espressa nella doc MongoDB di usare il database come “foundation” per le funzionalità di business: drag‑and‑drop persistente, backup, import/export e viste per data sono tutte capacità applicative costruite sopra primitive generiche di storage.

---

## Conclusione

Questa Parte 2 mostra come:

- **Electron** fornisca il “guscio” desktop (main process, tray, menu, dialog, global shortcut, ciclo di vita database).
- **React + Zustand** implementino la UI Kanban e il client‑side state management moderno (hooks, optimistic updates, drag‑and‑drop, component library).
- **MongoDB + Mongoose** offrano un backend dati flessibile ma strutturato, con schemi, validazione, query avanzate e servizi applicativi (CRUD, ordinamento, ricerca, import/export, backup).

L’insieme realizza una **desktop app end‑to‑end in JavaScript/TypeScript**, dove ogni livello è chiaramente separato ma integrato tramite IPC e contratti tipizzati.


