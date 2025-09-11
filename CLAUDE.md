# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm start` - Run in development mode with hot-reloading and DevTools
- `npm run package` - Package the application for current OS (output in `out/`)
- `npm run make` - Create platform-specific installers (output in `out/`)

### Notes
- No test framework is currently configured (`npm test` exits with error)
- No lint or typecheck commands are available in package.json

## Project Architecture

CardStaxx is an Electron-based desktop application for visual knowledge management using a spatial canvas interface.

### Technology Stack
- **Framework**: Electron with React + TypeScript
- **Canvas**: Konva.js via react-konva for 2D canvas operations
- **Build**: Electron Forge with Webpack
- **Bundling**: Webpack with TypeScript compilation

### Key Architectural Concepts

#### Data Model (`src/types.ts`)
- **NotecardData**: Individual notes with id, title, and content
- **StackData**: Groups of cards with position (x, y) and cards array
- **ConnectionData**: Directed relationships between stacks (from/to stackIds)

#### Component Architecture
- **App.tsx**: Main application state and event handlers
  - Manages stacks, connections, and editing state
  - Handles drag-and-drop operations for stacks and connections
  - Manages card editing overlay positioning
- **Canvas.tsx**: Konva-based rendering layer for stacks and connections
- **Stack.tsx**: Individual stack rendering with card cycling
- **Notecard.tsx**: Individual card display within stacks
- **Sidebar.tsx**: Control panel for card creation
- **EditableTextOverlay.tsx**: DOM overlay for text editing

#### Key Features
- **Spatial Canvas**: Infinite workspace for arranging notecards
- **Stack System**: Cards can be grouped into draggable stacks
- **Rolodex View**: Visual browsing of cards within stacks (mouse wheel cycling)
- **Connections**: Drag-and-drop directed connections between stacks
- **In-place Editing**: Double-click to edit card titles and content

#### File Organization
```
src/
├── index.tsx           # React app entry point
├── App.tsx             # Main app component and state
├── types.ts            # TypeScript interfaces
└── components/         # React components
    ├── Canvas.tsx      # Konva canvas layer
    ├── Stack.tsx       # Stack rendering
    ├── Notecard.tsx    # Individual card
    ├── Sidebar.tsx     # Control panel
    └── EditableTextOverlay.tsx  # Text editing overlay
electron/
└── main.ts             # Electron main process
```

### Build Configuration
- **Electron Forge**: Configured in `forge.config.js` with webpack plugin
- **TypeScript**: Standard config with React JSX, CommonJS modules
- **Webpack**: Separate configs for main and renderer processes
- **Security**: Electron fuses enabled for security hardening

### Development Notes
- Cards use fixed dimensions (200x150px) defined in App.tsx constants
- Stack collision detection for drag-and-drop operations
- Editing state managed through overlay positioning calculations
- DevTools automatically opened in development mode
- Local-first architecture (no server dependencies)

### Data Persistence
Currently not implemented but planned as local JSON file storage (see PRD.md for future database considerations).