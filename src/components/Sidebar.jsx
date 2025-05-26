import React from 'react';

const Sidebar = ({ currentView, onViewChange }) => {
  const views = [
    { id: 'notes', name: '我的笔记', icon: '📝' },
    { id: 'categories', name: '分类管理', icon: '🏷️' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>每日记事本</h1>
      </div>
      
      <div className="sidebar-section">
        <h3>功能</h3>
        <div className="nav-list">
          {views.map(view => (
            <div
              key={view.id}
              className={`nav-item ${currentView === view.id ? 'active' : ''}`}
              onClick={() => onViewChange(view.id)}
            >
              <span className="nav-icon">{view.icon}</span>
              <span className="nav-text">{view.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 