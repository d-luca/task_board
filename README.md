# Multi-Project Task Board Manager

A modern desktop application for managing multiple task boards (projects) with a beautiful kanban-style interface. Built with Electron, React, TypeScript, MongoDB, Tailwind CSS, and shadcn/ui.

## ✨ Features

- 🎯 **Multi-Project Support**: Manage multiple task boards, each representing a different project
- 📋 **Kanban Board**: Visual drag-and-drop interface with To Do, In Progress, and Done columns
- 🎨 **Modern UI**: Beautiful, accessible components using shadcn/ui and Tailwind CSS
- 🗄️ **Persistent Storage**: MongoDB database for reliable data persistence
- ⚡ **Fast & Responsive**: Built with Vite for lightning-fast development and builds
- 🔒 **Type-Safe**: Full TypeScript support throughout the stack
- 🖥️ **Cross-Platform**: Native desktop app for Windows, macOS, and Linux
- 🎯 **Task Management**: Priority levels, due dates, labels, and checklists
- 🔍 **Search & Filter**: Powerful filtering and search capabilities
- 📊 **Project Statistics**: Track completion rates and task counts

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get started quickly with setup instructions
- **[PROJECT_INSTRUCTIONS.md](./PROJECT_INSTRUCTIONS.md)** - Complete project overview and requirements
- **[DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)** - Detailed phase-by-phase implementation guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and data flow diagrams
- **[CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md)** - Summary of project modifications

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **pnpm** (install with: `npm install -g pnpm`)
- **MongoDB** v5.0 or higher (local or MongoDB Atlas)

### Installation

```bash
# Clone the repository
cd d:\Home\Projects\Electron\task_board

# Install dependencies
pnpm install

# Install shadcn/ui components
pnpm dlx shadcn-ui@latest init
pnpm dlx shadcn-ui@latest add button card dialog input label select textarea dropdown-menu popover calendar badge toast skeleton command separator

# Install additional packages
pnpm add mongoose zod react-hook-form @hookform/resolvers
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
pnpm add lucide-react class-variance-authority clsx tailwind-merge zustand date-fns
```

### Development

```bash
# Start MongoDB (if using local installation)
net start MongoDB

# Start the development server
pnpm dev
```

The app will open in a new window with hot reload enabled.

### Build

```bash
# Build for production
pnpm build

# Package for Windows
pnpm build:win

# Package for macOS
pnpm build:mac

# Package for Linux
pnpm build:linux
```

## 🏗️ Technology Stack

### Frontend
- **React 18+** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Accessible component library
- **@dnd-kit** - Drag and drop functionality
- **Zustand** - Lightweight state management
- **React Hook Form + Zod** - Form validation

### Desktop Framework
- **Electron** - Cross-platform desktop framework
- **Electron Builder** - Packaging and distribution

### Backend & Database
- **MongoDB** - Document database
- **Mongoose** - MongoDB ODM
- **Node.js** - JavaScript runtime

### Development Tools
- **Vite** - Fast build tool
- **pnpm** - Efficient package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📁 Project Structure

```
task_board/
├── src/
│   ├── main/                    # Electron main process
│   │   ├── index.ts
│   │   ├── database/            # MongoDB models and services
│   │   └── ipc/                 # IPC handlers
│   ├── preload/                 # Preload scripts
│   │   └── index.ts             # IPC bridge
│   └── renderer/                # React frontend
│       ├── src/
│       │   ├── components/      # React components
│       │   │   ├── ui/          # shadcn/ui components
│       │   │   ├── layout/      # Layout components
│       │   │   ├── project/     # Project components
│       │   │   └── task/        # Task components
│       │   ├── hooks/           # Custom React hooks
│       │   ├── store/           # Zustand stores
│       │   ├── types/           # TypeScript types
│       │   └── lib/             # Utilities
│       └── index.html
├── docs/                        # Documentation
├── package.json
├── electron.vite.config.ts
├── tailwind.config.js
└── components.json              # shadcn/ui config
```

## 🎯 Key Features Details

### Multi-Project Management
- Create and manage multiple independent task boards
- Quick project switching with keyboard shortcuts
- Project customization (colors, icons, settings)
- Archive completed projects

### Task Board
- Kanban-style board with drag-and-drop
- Three default columns: To Do, In Progress, Done
- Visual indicators for priority and due dates
- Task filtering and search within projects

### Task Management
- Rich task details with descriptions
- Priority levels (High, Medium, Low)
- Due dates with notifications
- Labels and categories
- Checklists within tasks
- Task archiving

### Desktop Integration
- System tray integration
- Native notifications
- Keyboard shortcuts
- Window state persistence
- Cross-platform support

## 🛠️ Development

### Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- Extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript Hero
  - ES7+ React/Redux/React-Native snippets

### Available Commands

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm typecheck        # Type checking
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
```

### Development Workflow

1. Read [QUICK_START.md](./QUICK_START.md) for initial setup
2. Follow [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) for implementation
3. Refer to [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
4. Test features as you build them

## 📖 Learning Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Zustand](https://zustand-demo.pmnd.rs)
- [@dnd-kit](https://docs.dndkit.com)

## 🤝 Contributing

This is a learning project. Feel free to:
- Fork the repository
- Create feature branches
- Submit pull requests
- Report issues
- Suggest improvements

## 📝 License

MIT License - feel free to use this project for learning and development.

## 🎓 Learning Objectives

By completing this project, you will learn:
- Modern React patterns with TypeScript
- Electron desktop app development
- MongoDB integration and data modeling
- State management with Zustand
- Component library usage (shadcn/ui)
- Drag-and-drop implementation
- IPC communication in Electron
- Desktop app packaging and distribution

---

**Status**: In Development 🚧

For detailed implementation steps, see [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)
