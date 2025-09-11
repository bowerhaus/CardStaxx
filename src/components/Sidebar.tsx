import React from 'react';

interface SidebarProps {
  onCreateCard: () => void;
  onSave: () => void;
  onSaveAs: () => void;
  onLoad: () => void;
  onNew: () => void;
  hasUnsavedChanges: boolean;
  currentFilePath: string | null;
}

const Sidebar = ({ onCreateCard, onSave, onSaveAs, onLoad, onNew, hasUnsavedChanges, currentFilePath }: SidebarProps) => {
  const getFileName = () => {
    if (!currentFilePath) return 'Untitled';
    return currentFilePath.split('/').pop()?.replace('.cardstaxx', '') || 'Untitled';
  };

  return (
    <div style={{ width: '250px', borderRight: '1px solid #ccc', padding: '10px', height: '100vh', backgroundColor: '#f7f7f7' }}>
      <h2>CardStaxx</h2>
      <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
        {getFileName()}{hasUnsavedChanges ? ' *' : ''}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <button onClick={onNew} style={{ marginRight: '5px' }}>New</button>
        <button onClick={onLoad} style={{ marginRight: '5px' }}>Load</button>
        <button onClick={onSave} style={{ marginRight: '5px' }} disabled={!hasUnsavedChanges}>
          Save
        </button>
        <button onClick={onSaveAs}>Save As</button>
      </div>
      
      <hr />
      <button onClick={onCreateCard}>+ Create New Card</button>
      <hr />
      {/* Connection buttons removed */}
      <button>Create Timeline</button>
      <hr />
      <input type="search" placeholder="Search cards..." style={{ width: '100%' }} />
      <div>
        <h4>Filter by Tags</h4>
        {/* Tag list will go here */}
      </div>
      <hr />
      <div>
        <h4>Canvas Zoom</h4>
        {/* Zoom controls will go here */}
      </div>
    </div>
  );
};

export default Sidebar;
