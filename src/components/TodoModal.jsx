import React, { useState, useEffect } from 'react';

const TodoModal = ({ todo, categories, onSave, onClose }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('personal');
  const [reminder, setReminder] = useState('');

  useEffect(() => {
    if (todo) {
      setText(todo.text);
      setPriority(todo.priority);
      setCategory(todo.category);
      if (todo.reminder) {
        const date = new Date(todo.reminder);
        setReminder(formatDateTimeInput(date));
      } else {
        setReminder('');
      }
    } else {
      setText('');
      setPriority('medium');
      setCategory(categories.length > 0 ? categories[0].id : 'personal');
      setReminder('');
    }
  }, [todo, categories]);

  const formatDateTimeInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      alert('请填写任务内容');
      return;
    }

    const todoData = {
      text: text.trim(),
      priority,
      category,
      reminder: reminder ? new Date(reminder).toISOString() : null
    };

    onSave(todoData);
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{todo ? '编辑任务' : '新建任务'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>任务内容</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="请输入任务内容"
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label>优先级</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
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
            <label>提醒时间（可选）</label>
            <input
              type="datetime-local"
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
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

export default TodoModal; 