import React from 'react';

interface SidebarProps {
  onCreateCard: () => void;
}

const Sidebar = ({ onCreateCard }: SidebarProps) => {
  return (
    <div style={{ width: '250px', borderRight: '1px solid #ccc', padding: '10px', height: '100vh', backgroundColor: '#f7f7f7' }}>
      <h2>Knowledge Cards</h2>
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
