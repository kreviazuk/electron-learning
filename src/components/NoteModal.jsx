import React, { useState, useEffect } from 'react';

const NoteModal = ({ note, categories, onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('personal');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isImportant, setIsImportant] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category);
      setIsUrgent(note.isUrgent || false);
      setIsImportant(note.isImportant || false);
    } else {
      setTitle('');
      setContent('');
      setCategory(categories.length > 0 ? categories[0].id : 'personal');
      setIsUrgent(false);
      setIsImportant(false);
    }
  }, [note, categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert('请填写标题和内容');
      return;
    }

    onSave({
      title: title.trim(),
      content: content.trim(),
      category,
      isUrgent,
      isImportant
    });
  };

  const getPriorityLabel = () => {
    if (isImportant && isUrgent) return '重要且紧急';
    if (isImportant && !isUrgent) return '重要不紧急';
    if (!isImportant && isUrgent) return '不重要但紧急';
    return '不重要不紧急';
  };

  const getPriorityColor = () => {
    if (isImportant && isUrgent) return '#f44336'; // 红色
    if (isImportant && !isUrgent) return '#ff9800'; // 橙色
    if (!isImportant && isUrgent) return '#2196f3'; // 蓝色
    return '#4caf50'; // 绿色
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{note ? '编辑笔记' : '新建笔记'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入笔记标题"
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label>分类</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>优先级设置</label>
            <div className="priority-controls">
              <div className="priority-checkboxes">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isImportant}
                    onChange={(e) => setIsImportant(e.target.checked)}
                  />
                  <span className="checkbox-text">重要</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                  />
                  <span className="checkbox-text">紧急</span>
                </label>
              </div>
              <div className="priority-preview" style={{ backgroundColor: getPriorityColor() }}>
                {getPriorityLabel()}
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label>内容</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="请输入笔记内容"
              rows={10}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              取消
            </button>
            <button type="submit" className="btn-save">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal; 