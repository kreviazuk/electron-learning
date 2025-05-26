import React from 'react';
import NotesList from './NotesList';
import TodosList from './TodosList';

const MainContent = ({
  currentView,
  currentFilter,
  searchQuery,
  notes,
  todos,
  onSearch,
  onAddNew,
  onEditNote,
  onEditTodo,
  onToggleTodo,
  onDeleteNote,
  onDeleteTodo,
  onFilterChange
}) => {
  const getTitle = () => {
    const titles = {
      notes: '我的笔记',
      todos: '待办事项',
      reminders: '提醒设置'
    };
    return titles[currentView];
  };

  const getButtonText = () => {
    const buttonTexts = {
      notes: '+ 新建笔记',
      todos: '+ 新建任务',
      reminders: '+ 新建提醒'
    };
    return buttonTexts[currentView];
  };

  const categories = [
    { id: null, name: '全部', icon: '📋' },
    { id: 'personal', name: '个人', icon: '👤' },
    { id: 'work', name: '工作', icon: '💼' },
    { id: 'study', name: '学习', icon: '📚' }
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'notes':
        return (
          <NotesList
            notes={notes}
            currentFilter={currentFilter}
            searchQuery={searchQuery}
            onEditNote={onEditNote}
            onDeleteNote={onDeleteNote}
          />
        );
      case 'todos':
        return (
          <TodosList
            todos={todos}
            currentFilter={currentFilter}
            searchQuery={searchQuery}
            onEditTodo={onEditTodo}
            onToggleTodo={onToggleTodo}
            onDeleteTodo={onDeleteTodo}
          />
        );
      case 'reminders':
        return (
          <div className="empty-state">
            <div className="empty-icon">⏰</div>
            <p>提醒功能正在开发中...</p>
            <p>您可以在待办事项中设置提醒时间</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="main-content">
      <div className="content-header">
        <div className="header-left">
          <h2>{getTitle()}</h2>
        </div>
        <div className="header-right">
          <input
            type="text"
            placeholder="搜索..."
            className="search-box"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
          <button className="add-btn" onClick={onAddNew}>
            {getButtonText()}
          </button>
        </div>
      </div>

      {/* 分类筛选 - 只在笔记和待办事项页面显示 */}
      {(currentView === 'notes' || currentView === 'todos') && (
        <div className="filter-bar">
          <div className="filter-tabs">
            {categories.map(category => (
              <button
                key={category.id || 'all'}
                className={`filter-tab ${currentFilter === category.id ? 'active' : ''}`}
                onClick={() => onFilterChange(category.id)}
              >
                <span className="filter-icon">{category.icon}</span>
                <span className="filter-text">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="content-area">
        {renderContent()}
      </div>
    </div>
  );
};

export default MainContent; 