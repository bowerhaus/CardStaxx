import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import EditableTextOverlay from './components/EditableTextOverlay';
import ColorPicker from './components/ColorPicker';
import MarkdownRenderer from './components/MarkdownRenderer';
import ConfirmDialog from './components/ConfirmDialog';
import DebugButton from './components/DebugButton';
import Timeline from './components/Timeline';
import { StackData, ConnectionData, CARD_COLORS } from './types';
import { LAYOUT } from './constants/layout';

// Hooks
import { useWorkspace } from './hooks/useWorkspace';
import { useEditingState } from './hooks/useEditingState';
import { useFocusMode } from './hooks/useFocusMode';
import { useSearch } from './hooks/useSearch';
import { useCardOperations } from './hooks/useCardOperations';
import { useStackOperations } from './hooks/useStackOperations';
import { useConnectionOperations } from './hooks/useConnectionOperations';
import { useTimeline } from './hooks/useTimeline';

// Services
import { generateMovieDemoData } from './services/demoDataService';

// Utils
import { getCardScreenPositions, getOverlayPosition } from './utils/positionCalculations';

function App() {
  // Main state
  const [stacks, setStacks] = useState<StackData[]>([
    {
      id: 'stack-1',
      x: 50,
      y: 50,
      cards: [
        { 
          id: 'card-1', 
          title: 'Welcome!', 
          content: 'This is the bottom card',
          date: new Date().toISOString(),
          backgroundColor: CARD_COLORS.DEFAULT
        },
        { 
          id: 'card-2', 
          title: 'Top Card', 
          content: '# Hello World\\n\\nThis is a **markdown** card with:\\n\\n- Bullet points\\n- *Italic text*\\n- `code snippets`\\n\\n> A blockquote example',
          date: new Date().toISOString(),
          backgroundColor: CARD_COLORS.LIGHT_BLUE
        },
      ],
    },
  ]);
  
  const [connections, setConnections] = useState<ConnectionData[]>([]);

  // Initialize all hooks
  const workspace = useWorkspace(setStacks, setConnections);
  
  const cardOps = useCardOperations(stacks, setStacks, workspace.setHasUnsavedChanges);
  const stackOps = useStackOperations(stacks, setStacks, workspace.setHasUnsavedChanges);
  const connectionOps = useConnectionOperations(stacks, connections, setConnections, workspace.setHasUnsavedChanges);
  
  const editingState = useEditingState(
    stacks,
    cardOps.handleUpdateCard,
    stackOps.handleUpdateStack,
    connectionOps.handleConnectionUpdate
  );
  
  const search = useSearch(stacks);
  const focusMode = useFocusMode(stacks, search.searchFilters, search.getFilteredStacks);
  const timeline = useTimeline();

  // Event handlers
  const handleLoadDemo = () => {
    const demoData = generateMovieDemoData();
    setStacks(demoData.stacks);
    setConnections(demoData.connections);
    workspace.setHasUnsavedChanges(true);
    focusMode.setShouldEnableFocusOnDemoLoad(true);
  };

  const handleTimelineCardClick = (cardId: string) => {
    timeline.handleTimelineCardClick(cardId, search.setHighlightedCardIds);
  };

  const handleTimelineCardHover = (cardId: string | null) => {
    timeline.handleTimelineCardHover(cardId, search.setHighlightedCardIds);
  };

  // Calculate positions for rendering
  const cardPositions = getCardScreenPositions(
    search.filteredStacks,
    focusMode.canvasZoom,
    focusMode.canvasTranslate,
    editingState.editingCardId,
    editingState.editingField
  );
  
  const overlayPos = getOverlayPosition(
    editingState.editingKonvaNode,
    editingState.editingCardId,
    editingState.editingField,
    editingState.editingConnectionId,
    editingState.editingTextValue,
    cardPositions
  );

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar 
        onCreateCard={cardOps.handleCreateCard}
        onSave={() => workspace.saveWorkspace(workspace.currentFilePath, stacks, connections)}
        onSaveAs={() => workspace.saveWorkspace(undefined, stacks, connections)}
        onLoad={workspace.loadWorkspace}
        onNew={() => workspace.newWorkspace(stacks, connections)}
        onLoadDemo={handleLoadDemo}
        hasUnsavedChanges={workspace.hasUnsavedChanges}
        currentFilePath={workspace.currentFilePath}
        searchFilters={search.searchFilters}
        onSearchChange={search.handleSearchChange}
        onTagFilterChange={search.handleTagFilterChange}
        onKeyFilterChange={search.handleKeyFilterChange}
        availableTags={search.availableTags}
        availableKeys={search.availableKeys}
        searchResults={search.searchResults}
        totalCards={stacks.reduce((count, stack) => count + stack.cards.length, 0)}
        filteredCards={search.filteredStacks.reduce((count, stack) => count + stack.cards.length, 0)}
        isTimelineVisible={timeline.isTimelineVisible}
        onTimelineToggle={timeline.handleTimelineToggle}
        canvasZoom={focusMode.canvasZoom}
        onZoomIn={focusMode.handleZoomIn}
        onZoomOut={focusMode.handleZoomOut}
        onFocusToggle={focusMode.handleFocusToggle}
        isFocusModeEnabled={focusMode.isFocusModeEnabled}
      />
      <Canvas
        stacks={search.filteredStacks}
        connections={connections}
        isConnecting={connectionOps.isConnecting}
        currentConnection={connectionOps.currentConnection}
        onStackDragEnd={stackOps.handleStackDragEnd}
        onStackDragMove={stackOps.handleStackDragMove}
        onStackWheel={stackOps.handleStackWheel}
        onConnectionDragMove={connectionOps.handleConnectionDragMove}
        onConnectionDragEnd={connectionOps.handleConnectionDragEnd}
        onConnectionDragStart={connectionOps.handleConnectionDragStart}
        onConnectionLabelEdit={editingState.handleConnectionLabelEdit}
        onConnectionDelete={connectionOps.handleConnectionDelete}
        onUpdateCard={cardOps.handleUpdateCard}
        onEditStart={editingState.handleEditStart}
        onStackTitleEditStart={editingState.handleStackTitleEditStart}
        onCardResize={cardOps.handleCardResize}
        onColorPickerOpen={cardOps.handleColorPickerOpen}
        onCardDelete={cardOps.handleCardDeleteRequest}
        onCardBreakOut={cardOps.handleCardBreakOut}
        editingCardId={editingState.editingCardId}
        editingField={editingState.editingField}
        editingStackId={editingState.editingStackId}
        editingConnectionId={editingState.editingConnectionId}
        highlightedCardIds={search.highlightedCardIds}
        canvasZoom={focusMode.canvasZoom}
        canvasTranslate={focusMode.canvasTranslate}
        onCanvasTranslationChange={focusMode.handleCanvasTranslationChange}
      />
      
      {/* Markdown renderers for card content */}
      {cardPositions.map(({ card, x, y, width, height, scale, isEditing }) => 
        !isEditing && card.content && card.content.trim() !== '' ? (
          <MarkdownRenderer
            key={`markdown-${card.id}`}
            content={card.content}
            x={x}
            y={y}
            width={width}
            height={height}
            scale={scale}
            backgroundColor={card.backgroundColor}
            card={card}
            onEditStart={(cardId, field) => {
              editingState.setEditingCardId(cardId);
              editingState.setEditingField(field);
              const targetCard = stacks.flatMap(s => s.cards).find(c => c.id === cardId);
              if (targetCard && field === 'content') {
                editingState.setEditingTextValue(targetCard.content || '');
              }
              editingState.setEditingKonvaNode(null);
            }}
          />
        ) : null
      )}
      
      {/* Text editing overlay */}
      {(((editingState.editingCardId && editingState.editingField) || editingState.editingConnectionId || (editingState.editingStackId && editingState.editingField === 'stack-title')) && (editingState.editingKonvaNode || (editingState.editingCardId && editingState.editingField === 'content') || (editingState.editingStackId && editingState.editingField === 'stack-title'))) && (
        <EditableTextOverlay
          x={overlayPos.x}
          y={overlayPos.y}
          width={overlayPos.width}
          height={overlayPos.height}
          value={editingState.editingTextValue}
          isTextArea={editingState.editingField === 'content'}
          inputType={editingState.editingField === 'date' ? 'date' : 'text'}
          fieldType={editingState.editingField || 'connection'}
          onChange={editingState.setEditingTextValue}
          onBlur={editingState.handleEditBlur}
        />
      )}
      
      {/* Color picker */}
      {cardOps.colorPickerCardId && (
        <ColorPicker
          selectedColor={stacks.flatMap(s => s.cards).find(c => c.id === cardOps.colorPickerCardId)?.backgroundColor || CARD_COLORS.DEFAULT}
          onColorSelect={(color) => cardOps.handleColorChange(cardOps.colorPickerCardId!, color)}
          onClose={cardOps.handleColorPickerClose}
          x={cardOps.colorPickerPosition.x}
          y={cardOps.colorPickerPosition.y}
        />
      )}
      
      {/* Delete confirmation dialog */}
      {cardOps.deleteConfirmCardId && (
        <ConfirmDialog
          title="Delete Card"
          message={`Are you sure you want to delete the card "${stacks.flatMap(s => s.cards).find(c => c.id === cardOps.deleteConfirmCardId)?.title || 'Untitled'}"? This action cannot be undone.`}
          onConfirm={cardOps.handleDeleteConfirm}
          onCancel={cardOps.handleDeleteCancel}
        />
      )}
      
      {/* Debug button for development mode */}
      <DebugButton />
      
      {/* Timeline component */}
      {timeline.isTimelineVisible && (
        <Timeline
          stacks={stacks}
          onCardClick={handleTimelineCardClick}
          onCardHover={handleTimelineCardHover}
          highlightedCardIds={search.highlightedCardIds}
          sidebarWidth={LAYOUT.SIDEBAR_WIDTH}
          canvasZoom={focusMode.canvasZoom}
          canvasTranslate={focusMode.canvasTranslate}
        />
      )}
    </div>
  );
}

export default App;