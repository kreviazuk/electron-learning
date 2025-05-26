import React from 'react';
import NotesList from './NotesList';
import TodosList from './TodosList';
import CategoriesManager from './CategoriesManager';

const MainContent = ({
  currentView,
  currentFilter,
  searchQuery,
  notes,
  todos,
  categories,
  onSearch,
  onAddNew,
  onEditNote,
  onEditTodo,
  onToggleTodo,
  onDeleteNote,
  onDeleteTodo,
  onFilterChange,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  priorityFilter,
  onPriorityFilterChange
}) => {
  const getTitle = () => {
    const titles = {
      notes: '我的笔记',
      todos: '待办事项',
      categories: '分类管理',
      reminders: '提醒设置'
    };
    return titles[currentView];
  };

  const getButtonText = () => {
    const buttonTexts = {
      notes: '+ 新建笔记',
      todos: '+ 新建任务',
      categories: '+ 新建分类',
      reminders: '+ 新建提醒'
    };
    return buttonTexts[currentView];
  };

  const priorityOptions = [
    { id: null, name: '全部优先级', icon: '📋', color: '#666' },
    { id: 'urgent-important', name: '重要且紧急', icon: '🔥', color: '#f44336' },
    { id: 'important-not-urgent', name: '重要不紧急', icon: '⭐', color: '#ff9800' },
    { id: 'urgent-not-important', name: '不重要但紧急', icon: '⚡', color: '#2196f3' },
    { id: 'not-urgent-not-important', name: '不重要不紧急', icon: '📋', color: '#4caf50' }
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
            priorityFilter={priorityFilter}
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
      case 'categories':
        return (
          <CategoriesManager
            categories={categories}
            onAddCategory={onAddCategory}
            onEditCategory={onEditCategory}
            onDeleteCategory={onDeleteCategory}
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
        {currentView !== 'categories' && (
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
        )}
      </div>

      {/* 分类筛选 - 只在笔记和待办事项页面显示 */}
      {(currentView === 'notes' || currentView === 'todos') && (
        <div className="filter-bar">
          <div className="filter-section">
            <h4>分类筛选</h4>
            <div className="filter-tabs">
              <button
                className={`filter-tab ${currentFilter === null ? 'active' : ''}`}
                onClick={() => onFilterChange(null)}
              >
                <span className="filter-icon">📋</span>
                <span className="filter-text">全部</span>
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`filter-tab ${currentFilter === category.id ? 'active' : ''}`}
                  onClick={() => onFilterChange(category.id)}
                >
                  <span className="filter-icon" style={{ color: category.color }}>
                    {category.icon}
                  </span>
                  <span className="filter-text">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 优先级筛选 - 只在笔记页面显示 */}
          {currentView === 'notes' && (
            <div className="filter-section">
              <h4>优先级筛选</h4>
              <div className="filter-tabs">
                {priorityOptions.map(option => (
                  <button
                    key={option.id || 'all'}
                    className={`filter-tab ${priorityFilter === option.id ? 'active' : ''}`}
                    onClick={() => onPriorityFilterChange(option.id)}
                  >
                    <span className="filter-icon" style={{ color: option.color }}>
                      {option.icon}
                    </span>
                    <span className="filter-text">{option.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="content-area">
        {renderContent()}
      </div>
    </div>
  );
};

export default MainContent; 