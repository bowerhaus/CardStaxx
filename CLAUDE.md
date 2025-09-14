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
- **NotecardData**: Individual notes with id, title, content, date (mandatory), tags, key, backgroundColor, and dimensions
- **StackData**: Groups of cards with position (x, y) and cards array
- **ConnectionData**: Directed relationships between stacks with optional labels
- **Color Palette**: Predefined card background colors with utility functions
- **Data Migration**: Backward compatibility utilities for existing files

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
- **Enhanced Stack System**: Cards can be grouped into draggable stacks with improved visual hierarchy
- **Rolodex View**: Visual browsing of cards within stacks with progressive scaling perspective effect
- **Connections**: Drag-and-drop directed connections between stacks with optional labels
- **In-place Editing**: Double-click to edit card titles and content
- **Rich Card Fields**: Date, key, tags, and background color support with visual display
- **Advanced Resize**: Card resize handles with proper mouse tracking and stack-wide resize functionality
- **Focus Mode**: Toggle-able focus mode with target icon (🎯) that automatically frames visible cards, disables zoom controls when active, and maintains separate view settings for normal and focus modes
- **Visual Enhancements**: Enhanced stack borders, scaling effects, and field positioning

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
- Cards use default dimensions (200x150px) but support individual resizing
- Stack collision detection for drag-and-drop operations
- Editing state managed through overlay positioning calculations
- DevTools automatically opened in development mode
- Local-first architecture (no server dependencies)
- Progressive scaling for rolodex perspective effect (top card 100%, others 98%, 96%, etc.)
- Resize handles use proper coordinate transformations for scaled cards
- Stack-wide resize functionality - resizing any card affects all cards in the stack

### Data Persistence
**Fully Implemented**: Complete JSON-based workspace persistence system
- **.cardstaxx file format**: JSON workspace files with version control
- **File Operations**: New, Save, Load, Save As with native dialogs
- **Auto-resume**: Automatically loads last opened workspace on startup
- **Change Tracking**: Visual indicators (*) for unsaved changes
- **Data Migration**: Backward compatibility for existing files
- **Error Handling**: Robust handling of corrupted or missing files
- **Settings Storage**: User preferences and recent files in app data directory
- Always use status.md as a stepwise implementation plan. as you progress through the steps make sure you check them off if status.md and keep a record of what you are currently working on in this file.