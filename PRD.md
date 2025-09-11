# Product Requirements Document: CardStaxx (v1.0)

## 1. Introduction
CardStaxx is a dynamic, visual knowledge management tool designed to help users capture, organize, and connect ideas. It uses a spatial canvas to provide a fluid and interconnected way to manage information, moving beyond traditional linear note-taking.

## 2. Goals and Objectives
*   **Primary Goal:** To create a local-first desktop application for visual knowledge management.
*   **Core Objectives:**
    *   Provide an infinite canvas for users to spatially organize virtual notecards.
    *   Enable the creation of "stacks" of cards and directed connections between them.
    *   Offer powerful filtering and visualization tools, including a dynamic timeline.
    *   Ensure data is stored locally on the user's machine for privacy and offline access.

## 3. Proposed Technology Stack
*   **Application Framework:** Electron
*   **UI Library:** React with TypeScript
*   **Canvas Library:** Konva.js (via `react-konva`)
*   **Data Format:** Local JSON file for data persistence.

## 4. Core Data Entities

### 4.1. Notecard
The fundamental unit of information.
*   `id`: Unique identifier.
*   `title`: The title of the card.
*   `content`: The body of the note (text, lists).
*   `width`: Optional width (defaults to 200px if not specified).
*   `height`: Optional height (defaults to 150px if not specified).
*   `tags`: An array of string tags for filtering.
*   `key`: An optional string for the "Focus & Filter" feature.
*   `date`: The creation date of the card.
*   `position`: X/Y coordinates on the canvas.
*   `stackId`: The ID of the stack it belongs to (can be null).

### 4.2. Connection
A directed relationship between two stacks of notecards.
*   `id`: Unique identifier.
*   `sourceStackId`: The ID of the origin stack.
*   `targetStackId`: The ID of the destination stack.
*   `label`: An optional name for the connection.

## 5. Feature Specifications

### 5.1. Main Interface
*   **Sidebar:** A fixed control panel on the left containing:
    *   Buttons for Card Creation.
    *   A toggle button for the Timeline view.
    *   Global text search and a tag-based filtering section.
    *   Canvas zoom controls.
    *   A display for the total number of notecards.
*   **Canvas:** The main interactive workspace where notecards, stacks, and connections are rendered and manipulated.

### 5.2. Card & Stack Management
*   **Card Creation:** New cards are created via the sidebar and appear on the canvas. The `date` field defaults to the current day.
*   **Card Resizing:** Individual cards can be resized using drag handles, with width and height stored per card.
*   **Stacking:**
    *   **Creation:** Dragging and dropping a card onto another card creates a new stack.
    *   **Adding:** Dropping a card onto an existing stack adds it to that stack.
    *   **Size Adoption:** When cards are combined into stacks, all cards adopt the largest dimensions present (width and height are unified).
*   **Stack Visualization (Rolodex View):** Stacks display the top card fully, with the headers of subsequent cards visible behind it. Stack dimensions are determined by the top card's size.
*   **Stack Interaction:**
    *   The mouse scroll wheel cycles through cards in a stack.
    *   Entire stacks can be moved by dragging them.
    *   Double-click cards to edit title and content with in-place text overlays.

### 5.3. Connections
*   **Drag-and-Drop Connection:** Users can create a directed connection by dragging a connection handle (a small visual indicator) from a source stack and dropping it onto a target stack. A dynamic line will track the mouse during the drag operation.
*   **Connection Positioning:** Connection lines start and end at the center of each stack (accounting for all cards in the stack), providing consistent visual connections regardless of stack size.

### 5.4. Search & Filtering
*   **Global Search/Filter:** The canvas view updates in real-time as the user types in the search bar or selects tags.
*   **Focus & Filter:** When a user focuses on a card possessing a `key`, all downstream connected stacks are filtered to display only cards that share the same `key`.

### 5.5. Timeline View
*   **Activation:** Toggled by a button in the sidebar.
*   **Display:** A horizontal bar at the bottom of the canvas showing the date range of *filtered* cards.
*   **Interaction:**
    *   Each card is represented by an icon on the timeline.
    *   Hovering over an icon (or group of icons) shows a tooltip with card titles and highlights the card on the canvas.
    *   Clicking an icon scrolls the card to the front of its stack and highlights it.
    *   A visual line connects the timeline icon to its corresponding card on the canvas.

### 5.6. Data Persistence (Implemented)
*   The application is **local-first** with full data persistence capabilities.
*   **File Format**: Workspace data is saved in JSON format with .cardstaxx extension containing:
    *   Version information and timestamps (created, last modified)
    *   Complete stack data including card positions and dimensions
    *   All connection relationships between stacks
*   **File Operations**: New, Save, Load, and Save As functionality with native file dialogs
*   **Change Tracking**: Visual indicators show unsaved changes with asterisk (*) notation
*   **Auto-Resume**: Application automatically loads the last opened workspace on startup
*   **Error Recovery**: Robust handling of missing, moved, or corrupted workspace files
*   **Settings Management**: User preferences and recent file history stored in app data directory

## 6. Future Considerations
*   **Database Scalability:** For improved performance and scalability, the JSON file storage will be replaced with a more efficient embedded database solution (e.g., SQLite) in a future version.
*   **Cloud Sync/Web App:** The architecture should allow for a future transition to a client-server model to enable web access and cloud synchronization.

## 7. Out of Scope (v1.0)
*   Real-time multi-user collaboration.
*   Mobile/tablet applications.
*   Advanced data import/export from other formats.
*   Version history for notecards.
