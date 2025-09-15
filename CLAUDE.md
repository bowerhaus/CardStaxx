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
- **StackData**: Groups of cards with position (x, y), cards array, and optional editable title
- **ConnectionData**: Directed relationships between stacks with optional labels
- **Color Palette**: Predefined card background colors with utility functions
- **Data Migration**: Backward compatibility utilities for existing files

#### Modular Architecture (Refactored September 2025)
- **App.tsx**: Simplified orchestrator component (249 lines, reduced from 1886 lines)
  - Composes custom hooks for state management
  - Renders main layout and passes props to child components
  - No longer contains business logic directly

#### Custom Hooks (`src/hooks/`)
- **useWorkspace**: File operations, save/load/new workspace functionality
- **useEditingState**: Centralized editing state for cards, stacks, and connections
- **useFocusMode**: Focus mode toggle, zoom controls, and view transformations
- **useSearch**: Search functionality, filtering, and result management
- **useCardOperations**: Card CRUD operations, color picker, delete confirmation
- **useStackOperations**: Stack management, drag-and-drop, wheel navigation
- **useConnectionOperations**: Connection creation, editing, deletion
- **useTimeline**: Timeline visibility and card interaction handlers

#### Business Logic Services (`src/services/`)
- **workspaceService**: Data migration utilities for backward compatibility
- **demoDataService**: Lord of the Rings movie analysis demo data generation

#### Utility Functions (`src/utils/`)
- **positionCalculations**: Card screen positioning and overlay calculations

#### Component Architecture
- **Canvas.tsx**: Konva-based rendering layer for stacks and connections
- **Stack.tsx**: Individual stack rendering with card cycling
- **Notecard.tsx**: Individual card display within stacks
- **Sidebar.tsx**: Control panel for card creation
- **EditableTextOverlay.tsx**: DOM overlay for text editing

#### Key Features
- **Spatial Canvas**: Infinite workspace for arranging notecards with canvas panning via drag in empty space
- **Enhanced Stack System**: Cards can be grouped into draggable stacks with improved visual hierarchy
- **Editable Stack Titles**: Multi-card stacks support double-click-to-edit titles with X/Y card count display
- **Rolodex View**: Visual browsing of cards within stacks with progressive scaling perspective effect
- **Connections**: Drag-and-drop directed connections between stacks with optional labels
- **In-place Editing**: Double-click to edit card titles, content, and stack titles
- **Rich Card Fields**: Date, key, tags, and background color support with visual display
- **Advanced Resize**: Card resize handles with proper mouse tracking and stack-wide resize functionality
- **Focus Mode**: Toggle-able focus mode with target icon (🎯) that automatically frames visible cards, disables zoom controls when active, and maintains separate view settings for normal and focus modes
- **Timeline System**: Viewport-fixed timeline at bottom showing dated cards with connection lines to stacks
- **Visual Enhancements**: Enhanced stack borders, scaling effects, and field positioning

#### File Organization (Updated September 2025)
```
src/
├── index.tsx           # React app entry point
├── App.tsx             # Simplified orchestrator component (249 lines)
├── types.ts            # TypeScript interfaces
├── hooks/              # Custom React hooks for state management
│   ├── useWorkspace.ts
│   ├── useEditingState.ts
│   ├── useFocusMode.ts
│   ├── useSearch.ts
│   ├── useCardOperations.ts
│   ├── useStackOperations.ts
│   ├── useConnectionOperations.ts
│   └── useTimeline.ts
├── services/           # Business logic services
│   ├── workspaceService.ts
│   └── demoDataService.ts
├── utils/              # Utility functions
│   └── positionCalculations.ts
├── constants/          # Application constants
│   ├── typography.ts
│   └── layout.ts
└── components/         # React UI components
    ├── Canvas.tsx      # Konva canvas layer
    ├── Stack.tsx       # Stack rendering
    ├── Notecard.tsx    # Individual card
    ├── Sidebar.tsx     # Control panel
    ├── Timeline.tsx    # Viewport-fixed timeline with connection lines
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
- Canvas panning via drag in empty space with grab/grabbing cursor states
- Timeline positioned with fixed viewport positioning, independent of canvas transformations
- Timeline connection lines use coordinate transformation from canvas space to viewport space
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