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
*   `title`: The title of the card (displayed prominently on card).
*   `content`: The body of the note supporting markdown formatting.
*   `width`: Optional width (defaults to 200px if not specified).
*   `height`: Optional height (defaults to 150px if not specified).
*   `tags`: An array of string tags for filtering (displayed on card).
*   `key`: An optional string for the "Focus & Filter" feature (displayed on card when present).
*   `date`: The creation date of the card (displayed on card, defaults to current date).
*   `backgroundColor`: The background color from a fixed palette of 20 pastel colors.
*   `position`: X/Y coordinates on the canvas.
*   `stackId`: The ID of the stack it belongs to (can be null).

### 4.2. Connection
A directed relationship between two stacks of notecards.
*   `id`: Unique identifier.
*   `sourceStackId`: The ID of the origin stack.
*   `targetStackId`: The ID of the destination stack.
*   `label`: An optional name for the connection (editable by clicking on the connection label).

## 5. Feature Specifications

### 5.1. Main Interface
*   **Sidebar:** A fixed control panel on the left containing:
    *   Buttons for Card Creation.
    *   A toggle button for the Timeline view.
    *   Global text search field.
    *   Tag Cloud: An alphabetically sorted, multi-select tag filtering interface that dynamically populates with all available tags from cards.
    *   Statistics panel displaying the total number of notecards.
    *   Canvas zoom controls.
*   **Canvas:** The main interactive workspace where notecards, stacks, and connections are rendered and manipulated.

### 5.2. Card & Stack Management
*   **Card Creation:** New cards are created via the sidebar and appear on the canvas. The `date` field defaults to the current day, and users can select background colors from a fixed palette of 20 pastel colors.
*   **Card Deletion:** Individual cards can be deleted with confirmation dialogs. No undo functionality is provided.
*   **Card Editing:** 
    *   **Text Content:** Double-click cards to edit title and content with in-place text overlays. Content supports markdown formatting (rendered in display mode, raw markdown shown when editing).
    *   **Field-Specific Editing:** 
        *   Click date icons (📅) to edit dates with date picker input and consistent format handling
        *   Click key icons (🔑) to edit key values with proper positioning and font sizing
        *   Click tag icons (🏷️) to edit tags with automatic lowercase formatting and comma separation
        *   All editing overlays use appropriate font sizes matching their display counterparts
    *   **Background Colors:** Cards can have their background color changed from a palette of 20 pastel colors.
*   **Card Resizing:** Cards can be resized using drag handles on the top (most visible) card in each stack. When a card in a stack is resized, all cards in that stack are resized to maintain visual consistency.
*   **Stacking:**
    *   **Creation:** Dragging and dropping a card onto another card creates a new stack.
    *   **Adding:** Dropping a card onto an existing stack adds it to that stack.
    *   **Size Adoption:** When cards are combined into stacks, all cards adopt the largest dimensions present (width and height are unified).
*   **Stack Visualization (Rolodex View):** 
    *   Stacks display the top card fully, with only the titles of subsequent cards visible behind it in a subtle staggered perspective view (getting progressively smaller toward the distance).
    *   Stacks are rendered with a dotted border around all cards.
    *   A header at the top-left shows "Card X of Y" to indicate position within the stack.
    *   Stack dimensions are determined by the top card's size.
*   **Stack Interaction:**
    *   The mouse scroll wheel cycles through cards in a stack with smooth animation.
    *   Entire stacks can be moved by dragging them.
    *   Individual cards within stacks can be edited by double-clicking.

### 5.3. Connections
*   **Drag-and-Drop Connection:** Users can create a directed connection by dragging a connection handle (a small visual indicator) from a source stack and dropping it onto a target stack. A dynamic line will track the mouse during the drag operation.
*   **Connection Positioning:** Connection lines start and end at the center of each stack (accounting for all cards in the stack), providing consistent visual connections regardless of stack size.
*   **Connection Management:**
    *   **Naming:** Connections can be given custom names/labels that are displayed along the connection line.
    *   **Editing:** Connection names can be edited by clicking on the connection label.
    *   **Deletion:** Connections can be deleted by clicking on their name label and selecting delete.
    *   **Automatic Cleanup:** When a stack is deleted, all connections to/from that stack are automatically removed.

### 5.4. Search & Filtering
*   **Global Search/Filter:** The canvas view updates in real-time as the user types in the search bar or selects tags from the tag cloud.
*   **Tag Cloud Filtering:** Users can select multiple tags from the alphabetically sorted tag cloud in the sidebar to filter cards. Selected tags are combined with AND logic.
*   **Focus & Filter:** When a user focuses on a card possessing a `key`, all downstream connected stacks are filtered to display only cards that share the same `key`.

### 5.5. Timeline View
*   **Activation:** Toggled by a button in the sidebar.
*   **Display:** A horizontal bar at the bottom of the canvas showing the date range of *filtered* cards.
*   **Visual Markers:** Subtle vertical dashes mark the start of each week (Monday) on the timeline for better temporal orientation.
*   **Interaction:**
    *   Each card is represented by an icon on the timeline.
    *   If multiple cards share the same date, they are represented by a single group icon.
    *   Hovering over an icon (or group of icons) shows a tooltip with card titles and highlights the card on the canvas.
    *   Hovering over a card title in a tooltip list highlights both the card on the canvas and its connection line to the timeline.
    *   Clicking an icon scrolls the card to the front of its stack and highlights it with a brief yellow glow.
    *   A visual line connects the timeline icon to its corresponding card on the canvas.

### 5.6. Visual Enhancements
*   **Card Visual Elements:**
    *   **Field Display with Icons:** 
        *   Date fields are displayed with a 📅 calendar icon in dd/MM/yyyy format for consistent international date representation
        *   Key fields are displayed with a 🔑 key icon when present, supporting click-to-edit functionality
        *   All field text is properly aligned with their respective icons for visual consistency
    *   **Tag Display:** Card tags are visible on each card with a 🏷️ tag icon, automatically formatted in lowercase for consistency
    *   **Background Colors:** Each card can have a custom background color selected from a fixed palette of 20 pastel colors.
    *   **Typography & Spacing:** 
        *   Optimized font sizes across all fields (20% increase from original) for improved readability
        *   Enhanced vertical spacing between all card fields to reduce visual crowding
        *   Consistent font sizing between display and editing modes for all field types
*   **Stack Visual Features:**
    *   **Dotted Borders:** All stacks are rendered with a subtle dotted border encompassing all cards in the stack.
    *   **Stack Headers:** Each stack displays "Card X of Y" at the top-left corner to indicate the current card position within the total stack size.
    *   **Rolodex Perspective Effect:** Cards behind the top card show only their titles in a subtle staggered perspective view, with each subsequent card appearing progressively smaller to create a depth effect.

### 5.7. Data Persistence (Implemented)
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
