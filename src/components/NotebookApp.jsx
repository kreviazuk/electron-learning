import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import NoteModal from './NoteModal';
import TodoModal from './TodoModal';

const NotebookApp = () => {
  // 状态管理
  const [currentView, setCurrentView] = useState('notes');
  const [currentFilter, setCurrentFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState([]);
  const [todos, setTodos] = useState([]);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // 从本地存储加载数据
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    const savedTodos = localStorage.getItem('todos');
    
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    } else {
      // 添加示例数据
      const now = new Date().toISOString();
      const exampleNotes = [
        {
          id: 'note1',
          title: '欢迎使用每日记事本',
          content: '这是一个功能强大的记事本应用，您可以：\n\n• 创建和管理笔记\n• 添加待办事项\n• 设置提醒\n• 按分类整理内容\n\n开始记录您的想法和计划吧！',
          category: 'personal',
          createdAt: now,
          updatedAt: now
        }
      ];
      setNotes(exampleNotes);
      localStorage.setItem('notes', JSON.stringify(exampleNotes));
    }
    
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    } else {
      // 添加示例待办事项
      const now = new Date().toISOString();
      const exampleTodos = [
        {
          id: 'todo1',
          text: '完成项目报告',
          priority: 'high',
          category: 'work',
          reminder: null,
          completed: false,
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'todo2',
          text: '阅读技术文档',
          priority: 'medium',
          category: 'study',
          reminder: null,
          completed: false,
          createdAt: now,
          updatedAt: now
        }
      ];
      setTodos(exampleTodos);
      localStorage.setItem('todos', JSON.stringify(exampleTodos));
    }
  }, []);

  // 保存数据到本地存储
  const saveNotes = (newNotes) => {
    setNotes(newNotes);
    localStorage.setItem('notes', JSON.stringify(newNotes));
  };

  const saveTodos = (newTodos) => {
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  };

  // 生成唯一ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // 处理视图切换
  const handleViewChange = (view) => {
    setCurrentView(view);
    setCurrentFilter(null);
  };

  // 处理分类过滤
  const handleFilterChange = (filter) => {
    setCurrentFilter(currentFilter === filter ? null : filter);
  };

  // 处理搜索
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // 打开新建模态框
  const handleAddNew = () => {
    setEditingItem(null);
    if (currentView === 'notes') {
      setIsNoteModalOpen(true);
    } else if (currentView === 'todos') {
      setIsTodoModalOpen(true);
    }
  };

  // 编辑笔记
  const handleEditNote = (note) => {
    setEditingItem(note);
    setIsNoteModalOpen(true);
  };

  // 编辑待办事项
  const handleEditTodo = (todo) => {
    setEditingItem(todo);
    setIsTodoModalOpen(true);
  };

  // 保存笔记
  const handleSaveNote = (noteData) => {
    const now = new Date().toISOString();
    
    if (editingItem) {
      // 编辑现有笔记
      const updatedNotes = notes.map(note => 
        note.id === editingItem.id 
          ? { ...note, ...noteData, updatedAt: now }
          : note
      );
      saveNotes(updatedNotes);
    } else {
      // 创建新笔记
      const newNote = {
        id: generateId(),
        ...noteData,
        createdAt: now,
        updatedAt: now
      };
      saveNotes([newNote, ...notes]);
    }
    
    setIsNoteModalOpen(false);
    setEditingItem(null);
  };

  // 保存待办事项
  const handleSaveTodo = (todoData) => {
    const now = new Date().toISOString();
    
    if (editingItem) {
      // 编辑现有待办事项
      const updatedTodos = todos.map(todo => 
        todo.id === editingItem.id 
          ? { ...todo, ...todoData, updatedAt: now }
          : todo
      );
      saveTodos(updatedTodos);
    } else {
      // 创建新待办事项
      const newTodo = {
        id: generateId(),
        ...todoData,
        completed: false,
        createdAt: now,
        updatedAt: now
      };
      saveTodos([newTodo, ...todos]);
    }
    
    setIsTodoModalOpen(false);
    setEditingItem(null);
  };

  // 切换待办事项完成状态
  const handleToggleTodo = (todoId) => {
    const updatedTodos = todos.map(todo => 
      todo.id === todoId 
        ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() }
        : todo
    );
    saveTodos(updatedTodos);
  };

  return (
    <div className="app-container">
      <Sidebar
        currentView={currentView}
        currentFilter={currentFilter}
        onViewChange={handleViewChange}
        onFilterChange={handleFilterChange}
      />
      
      <MainContent
        currentView={currentView}
        currentFilter={currentFilter}
        searchQuery={searchQuery}
        notes={notes}
        todos={todos}
        onSearch={handleSearch}
        onAddNew={handleAddNew}
        onEditNote={handleEditNote}
        onEditTodo={handleEditTodo}
        onToggleTodo={handleToggleTodo}
      />

      {isNoteModalOpen && (
        <NoteModal
          note={editingItem}
          onSave={handleSaveNote}
          onClose={() => {
            setIsNoteModalOpen(false);
            setEditingItem(null);
          }}
        />
      )}

      {isTodoModalOpen && (
        <TodoModal
          todo={editingItem}
          onSave={handleSaveTodo}
          onClose={() => {
            setIsTodoModalOpen(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};

export default NotebookApp; 