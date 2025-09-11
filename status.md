# CardStaxx Development Status

This document tracks the progress of implementing features in the CardStaxx application.

## Current Feature: Connecting Stacks

- [x] Update state in `App.tsx`: Add `connectionMode`, `sourceStackId`, and `connections` state variables. Create placeholder handler functions.
- [ ] Update `Sidebar.tsx`: Hook up the "Connect From" button and visually indicate connection mode.
- [ ] Update `Canvas.tsx` and `Stack.tsx`: Add the `onClick` handler to stacks.
- [ ] Implement Connection Logic: Fill in the `handleStackClick` function in `App.tsx` to create connections.
- [ ] Render the Lines: Add the rendering logic for connections to `Canvas.tsx`.

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
