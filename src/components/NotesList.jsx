import React from 'react';

const NotesList = ({ notes, currentFilter, searchQuery, onEditNote, onDeleteNote, priorityFilter }) => {
  // 过滤笔记
  const filteredNotes = notes.filter(note => {
    // 分类过滤
    if (currentFilter && note.category !== currentFilter) {
      return false;
    }
    
    // 优先级过滤
    if (priorityFilter) {
      const isImportant = note.isImportant || false;
      const isUrgent = note.isUrgent || false;
      
      switch (priorityFilter) {
        case 'urgent-important':
          if (!isImportant || !isUrgent) return false;
          break;
        case 'important-not-urgent':
          if (!isImportant || isUrgent) return false;
          break;
        case 'urgent-not-important':
          if (isImportant || !isUrgent) return false;
          break;
        case 'not-urgent-not-important':
          if (isImportant || isUrgent) return false;
          break;
        default:
          break;
      }
    }
    
    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return note.title.toLowerCase().includes(query) ||
             note.content.toLowerCase().includes(query);
    }
    
    return true;
  });

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return '今天';
    } else if (diffDays === 2) {
      return '昨天';
    } else if (diffDays <= 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  // 获取分类名称
  const getCategoryName = (category) => {
    const names = {
      personal: '个人',
      work: '工作',
      study: '学习'
    };
    return names[category] || category;
  };

  // 获取优先级信息
  const getPriorityInfo = (note) => {
    const isImportant = note.isImportant || false;
    const isUrgent = note.isUrgent || false;
    
    if (isImportant && isUrgent) {
      return { label: '重要且紧急', color: '#f44336', icon: '🔥' };
    }
    if (isImportant && !isUrgent) {
      return { label: '重要不紧急', color: '#ff9800', icon: '⭐' };
    }
    if (!isImportant && isUrgent) {
      return { label: '不重要但紧急', color: '#2196f3', icon: '⚡' };
    }
    return { label: '不重要不紧急', color: '#4caf50', icon: '📋' };
  };

  // 处理删除笔记
  const handleDeleteNote = (e, noteId, noteTitle) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发编辑
    
    if (window.confirm(`确定要删除笔记"${noteTitle}"吗？此操作无法撤销。`)) {
      onDeleteNote(noteId);
    }
  };

  if (filteredNotes.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <p>还没有笔记，点击"新建笔记"开始记录吧！</p>
      </div>
    );
  }

  return (
    <div className="notes-list">
      {filteredNotes.map(note => {
        const priorityInfo = getPriorityInfo(note);
        return (
          <div
            key={note.id}
            className="note-item"
            onClick={() => onEditNote(note)}
          >
            <div className="note-header">
              <div className="note-title">{note.title}</div>
              <div className="note-actions">
                <div 
                  className="note-priority-badge"
                  style={{ backgroundColor: priorityInfo.color }}
                  title={priorityInfo.label}
                >
                  {priorityInfo.icon}
                </div>
                <button
                  className="note-delete-btn"
                  onClick={(e) => handleDeleteNote(e, note.id, note.title)}
                  title="删除笔记"
                >
                  🗑️
                </button>
              </div>
            </div>
            <div className="note-preview">
              {note.content.substring(0, 100)}
              {note.content.length > 100 ? '...' : ''}
            </div>
            <div className="note-meta">
              <div className="note-date">
                {formatDate(note.updatedAt)} • {getCategoryName(note.category)}
              </div>
              <div className="note-priority-text" style={{ color: priorityInfo.color }}>
                {priorityInfo.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotesList; 