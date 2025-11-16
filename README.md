# Multi-Project Task Board Manager

<div align="center">

A modern desktop application for managing multiple task boards (projects) with a beautiful kanban-style interface. Built with Electron, React, TypeScript, MongoDB, Tailwind CSS, and shadcn/ui.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

</div>

## ✨ Features

- 🎯 **Multi-Project Support**: Manage multiple task boards, each representing a different project
- 📋 **Kanban Board**: Visual drag-and-drop interface with To Do, In Progress, and Done columns
- 🎨 **Modern UI**: Beautiful, accessible components using shadcn/ui and Tailwind CSS
- 🗄️ **Persistent Storage**: MongoDB database for reliable data persistence with auto-startup
- ⚡ **Fast & Responsive**: Built with Vite for lightning-fast development and builds
- 🔒 **Type-Safe**: Full TypeScript support throughout the stack
- 🖥️ **Cross-Platform**: Native desktop app for Windows, macOS, and Linux
- 🎯 **Task Management**: Priority levels, due dates, labels, and checklists
- 🔄 **Zero Configuration**: MongoDB automatically starts with the app - no setup required
- 📱 **System Tray Integration**: Run in background with quick access from system tray
- 💾 **Easy Import/Export**: Backup and restore your data easily



## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **pnpm** (install with: `npm install -g pnpm`)
- **Docker Desktop** (or Docker Engine) with **docker-compose** support

> **Note**: MongoDB is **always run in Docker** via `docker-compose.yml`:
> - **Development**: `pnpm dev` auto-starts the `mongodb` service (`taskboard_mongo` on port `27018`)
> - **Production**: Run `docker-compose up -d mongodb` to provide the MongoDB instance the app will connect to
> - **Configurable**: You can override the default URI by setting `MONGODB_URI`

### Installation

```bash
# Clone the repository
cd /your/path/here

# Install dependencies
pnpm install


### Development

```bash
# Start the development server (MongoDB auto-starts via Docker)
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

### First Launch (Production Build)

When you run the built application for the first time:

1. **Ensure Docker is running** (Docker Desktop started, or Docker Engine active).
2. **Start MongoDB via Docker Compose**:
   - From the project directory or deployment folder, run: `docker-compose up -d mongodb`
3. **Launch the app** (installer / packaged build or `pnpm start` in preview mode).

> **Tip**: If the app shows database connection errors, check that the `taskboard_mongo` container is running (`docker ps`) and listening on port `27018`, or adjust `MONGODB_URI` accordingly.

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
### Desktop Integration

- **System tray integration**: Minimize to tray, quick access to common actions
- **Native notifications**: Desktop notifications for important events
- **Keyboard shortcuts**:
  - `Ctrl/Cmd + N` - New Task
  - `Ctrl/Cmd + Shift + N` - New Project
  - `Ctrl/Cmd + E` - Export Data
  - `Ctrl/Cmd + I` - Import Data
  - `Ctrl/Cmd + Shift + T` - Toggle window visibility
- **Window state persistence**: Remember size, position, and maximized state
- **Cross-platform support**: Consistent experience on Windows, macOS, and Linux
- **Comprehensive logging**: Access logs via Help → Open Log File for troubleshooting descriptions

### Desktop Integration

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
# Development
pnpm dev              # Start development server (auto-starts MongoDB in Docker)
pnpm start            # Start built app in preview mode (expects MongoDB Docker container running)

# Building
pnpm build            # Build for production
pnpm build:win        # Build Windows installer
pnpm build:mac        # Build macOS installer
pnpm build:linux      # Build Linux installer

# Code Quality
pnpm typecheck        # Type checking
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
```

### Development Workflow
## 🐛 Troubleshooting

### App Won't Open After Installation

1. Check the log file: Help → Open Log File (or `%APPDATA%\taskboard\logs\`)
2. Ensure **Docker** is running (Docker Desktop started)
3. Ensure the MongoDB container is running: `docker ps` should show `taskboard_mongo`
4. Try running as administrator if permission errors occur

### MongoDB Connection Issues

- **Docker MongoDB (default)**:
  - Check that the `taskboard_mongo` container is running and listening on port `27018`
  - View container logs with `pnpm mongo:logs` or `docker logs taskboard_mongo`
- **Custom MongoDB URI**: If using `MONGODB_URI`, verify the URI and that the instance is reachable

### Loading Screen Stuck

- If stuck for more than 1–2 minutes, close and restart the app
- Check that Docker and the MongoDB container are running
- Review logs for connection timeouts or authentication errors

## 🙏 Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- DB used [MongoDB](https://docs.mongodb.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
