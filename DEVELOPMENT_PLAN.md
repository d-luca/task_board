# Multi-Project Task Board - Detailed Development Plan

## Overview

This document provides a detailed, step-by-step development plan for building the Multi-Project Task Board Manager desktop application.

## Database Schema Design

### Project Model

```typescript
interface IProject {
  _id: ObjectId;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
  settings?: {
    taskStatuses?: string[]; // Custom column names
    defaultPriority?: 'low' | 'medium' | 'high';
  };
}
```

### Task Model

```typescript
interface ITask {
  _id: ObjectId;
  projectId: ObjectId; // Reference to Project
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  labels?: string[];
  dueDate?: Date;
  checklist?: {
    id: string;
    text: string;
    completed: boolean;
  }[];
  position: number; // For ordering within a column
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
}
```

## Phase-by-Phase Implementation Guide

### Phase 1: Project Setup & Architecture (1-2 days)

#### Step 1.1: Initialize Project

```bash
# Current project already initialized with electron-vite
pnpm install

# Add required dependencies
pnpm add mongoose zod react-hook-form @hookform/resolvers
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
pnpm add lucide-react class-variance-authority clsx tailwind-merge
pnpm add zustand date-fns

# Add dev dependencies
pnpm add -D @types/node
```

#### Step 1.2: Install and Configure shadcn/ui

```bash
# Initialize shadcn/ui
pnpm dlx shadcn-ui@latest init

# Install essential components
pnpm dlx shadcn-ui@latest add button
pnpm dlx shadcn-ui@latest add card
pnpm dlx shadcn-ui@latest add dialog
pnpm dlx shadcn-ui@latest add input
pnpm dlx shadcn-ui@latest add label
pnpm dlx shadcn-ui@latest add select
pnpm dlx shadcn-ui@latest add textarea
pnpm dlx shadcn-ui@latest add dropdown-menu
pnpm dlx shadcn-ui@latest add popover
pnpm dlx shadcn-ui@latest add calendar
pnpm dlx shadcn-ui@latest add badge
pnpm dlx shadcn-ui@latest add toast
pnpm dlx shadcn-ui@latest add skeleton
pnpm dlx shadcn-ui@latest add command
pnpm dlx shadcn-ui@latest add separator
```

#### Step 1.3: Configure Tailwind CSS

Update `tailwind.config.js` to include shadcn/ui styles and custom colors.

#### Step 1.4: Set Up Project Structure

Create the following directory structure:

```
src/
├── main/
│   ├── database/
│   │   ├── connection.ts
│   │   ├── models/
│   │   │   ├── Project.ts
│   │   │   └── Task.ts
│   │   └── services/
│   │       ├── projectService.ts
│   │       └── taskService.ts
│   └── ipc/
│       └── handlers.ts
├── renderer/src/
│   ├── components/
│   │   ├── ui/              # shadcn components
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── project/
│   │   │   ├── ProjectList.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectSwitcher.tsx
│   │   │   ├── CreateProjectDialog.tsx
│   │   │   └── EditProjectDialog.tsx
│   │   └── task/
│   │       ├── TaskBoard.tsx
│   │       ├── TaskColumn.tsx
│   │       ├── TaskCard.tsx
│   │       ├── CreateTaskDialog.tsx
│   │       ├── EditTaskDialog.tsx
│   │       └── TaskDetailsDialog.tsx
│   ├── hooks/
│   │   ├── useProjects.ts
│   │   ├── useTasks.ts
│   │   └── useIPC.ts
│   ├── lib/
│   │   ├── utils.ts
│   │   └── ipc.ts
│   ├── store/
│   │   ├── projectStore.ts
│   │   └── taskStore.ts
│   └── types/
│       ├── project.ts
│       └── task.ts
└── shared/
    └── types.ts
```

---

### Phase 2: MongoDB Integration Setup (1-2 days)

#### Step 2.1: Set Up MongoDB Connection

**File**: `src/main/database/connection.ts`

```typescript
import mongoose from 'mongoose';
import { app } from 'electron';
import path from 'path';

const isDev = !app.isPackaged;
const MONGODB_URI = isDev
  ? 'mongodb://localhost:27017/taskboard_dev'
  : `mongodb://localhost:27017/taskboard`;

export async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
```

#### Step 2.2: Create Mongoose Models

**File**: `src/main/database/models/Project.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  isArchived: boolean;
  settings?: {
    taskStatuses?: string[];
    defaultPriority?: 'low' | 'medium' | 'high';
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    description: { type: String },
    color: { type: String, default: '#3b82f6' },
    icon: { type: String },
    isArchived: { type: Boolean, default: false },
    settings: {
      taskStatuses: { type: [String], default: ['todo', 'in-progress', 'done'] },
      defaultPriority: { type: String, default: 'medium' }
    }
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
```

**File**: `src/main/database/models/Task.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  projectId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  labels?: string[];
  dueDate?: Date;
  checklist?: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
  position: number;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true },
    description: { type: String },
    status: { 
      type: String, 
      enum: ['todo', 'in-progress', 'done'], 
      default: 'todo' 
    },
    priority: { 
      type: String, 
      enum: ['low', 'medium', 'high'], 
      default: 'medium' 
    },
    labels: [{ type: String }],
    dueDate: { type: Date },
    checklist: [{
      id: String,
      text: String,
      completed: Boolean
    }],
    position: { type: Number, required: true },
    isArchived: { type: Boolean, default: false }
  },
  { timestamps: true }
);

TaskSchema.index({ projectId: 1, status: 1, position: 1 });

export const Task = mongoose.model<ITask>('Task', TaskSchema);
```

#### Step 2.3: Create Service Layer

**File**: `src/main/database/services/projectService.ts`

```typescript
import { Project, IProject } from '../models/Project';

export const projectService = {
  async create(data: Partial<IProject>) {
    const project = new Project(data);
    return await project.save();
  },

  async findAll(includeArchived = false) {
    const query = includeArchived ? {} : { isArchived: false };
    return await Project.find(query).sort({ updatedAt: -1 });
  },

  async findById(id: string) {
    return await Project.findById(id);
  },

  async update(id: string, data: Partial<IProject>) {
    return await Project.findByIdAndUpdate(id, data, { new: true });
  },

  async delete(id: string) {
    return await Project.findByIdAndDelete(id);
  },

  async archive(id: string) {
    return await Project.findByIdAndUpdate(
      id,
      { isArchived: true },
      { new: true }
    );
  }
};
```

**File**: `src/main/database/services/taskService.ts`

```typescript
import { Task, ITask } from '../models/Task';

export const taskService = {
  async create(data: Partial<ITask>) {
    // Get the next position for the task in this column
    const maxPosition = await Task.findOne({
      projectId: data.projectId,
      status: data.status || 'todo'
    })
      .sort({ position: -1 })
      .select('position');

    const task = new Task({
      ...data,
      position: maxPosition ? maxPosition.position + 1 : 0
    });
    return await task.save();
  },

  async findByProject(projectId: string, includeArchived = false) {
    const query: any = { projectId };
    if (!includeArchived) query.isArchived = false;
    return await Task.find(query).sort({ position: 1 });
  },

  async findById(id: string) {
    return await Task.findById(id);
  },

  async update(id: string, data: Partial<ITask>) {
    return await Task.findByIdAndUpdate(id, data, { new: true });
  },

  async delete(id: string) {
    return await Task.findByIdAndDelete(id);
  },

  async updatePosition(id: string, newStatus: string, newPosition: number) {
    return await Task.findByIdAndUpdate(
      id,
      { status: newStatus, position: newPosition },
      { new: true }
    );
  },

  async reorderTasks(projectId: string, status: string, taskIds: string[]) {
    const updates = taskIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, projectId },
        update: { position: index, status }
      }
    }));
    return await Task.bulkWrite(updates);
  }
};
```

#### Step 2.4: Set Up IPC Handlers

**File**: `src/main/ipc/handlers.ts`

```typescript
import { ipcMain } from 'electron';
import { projectService } from '../database/services/projectService';
import { taskService } from '../database/services/taskService';

export function setupIPCHandlers() {
  // Project handlers
  ipcMain.handle('project:create', async (_, data) => {
    return await projectService.create(data);
  });

  ipcMain.handle('project:getAll', async (_, includeArchived) => {
    return await projectService.findAll(includeArchived);
  });

  ipcMain.handle('project:getById', async (_, id) => {
    return await projectService.findById(id);
  });

  ipcMain.handle('project:update', async (_, id, data) => {
    return await projectService.update(id, data);
  });

  ipcMain.handle('project:delete', async (_, id) => {
    return await projectService.delete(id);
  });

  ipcMain.handle('project:archive', async (_, id) => {
    return await projectService.archive(id);
  });

  // Task handlers
  ipcMain.handle('task:create', async (_, data) => {
    return await taskService.create(data);
  });

  ipcMain.handle('task:getByProject', async (_, projectId, includeArchived) => {
    return await taskService.findByProject(projectId, includeArchived);
  });

  ipcMain.handle('task:getById', async (_, id) => {
    return await taskService.findById(id);
  });

  ipcMain.handle('task:update', async (_, id, data) => {
    return await taskService.update(id, data);
  });

  ipcMain.handle('task:delete', async (_, id) => {
    return await taskService.delete(id);
  });

  ipcMain.handle('task:reorder', async (_, projectId, status, taskIds) => {
    return await taskService.reorderTasks(projectId, status, taskIds);
  });
}
```

#### Step 2.5: Update Main Process

**File**: `src/main/index.ts`

Add database connection and IPC handlers initialization.

---

### Phase 3: Core UI Components Design (2-3 days)

#### Step 3.1: Set Up Preload Script

**File**: `src/preload/index.ts`

```typescript
import { contextBridge, ipcRenderer } from 'electron';

const api = {
  // Project API
  project: {
    create: (data: any) => ipcRenderer.invoke('project:create', data),
    getAll: (includeArchived?: boolean) => 
      ipcRenderer.invoke('project:getAll', includeArchived),
    getById: (id: string) => ipcRenderer.invoke('project:getById', id),
    update: (id: string, data: any) => 
      ipcRenderer.invoke('project:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('project:delete', id),
    archive: (id: string) => ipcRenderer.invoke('project:archive', id),
  },
  // Task API
  task: {
    create: (data: any) => ipcRenderer.invoke('task:create', data),
    getByProject: (projectId: string, includeArchived?: boolean) => 
      ipcRenderer.invoke('task:getByProject', projectId, includeArchived),
    getById: (id: string) => ipcRenderer.invoke('task:getById', id),
    update: (id: string, data: any) => 
      ipcRenderer.invoke('task:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('task:delete', id),
    reorder: (projectId: string, status: string, taskIds: string[]) => 
      ipcRenderer.invoke('task:reorder', projectId, status, taskIds),
  }
};

contextBridge.exposeInMainWorld('api', api);
```

#### Step 3.2: Create Type Definitions

**File**: `src/renderer/src/types/project.ts`

```typescript
export interface Project {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  isArchived: boolean;
  settings?: {
    taskStatuses?: string[];
    defaultPriority?: 'low' | 'medium' | 'high';
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}
```

**File**: `src/renderer/src/types/task.ts`

```typescript
export interface Task {
  _id: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  labels?: string[];
  dueDate?: string;
  checklist?: ChecklistItem[];
  position: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface CreateTaskInput {
  projectId: string;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
}
```

#### Step 3.3: Create Utility Functions

**File**: `src/renderer/src/lib/utils.ts`

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function getPriorityColor(priority: 'low' | 'medium' | 'high'): string {
  const colors = {
    low: 'bg-blue-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
  };
  return colors[priority];
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'done': 'Done'
  };
  return labels[status] || status;
}
```

#### Step 3.4: Create Layout Components

**File**: `src/renderer/src/components/layout/AppLayout.tsx`

Basic layout with sidebar for project navigation and main content area.

**File**: `src/renderer/src/components/layout/Sidebar.tsx`

Sidebar component showing project list and project switcher.

---

### Phase 4: Task Management Features (3-4 days)

#### Step 4.1: Create Zustand Store

**File**: `src/renderer/src/store/projectStore.ts`

```typescript
import { create } from 'zustand';
import { Project } from '../types/project';

interface ProjectStore {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  addProject: (project) => 
    set((state) => ({ projects: [project, ...state.projects] })),
  updateProject: (id, data) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p._id === id ? { ...p, ...data } : p
      ),
      currentProject:
        state.currentProject?._id === id
          ? { ...state.currentProject, ...data }
          : state.currentProject
    })),
  removeProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p._id !== id),
      currentProject:
        state.currentProject?._id === id ? null : state.currentProject
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error })
}));
```

**File**: `src/renderer/src/store/taskStore.ts`

Similar store for tasks.

#### Step 4.2: Create Custom Hooks

**File**: `src/renderer/src/hooks/useProjects.ts`

```typescript
import { useEffect } from 'react';
import { useProjectStore } from '../store/projectStore';
import { CreateProjectInput } from '../types/project';

export function useProjects() {
  const store = useProjectStore();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    store.setLoading(true);
    try {
      const projects = await window.api.project.getAll();
      store.setProjects(projects);
      if (projects.length > 0 && !store.currentProject) {
        store.setCurrentProject(projects[0]);
      }
    } catch (error) {
      store.setError('Failed to load projects');
      console.error(error);
    } finally {
      store.setLoading(false);
    }
  };

  const createProject = async (data: CreateProjectInput) => {
    try {
      const project = await window.api.project.create(data);
      store.addProject(project);
      return project;
    } catch (error) {
      store.setError('Failed to create project');
      throw error;
    }
  };

  const updateProject = async (id: string, data: Partial<CreateProjectInput>) => {
    try {
      const updated = await window.api.project.update(id, data);
      store.updateProject(id, updated);
      return updated;
    } catch (error) {
      store.setError('Failed to update project');
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await window.api.project.delete(id);
      store.removeProject(id);
    } catch (error) {
      store.setError('Failed to delete project');
      throw error;
    }
  };

  return {
    ...store,
    loadProjects,
    createProject,
    updateProject,
    deleteProject
  };
}
```

**File**: `src/renderer/src/hooks/useTasks.ts`

Similar hook for task operations.

#### Step 4.3: Implement Drag and Drop

**File**: `src/renderer/src/components/task/TaskBoard.tsx`

Use @dnd-kit for implementing kanban board with drag and drop.

#### Step 4.4: Create Task Components

- `TaskCard.tsx`: Individual task card
- `TaskColumn.tsx`: Column for tasks (To Do, In Progress, Done)
- `CreateTaskDialog.tsx`: Form to create new tasks
- `EditTaskDialog.tsx`: Form to edit tasks
- `TaskDetailsDialog.tsx`: View full task details

---

### Phase 5: Project Management Features (2-3 days)

#### Step 5.1: Project Components

- `ProjectSwitcher.tsx`: Quick switcher with command palette
- `ProjectList.tsx`: List of all projects
- `ProjectCard.tsx`: Individual project card
- `CreateProjectDialog.tsx`: Create new project
- `EditProjectDialog.tsx`: Edit project details

#### Step 5.2: Project Templates

Create predefined project templates with default settings.

---

### Phase 6-10: Continue Implementation

Follow the phases outlined in PROJECT_INSTRUCTIONS.md for:
- State Management & Data Synchronization
- Desktop App Features
- Styling & User Experience
- Data Export & Import
- Testing & Build Configuration

---

## Development Checklist

### Setup Phase
- [ ] Install all dependencies
- [ ] Configure shadcn/ui
- [ ] Set up project structure
- [ ] Configure Tailwind CSS

### Database Phase
- [ ] MongoDB connection
- [ ] Project model
- [ ] Task model
- [ ] Service layer
- [ ] IPC handlers

### Frontend Phase
- [ ] Type definitions
- [ ] Zustand stores
- [ ] Custom hooks
- [ ] Layout components
- [ ] Task board with drag-and-drop
- [ ] Project management UI

### Features Phase
- [ ] CRUD operations for projects
- [ ] CRUD operations for tasks
- [ ] Task filtering and search
- [ ] Project switching
- [ ] Task prioritization
- [ ] Due dates and reminders

### Polish Phase
- [ ] Dark/light theme
- [ ] Animations
- [ ] Error handling
- [ ] Loading states
- [ ] Desktop notifications
- [ ] Keyboard shortcuts

### Testing Phase
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests

### Build Phase
- [ ] Production build
- [ ] Package for Windows
- [ ] Package for macOS
- [ ] Package for Linux

---

## Next Steps

1. Start with Phase 1: Install shadcn/ui and set up the component library
2. Create the database models and services
3. Build the IPC communication layer
4. Implement the core UI components
5. Add task board functionality with drag-and-drop
6. Continue with remaining phases

---

*This development plan should be followed sequentially, with each phase building upon the previous one.*
