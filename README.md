# CardStaxx

CardStaxx is a desktop visual knowledge management application designed to help you capture, organize, and connect your ideas on an intuitive spatial canvas.

## Features

*   **Spatial Canvas:** An infinite workspace to arrange your thoughts.
*   **Notecards:** Create individual notes with titles and content.
*   **Stacks:** Group related notecards into draggable stacks.
    *   **Rolodex View:** Visually browse cards within a stack.
    *   **Stack Scrolling:** Use your mouse wheel to cycle through cards in a stack.
*   **Connections:** Draw directed lines between stacks to represent relationships.
    *   **Drag-and-Drop Connection:** Create connections by dragging a handle from one stack to another.

## Installation

### Prerequisites

Before you begin, ensure you have the following installed on your system:

*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   [npm](https://www.npmjs.com/) (comes with Node.js)

### General Installation Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/CardStaxx.git # Replace with your repo URL
    cd CardStaxx
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Platform-Specific Notes

*   **macOS / Windows:** The general installation steps above are sufficient. Electron handles cross-platform compatibility.

## Running in Development Mode

To run CardStaxx in development mode with hot-reloading and developer tools enabled:

```bash
npm start
```

This command will:
*   Compile the application code.
*   Launch the Electron desktop window.
*   Open the Chromium Developer Tools for debugging.

## Building Executables

You can build distributable executables for various platforms using Electron Forge.

### Package Application

This command packages the application into a distributable format for your current operating system, but does not create an installer.

```bash
npm run package
```

The output will be located in the `out/` directory.

### Make Installers

This command creates platform-specific installers (e.g., `.dmg` for macOS, `.exe` for Windows, `.deb` for Linux).

```bash
npm run make
```

The installers will also be located in the `out/` directory.

## Technology Stack

*   **Electron:** Cross-platform desktop application framework.
*   **React:** JavaScript library for building user interfaces.
*   **TypeScript:** Typed superset of JavaScript.
*   **Konva.js:** HTML5 Canvas JavaScript framework for 2D transformations on shapes.
*   **Electron Forge:** Tooling for Electron app development, including packaging and making.
*   **Webpack:** Module bundler.
