# Application Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Desktop Application                      │
│                    (Windows, macOS, Linux)                       │
└─────────────────────────────────────────────────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
   ┌────▼─────┐          ┌──────▼──────┐         ┌──────▼──────┐
   │  Main    │          │   Preload   │         │  Renderer   │
   │ Process  │◄────────►│   Script    │◄────────┤   Process   │
   │ (Node.js)│   IPC    │   (Bridge)  │   IPC   │   (React)   │
   └────┬─────┘          └─────────────┘         └──────┬──────┘
        │                                                │
   ┌────▼─────┐                                   ┌──────▼──────┐
   │ MongoDB  │                                   │   Browser   │
   │ Database │                                   │   Window    │
   └──────────┘                                   └─────────────┘
```

## Architecture Layers

### 1. Main Process (Electron - Node.js)

**Responsibilities:**
- Application lifecycle management
- Window creation and management
- Database connection and operations
- IPC communication handling
- System integration (tray, notifications)

**Key Components:**

```
src/main/
├── index.ts                    # Entry point
├── database/
│   ├── connection.ts           # MongoDB connection
│   ├── models/
│   │   ├── Project.ts          # Project schema
│   │   └── Task.ts             # Task schema
│   └── services/
│       ├── projectService.ts   # Project CRUD
│       └── taskService.ts      # Task CRUD
└── ipc/
    └── handlers.ts             # IPC request handlers
```

### 2. Preload Script (IPC Bridge)

**Responsibilities:**
- Expose secure APIs to renderer process
- Bridge between main and renderer processes
- Type-safe IPC communication

**API Surface:**

```typescript
window.api = {
  project: {
    create, getAll, getById, update, delete, archive
  },
  task: {
    create, getByProject, getById, update, delete, reorder
  }
}
```

### 3. Renderer Process (React Application)

**Responsibilities:**
- User interface rendering
- User interaction handling
- State management
- API calls to main process

**Key Components:**

```
src/renderer/src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── layout/                # Layout components
│   ├── project/               # Project components
│   └── task/                  # Task components
├── hooks/                     # Custom React hooks
├── store/                     # Zustand stores
├── types/                     # TypeScript types
└── lib/                       # Utilities
```

## Data Flow

### Creating a Task

```
User Action (React)
      │
      ▼
Task Form Submit
      │
      ▼
useTask Hook
      │
      ▼
window.api.task.create()
      │
      ▼
IPC Message (Preload)
      │
      ▼
IPC Handler (Main)
      │
      ▼
taskService.create()
      │
      ▼
MongoDB (via Mongoose)
      │
      ▼
Return Task Document
      │
      ▼
IPC Response
      │
      ▼
Update Zustand Store
      │
      ▼
Re-render Components
```

### Project Selection Flow

```
User Clicks Project
      │
      ▼
ProjectSwitcher
      │
      ▼
useProjects.setCurrentProject()
      │
      ▼
Update projectStore
      │
      ▼
useTasks.loadTasks(projectId)
      │
      ▼
window.api.task.getByProject(projectId)
      │
      ▼
IPC to Main Process
      │
      ▼
taskService.findByProject()
      │
      ▼
MongoDB Query
      │
      ▼
Update taskStore
      │
      ▼
TaskBoard Re-renders
```

## Component Hierarchy

```
App
└── AppLayout
    ├── Sidebar
    │   ├── ProjectSwitcher
    │   │   └── Command (shadcn)
    │   └── ProjectList
    │       └── ProjectCard[]
    │           └── Badge, Button (shadcn)
    └── MainContent
        └── TaskBoard
            ├── TaskColumn (To Do)
            │   └── TaskCard[]
            │       └── Card, Badge, Button (shadcn)
            ├── TaskColumn (In Progress)
            │   └── TaskCard[]
            └── TaskColumn (Done)
                └── TaskCard[]

Dialogs (Portals)
├── CreateProjectDialog
│   └── Dialog, Input, Textarea (shadcn)
├── CreateTaskDialog
│   └── Dialog, Form Components (shadcn)
└── TaskDetailsDialog
    └── Dialog, Complex UI (shadcn)
```

## State Management (Zustand)

### Project Store

```typescript
projectStore = {
  // State
  projects: Project[]
  currentProject: Project | null
  isLoading: boolean
  error: string | null
  
  // Actions
  setProjects()
  setCurrentProject()
  addProject()
  updateProject()
  removeProject()
  setLoading()
  setError()
}
```

### Task Store

```typescript
taskStore = {
  // State
  tasks: Task[]
  filteredTasks: Task[]
  filters: FilterOptions
  isLoading: boolean
  error: string | null
  
  // Actions
  setTasks()
  addTask()
  updateTask()
  removeTask()
  reorderTasks()
  setFilters()
  setLoading()
  setError()
}
```

## Database Schema

### Project Collection

```
projects
├── _id: ObjectId
├── name: String *
├── description: String
├── color: String
├── icon: String
├── isArchived: Boolean
├── settings: {
│   ├── taskStatuses: String[]
│   └── defaultPriority: String
│ }
├── createdAt: Date
└── updatedAt: Date
```

### Task Collection

```
tasks
├── _id: ObjectId
├── projectId: ObjectId * → references projects._id
├── title: String *
├── description: String
├── status: String (enum)
├── priority: String (enum)
├── labels: String[]
├── dueDate: Date
├── checklist: [{
│   ├── id: String
│   ├── text: String
│   └── completed: Boolean
│ }]
├── position: Number *
├── isArchived: Boolean
├── createdAt: Date
└── updatedAt: Date

Indexes:
- { projectId: 1, status: 1, position: 1 }
```

## IPC Communication

### Channel Naming Convention

```
<entity>:<action>

Examples:
- project:create
- project:getAll
- task:create
- task:getByProject
- task:reorder
```

### IPC Security

```
Main Process (Trusted)
    │
    │ ✓ Full Node.js API access
    │ ✓ Database access
    │ ✓ File system access
    │
    ▼
Preload Script
    │
    │ ✓ contextBridge
    │ ✓ Whitelist APIs
    │
    ▼
Renderer Process (Sandboxed)
    │
    │ ✗ No Node.js access
    │ ✓ Only whitelisted APIs via window.api
```

## Technology Stack Integration

```
┌─────────────────────────────────────────────┐
│              React 18 + TypeScript           │
│  ┌─────────────────────────────────────┐   │
│  │         Component Layer              │   │
│  │  ┌──────────────────────────────┐   │   │
│  │  │      shadcn/ui               │   │   │
│  │  │  (Radix UI + Tailwind)      │   │   │
│  │  └──────────────────────────────┘   │   │
│  │                                      │   │
│  │  ┌──────────────────────────────┐   │   │
│  │  │      Custom Components       │   │   │
│  │  └──────────────────────────────┘   │   │
│  └─────────────────────────────────────┘   │
│                                              │
│  ┌─────────────────────────────────────┐   │
│  │          State Layer                 │   │
│  │         (Zustand)                    │   │
│  └─────────────────────────────────────┘   │
│                                              │
│  ┌─────────────────────────────────────┐   │
│  │         Hooks Layer                  │   │
│  │    (Custom + React Hook Form)        │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                     │
                     │ IPC
                     ▼
┌─────────────────────────────────────────────┐
│              Electron Main Process           │
│  ┌─────────────────────────────────────┐   │
│  │        Service Layer                 │   │
│  └─────────────────────────────────────┘   │
│                     │                        │
│                     ▼                        │
│  ┌─────────────────────────────────────┐   │
│  │         Mongoose ODM                 │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│               MongoDB Database               │
└─────────────────────────────────────────────┘
```

## Drag and Drop Architecture (@dnd-kit)

```
<DndContext>
  │
  ├── Sensors (Mouse, Touch, Keyboard)
  │
  ├── Collision Detection
  │
  └── Task Board
      ├── <Droppable> To Do Column
      │   └── <Draggable> Task Cards
      │
      ├── <Droppable> In Progress Column
      │   └── <Draggable> Task Cards
      │
      └── <Droppable> Done Column
          └── <Draggable> Task Cards

On Drop:
  1. Determine source and destination
  2. Calculate new position
  3. Update local state (optimistic)
  4. Call task:reorder API
  5. Update MongoDB
  6. Handle errors (revert if needed)
```

## Build Process

```
Source Code
    │
    ├── TypeScript Compilation
    │   └── Type Checking
    │
    ├── React Build (Vite)
    │   ├── JSX Transformation
    │   ├── CSS Processing (Tailwind)
    │   └── Code Splitting
    │
    └── Electron Build
        ├── Main Process Bundle
        ├── Preload Bundle
        └── Renderer Bundle
            │
            ▼
        Electron Builder
            │
            ├── Windows (.exe, NSIS installer)
            ├── macOS (.dmg, .app)
            └── Linux (.deb, .AppImage)
```

## Security Considerations

1. **Context Isolation**: Enabled
2. **Node Integration**: Disabled in renderer
3. **Sandbox**: Enabled
4. **contextBridge**: Used for safe IPC
5. **Input Validation**: Zod schemas on all forms
6. **MongoDB Injection**: Mongoose escaping
7. **XSS Prevention**: React default escaping

## Performance Optimizations

1. **Lazy Loading**: Route-based code splitting
2. **Virtual Scrolling**: For large task lists
3. **Memo/useMemo**: Prevent unnecessary re-renders
4. **Debouncing**: Search and filter operations
5. **Indexed DB Queries**: MongoDB indexes on projectId
6. **Optimistic Updates**: Immediate UI feedback
7. **Caching**: Store frequently accessed data

---

*This architecture provides a scalable, maintainable, and secure foundation for the Multi-Project Task Board Manager.*
