import React from 'react';

const TodosList = ({ todos, currentFilter, searchQuery, onEditTodo, onToggleTodo }) => {
  // 过滤待办事项
  const filteredTodos = todos.filter(todo => {
    // 分类过滤
    if (currentFilter && todo.category !== currentFilter) {
      return false;
    }
    
    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return todo.text.toLowerCase().includes(query);
    }
    
    return true;
  });

  // 按优先级和完成状态排序
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  // 格式化日期时间
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN');
  };

  // 获取优先级名称
  const getPriorityName = (priority) => {
    const names = {
      low: '低',
      medium: '中',
      high: '高'
    };
    return names[priority] || priority;
  };

  if (sortedTodos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">✅</div>
        <p>还没有待办事项，点击"新建任务"开始规划吧！</p>
      </div>
    );
  }

  return (
    <div className="todos-list">
      {sortedTodos.map(todo => (
        <div
          key={todo.id}
          className="todo-item"
          onClick={() => onEditTodo(todo)}
        >
          <div className="todo-content">
            <div 
              className={`todo-checkbox ${todo.completed ? 'completed' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleTodo(todo.id);
              }}
            >
              {todo.completed ? '✓' : ''}
            </div>
            <div className={`todo-text ${todo.completed ? 'completed' : ''}`}>
              {todo.text}
            </div>
            <div className={`todo-priority priority-${todo.priority}`}>
              {getPriorityName(todo.priority)}
            </div>
          </div>
          {todo.reminder && (
            <div className="todo-reminder">
              提醒: {formatDateTime(todo.reminder)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TodosList; 