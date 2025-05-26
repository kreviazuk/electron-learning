import React from 'react';

const NotesList = ({ notes, currentFilter, searchQuery, onEditNote }) => {
  // 过滤笔记
  const filteredNotes = notes.filter(note => {
    // 分类过滤
    if (currentFilter && note.category !== currentFilter) {
      return false;
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
      {filteredNotes.map(note => (
        <div
          key={note.id}
          className="note-item"
          onClick={() => onEditNote(note)}
        >
          <div className="note-title">{note.title}</div>
          <div className="note-preview">
            {note.content.substring(0, 100)}
            {note.content.length > 100 ? '...' : ''}
          </div>
          <div className="note-date">
            {formatDate(note.updatedAt)} • {getCategoryName(note.category)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotesList; 