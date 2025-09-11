# CardStaxx Development Status

This document tracks the progress of implementing features in the CardStaxx application.

## Current Feature: Connecting Stacks

- [x] Update state in `App.tsx`: Add `connectionMode`, `sourceStackId`, and `connections` state variables. Create placeholder handler functions.
- [x] Update `Sidebar.tsx`: Hook up the "Connect From" button and visually indicate connection mode.
- [x] Update `Canvas.tsx` and `Stack.tsx`: Add the `onClick` handler to stacks.
- [x] Implement Connection Logic: Fill in the `handleStackClick` function in `App.tsx` to create connections.
- [x] Render the Lines: Add the rendering logic for connections to `Canvas.tsx`.

## Completed Features

-   **Project Setup:**
    -   Initialized Electron/React/TypeScript project.
    -   Configured Webpack and Electron Forge.
    -   Created basic UI layout (Sidebar and Canvas).
-   **Card Creation:**
    -   Implemented creation of new cards (as single-card stacks).
    -   Cards are draggable.
    -   Card positions are saved after dragging.
-   **Stacking Cards:**
    -   Refactored data structure to support stacks.
    -   Implemented merging of stacks on drag-and-drop collision.
    -   Implemented "Rolodex" view for stacks (visualizing multiple cards).
    -   Implemented z-index fix for dragging (dragged stack appears on top).
    -   Implemented stack scrolling (mouse wheel cycles cards in a stack).
-   **Connecting Stacks (Drag-and-Drop):**
    -   [x] Implemented drag-and-drop connection from a handle on each stack.
    -   [x] Dynamic line tracks mouse while dragging.
    -   [x] Connection is made on drop onto a target stack.
    -   [x] Connection lines appear on top of stacks.
    -   [x] Fixed connection positioning to start from stack center (not bottom card center).
-   **Card Resizing:**
    -   [x] Implemented resize handles on cards for dynamic width/height adjustment.
    -   [x] Added size adoption logic when dropping cards onto stacks.
    -   [x] Stack resizing: larger cards resize the target stack, smaller cards adopt stack size.
-   **In-place Text Editing:**
    -   [x] Double-click to edit card titles and content with overlay text inputs.
    -   [x] Text editing with proper positioning and styling alignment.
-   **Data Persistence:**
    -   [x] JSON-based workspace save/load functionality with .cardstaxx file format.
    -   [x] File dialogs for New, Save, Load, and Save As operations.
    -   [x] Change tracking with visual indicators for unsaved modifications.
    -   [x] Auto-load of last opened workspace on application startup.
    -   [x] Robust error handling for missing or corrupted workspace files.
    -   [x] Settings storage for user preferences and recent file tracking.
