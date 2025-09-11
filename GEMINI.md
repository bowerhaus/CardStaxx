# GEMINI Project Context: CardStaxx

## Project Overview

This project, **CardStaxx**, is a desktop visual knowledge management application built with Electron. It allows users to create, connect, and organize ideas on a spatial canvas, as detailed in the `PRD.md` file.

The core technologies are:
*   **Application Framework:** [Electron](https://www.electronjs.org/) for creating the cross-platform desktop application.
*   **User Interface:** [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/) for building the user interface.
*   **Canvas/Graphics:** [Konva.js](https://konvajs.org/) for the interactive 2D canvas where cards are manipulated.
*   **Build System:** [Electron Forge](https://www.electronforge.io/) with a custom [Webpack](https://webpack.js.org/) configuration to compile and bundle the TypeScript code.

The architecture consists of two main processes:
1.  **Main Process:** (`electron/main.ts`) A Node.js environment responsible for creating and managing the application window and other OS-level interactions.
2.  **Renderer Process:** (`src/index.tsx`) The user interface, built with React, which runs in the Electron browser window.

Key features implemented include:
*   **Card and Stack Management:** Creation of cards and stacks, drag-and-drop stacking, "Rolodex" view for stacks, and mouse wheel scrolling through stack cards.
*   **Drag-and-Drop Connections:** Intuitive creation of directed connections between stacks by dragging a handle from one stack to another.

## Building and Running

### Prerequisites
*   [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/)

### Installation
Install all project dependencies from `package.json`:
```bash
npm install
```

### Running in Development
To start the application in development mode with hot-reloading:
```bash
npm start
```
This will launch the application window and open the browser DevTools.

### Packaging and Distribution
To package the application into an executable file for your current platform:
```bash
npm run package
```

To create a distributable installer (e.g., `.dmg` on macOS, `.exe` on Windows, `.deb` on Linux):
```bash
npm run make
```

## Development Conventions

*   **File Structure:**
    *   `electron/`: Contains the source code for the Electron main process.
    *   `public/`: Holds static assets, primarily the `index.html` shell for the React app.
    *   `src/`: Contains the source code for the React renderer process (the UI).
    *   `forge.config.js`: Configuration for Electron Forge.
    *   `webpack.*.js`: Webpack configuration files for the build process.

*   **Code Style:** The project uses TypeScript. Currently, there is no automated linter (like ESLint) or formatter (like Prettier) configured. This would be a good addition to ensure code consistency.

*   **Testing:**
    *   **TODO:** No testing framework (e.g., Jest, Vitest) has been configured. The default `npm test` script is a placeholder. Setting up a testing environment is a recommended next step.
