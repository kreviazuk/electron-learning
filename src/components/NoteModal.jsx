import React, { useState, useEffect } from 'react';

const NoteModal = ({ note, onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('personal');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category);
    } else {
      setTitle('');
      setContent('');
      setCategory('personal');
    }
  }, [note]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert('请填写标题和内容');
      return;
    }

    onSave({
      title: title.trim(),
      content: content.trim(),
      category
    });
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
              <option value="personal">个人</option>
              <option value="work">工作</option>
              <option value="study">学习</option>
            </select>
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