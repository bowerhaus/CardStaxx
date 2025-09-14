# CardStaxx

CardStaxx is a desktop visual knowledge management application designed to help you capture, organize, and connect your ideas on an infinite spatial canvas. Built with Electron, React, and TypeScript, it offers a powerful local-first approach to managing information spatially.

![CardStaxx](https://img.shields.io/badge/Version-1.0-blue) ![Platform](https://img.shields.io/badge/Platform-Desktop-green) ![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Key Features

### 🗃️ **Notecard Management**
- **Rich Card Creation**: Create notecards with titles, markdown content, dates, keys, and tags
- **Background Colors**: Choose from 20 beautiful pastel colors for visual organization
- **Field Icons**: Visual indicators for dates (📅), keys (🔑), and tags (🏷️)
- **Card Resizing**: Resize cards with drag handles, with automatic stack-wide size adoption
- **In-place Editing**: Double-click any field to edit with properly positioned overlays

### 📚 **Smart Stacking System**
- **Drag-and-Drop Stacking**: Create stacks by dragging cards onto each other
- **Rolodex View**: Visually browse cards within stacks with perspective scaling
- **Mouse Wheel Navigation**: Scroll through cards in stacks effortlessly  
- **Stack Indicators**: "Card X of Y" headers and dotted borders around stacks
- **Size Unification**: All cards in a stack adopt the largest card's dimensions

### 🔗 **Connection System**
- **Visual Relationships**: Create directed connections between stacks
- **Drag-and-Drop Creation**: Drag connection handles from one stack to another
- **Labeled Connections**: Add custom names/labels to connections (click to edit)
- **Smart Positioning**: Connections automatically center on stacks
- **Auto-Cleanup**: Connections are removed when stacks are deleted

### 🔍 **Advanced Search & Filtering**
- **Global Text Search**: Real-time search across titles, content, tags, and keys
- **Tag Cloud Filtering**: Multi-select tag filtering with AND logic
- **Key-based Focus**: Single-select key filtering for focused views
- **Live Results**: Canvas updates in real-time as you type or select filters
- **Search Statistics**: See filtered vs. total card counts

### ⏰ **Dynamic Timeline**
- **Date-based Visualization**: Horizontal timeline showing filtered cards by date
- **Interactive Icons**: Click timeline icons to highlight and navigate to cards
- **Group Indicators**: Multiple cards on same date shown as grouped icons
- **Week Markers**: Subtle Monday indicators for temporal orientation
- **Visual Connections**: Lines connect timeline icons to their canvas cards
- **Hover Tooltips**: Preview card titles and highlight connections

### 🎛️ **Canvas Controls**
- **Infinite Workspace**: Unlimited canvas space for spatial organization
- **Zoom Controls**: 50%-200% zoom range with sidebar controls
- **Focus Mode**: Toggle focus mode 🎯 to automatically frame visible cards, with disabled zoom controls and preserved view settings
- **Responsive Layout**: Canvas automatically resizes with window changes
- **Visual Feedback**: Real-time highlighting and selection indicators

### 💾 **Local-First Data Management**
- **File-based Storage**: Save workspaces as `.cardstaxx` JSON files
- **Full File Operations**: New, Load, Save, Save As with native dialogs
- **Change Tracking**: Visual indicators (*) for unsaved changes
- **Auto-Resume**: Automatically load last workspace on startup
- **Error Recovery**: Robust handling of missing or corrupted files
- **Settings Persistence**: User preferences stored locally

### ⌨️ **Keyboard Shortcuts**
- **File Operations**: `Ctrl+N` (New), `Ctrl+O` (Open), `Ctrl+S` (Save), `Ctrl+Shift+S` (Save As)
- **Canvas Navigation**: `Ctrl++` (Zoom In), `Ctrl+-` (Zoom Out), `F` (Focus Mode Toggle)
- **Editing**: `Escape` (Cancel editing/connections)

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/CardStaxx.git
   cd CardStaxx
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running in Development Mode

To run CardStaxx in development mode with hot-reloading:

```bash
npm start
```

This will:
- Compile the application code
- Launch the Electron desktop window
- Open developer tools for debugging
- Enable hot-reloading for development

### Building Executables

#### Package Application
Create a distributable package for your current OS:

```bash
npm run package
```

#### Create Installers
Generate platform-specific installers (`.dmg`, `.exe`, `.deb`):

```bash
npm run make
```

Both commands output to the `out/` directory.

## 🏗️ Technology Stack

- **[Electron](https://www.electronjs.org/)** - Cross-platform desktop application framework
- **[React](https://reactjs.org/)** - UI library with hooks and functional components
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript superset
- **[Konva.js](https://konvajs.org/)** - 2D canvas library via `react-konva`
- **[Electron Forge](https://www.electronforge.io/)** - Tooling for packaging and distribution
- **[Webpack](https://webpack.js.org/)** - Module bundling and compilation

## 📁 Project Structure

```
CardStaxx/
├── src/
│   ├── components/          # React components
│   │   ├── Canvas.tsx       # Main canvas with Konva
│   │   ├── Sidebar.tsx      # Control panel
│   │   ├── Stack.tsx        # Stack rendering
│   │   ├── Notecard.tsx     # Individual card display
│   │   └── ...              # Other UI components
│   ├── App.tsx              # Main application component
│   ├── types.ts             # TypeScript type definitions
│   └── index.tsx            # React entry point
├── electron/
│   └── main.ts              # Electron main process
├── forge.config.js          # Electron Forge configuration
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## 🎯 Usage Tips

### Creating Your First Workspace
1. Launch CardStaxx
2. Click "New Card" to create your first notecard
3. Double-click cards to edit titles and content
4. Drag cards onto each other to create stacks
5. Use the connection handles to link related stacks
6. Save your workspace with `Ctrl+S`

### Organizing Information
- **Use Colors**: Assign different background colors to categorize cards
- **Add Tags**: Use tags for flexible filtering and organization
- **Set Keys**: Use keys for focused filtering of related content
- **Create Connections**: Show relationships between different topics
- **Leverage Timeline**: View your notes chronologically

### Keyboard Efficiency
- Master the keyboard shortcuts for faster workflow
- Use `Escape` to quickly cancel any editing operation
- Zoom controls help focus on specific areas of large workspaces

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Future Roadmap

- Database migration from JSON to SQLite for better performance
- Cloud synchronization capabilities
- Advanced import/export features
- Plugin system for extensibility
- Mobile/tablet companion apps

---

**CardStaxx v1.0** - A complete visual knowledge management solution for desktop users who value privacy, offline access, and spatial organization of information.