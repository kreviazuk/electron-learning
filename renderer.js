const btn = document.getElementById('btn');
const reply = document.getElementById('reply');

btn.addEventListener('click', () => {
  window.electronAPI.sendMessage('你好，主进程');
});

window.electronAPI.onReply((msg) => {
  reply.textContent += '\n主进程回复：' + msg;
});

// 应用状态管理
class NotebookApp {
    constructor() {
        this.currentView = 'notes';
        this.currentFilter = null;
        this.editingId = null;
        this.notes = this.loadData('notes') || [];
        this.todos = this.loadData('todos') || [];
        this.reminders = this.loadData('reminders') || [];
        
        this.init();
    }

    init() {
        console.log('初始化应用...');
        this.bindEvents();
        this.renderContent();
        this.setupReminders();
    }

    // 事件绑定
    bindEvents() {
        console.log('绑定事件...');
        
        // 添加按钮
        const addBtn = document.getElementById('add-btn');
        if (addBtn) {
            console.log('找到新建按钮，绑定点击事件');
            addBtn.addEventListener('click', () => {
                console.log('新建按钮被点击！');
                this.openAddModal();
            });
        } else {
            console.error('未找到新建按钮元素！');
        }

        // 导航切换
        document.querySelectorAll('.nav-item[data-view]').forEach(item => {
            item.addEventListener('click', (e) => {
                console.log('切换视图:', e.target.closest('.nav-item').dataset.view);
                this.switchView(e.target.closest('.nav-item').dataset.view);
            });
        });

        // 分类过滤
        document.querySelectorAll('.nav-item[data-filter]').forEach(item => {
            item.addEventListener('click', (e) => {
                this.setFilter(e.target.closest('.nav-item').dataset.filter);
            });
        });

        // 搜索功能
        const searchBox = document.getElementById('search-box');
        if (searchBox) {
            searchBox.addEventListener('input', (e) => {
                this.search(e.target.value);
            });
        }

        // 表单提交
        const noteForm = document.getElementById('note-form');
        if (noteForm) {
            noteForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveNote();
            });
        }

        const todoForm = document.getElementById('todo-form');
        if (todoForm) {
            todoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveTodo();
            });
        }

        // 模态框点击外部关闭
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    // 视图切换
    switchView(view) {
        console.log('切换到视图:', view);
        this.currentView = view;
        this.currentFilter = null;
        
        // 更新导航状态 - 清除所有 active 状态
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // 设置当前视图为 active
        document.querySelector(`[data-view="${view}"]`).classList.add('active');

        // 更新标题
        const titles = {
            notes: '我的笔记',
            todos: '待办事项',
            reminders: '提醒设置'
        };
        document.getElementById('content-title').textContent = titles[view];

        // 更新添加按钮文本
        const buttonTexts = {
            notes: '+ 新建笔记',
            todos: '+ 新建任务',
            reminders: '+ 新建提醒'
        };
        document.getElementById('add-btn').textContent = buttonTexts[view];

        this.renderContent();
    }

    // 设置过滤器
    setFilter(filter) {
        this.currentFilter = this.currentFilter === filter ? null : filter;
        
        // 更新过滤器状态
        document.querySelectorAll('.nav-item[data-filter]').forEach(item => {
            item.classList.remove('active');
        });
        
        if (this.currentFilter) {
            document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        }

        this.renderContent();
    }

    // 搜索功能
    search(query) {
        this.searchQuery = query.toLowerCase();
        this.renderContent();
    }

    // 渲染内容
    renderContent() {
        const contentArea = document.getElementById('content-area');
        
        switch (this.currentView) {
            case 'notes':
                this.renderNotes(contentArea);
                break;
            case 'todos':
                this.renderTodos(contentArea);
                break;
            case 'reminders':
                this.renderReminders(contentArea);
                break;
        }
    }

    // 渲染笔记
    renderNotes(container) {
        let filteredNotes = this.notes;

        // 应用分类过滤
        if (this.currentFilter) {
            filteredNotes = filteredNotes.filter(note => note.category === this.currentFilter);
        }

        // 应用搜索过滤
        if (this.searchQuery) {
            filteredNotes = filteredNotes.filter(note => 
                note.title.toLowerCase().includes(this.searchQuery) ||
                note.content.toLowerCase().includes(this.searchQuery)
            );
        }

        if (filteredNotes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📝</div>
                    <p>还没有笔记，点击"新建笔记"开始记录吧！</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredNotes.map(note => `
            <div class="note-item" onclick="app.editNote('${note.id}')">
                <div class="note-title">${this.escapeHtml(note.title)}</div>
                <div class="note-preview">${this.escapeHtml(note.content.substring(0, 100))}${note.content.length > 100 ? '...' : ''}</div>
                <div class="note-date">${this.formatDate(note.updatedAt)} • ${this.getCategoryName(note.category)}</div>
            </div>
        `).join('');
    }

    // 渲染待办事项
    renderTodos(container) {
        let filteredTodos = this.todos;

        // 应用分类过滤
        if (this.currentFilter) {
            filteredTodos = filteredTodos.filter(todo => todo.category === this.currentFilter);
        }

        // 应用搜索过滤
        if (this.searchQuery) {
            filteredTodos = filteredTodos.filter(todo => 
                todo.text.toLowerCase().includes(this.searchQuery)
            );
        }

        if (filteredTodos.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">✅</div>
                    <p>还没有待办事项，点击"新建任务"开始规划吧！</p>
                </div>
            `;
            return;
        }

        // 按优先级和完成状态排序
        filteredTodos.sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });

        container.innerHTML = filteredTodos.map(todo => `
            <div class="todo-item" onclick="app.editTodo('${todo.id}')">
                <div class="todo-content">
                    <div class="todo-checkbox ${todo.completed ? 'completed' : ''}" 
                         onclick="event.stopPropagation(); app.toggleTodo('${todo.id}')">
                        ${todo.completed ? '✓' : ''}
                    </div>
                    <div class="todo-text ${todo.completed ? 'completed' : ''}">${this.escapeHtml(todo.text)}</div>
                    <div class="todo-priority priority-${todo.priority}">${this.getPriorityName(todo.priority)}</div>
                </div>
                ${todo.reminder ? `<div class="note-date">提醒: ${this.formatDateTime(todo.reminder)}</div>` : ''}
            </div>
        `).join('');
    }

    // 渲染提醒设置
    renderReminders(container) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⏰</div>
                <p>提醒功能正在开发中...</p>
                <p>您可以在待办事项中设置提醒时间</p>
            </div>
        `;
    }

    // 打开添加模态框
    openAddModal() {
        console.log('打开添加模态框，当前视图:', this.currentView);
        this.editingId = null;
        
        if (this.currentView === 'notes') {
            console.log('打开笔记模态框');
            this.resetNoteForm();
            this.openModal('note-modal');
        } else if (this.currentView === 'todos') {
            console.log('打开待办事项模态框');
            this.resetTodoForm();
            this.openModal('todo-modal');
        }
    }

    // 编辑笔记
    editNote(id) {
        const note = this.notes.find(n => n.id === id);
        if (!note) return;

        this.editingId = id;
        document.getElementById('note-title').value = note.title;
        document.getElementById('note-content').value = note.content;
        document.getElementById('note-category').value = note.category;
        
        this.openModal('note-modal');
    }

    // 编辑待办事项
    editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        this.editingId = id;
        document.getElementById('todo-text').value = todo.text;
        document.getElementById('todo-priority').value = todo.priority;
        document.getElementById('todo-category').value = todo.category;
        
        if (todo.reminder) {
            const date = new Date(todo.reminder);
            document.getElementById('todo-reminder').value = this.formatDateTimeInput(date);
        }
        
        this.openModal('todo-modal');
    }

    // 切换待办事项完成状态
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        todo.completed = !todo.completed;
        todo.updatedAt = new Date().toISOString();
        
        this.saveData('todos', this.todos);
        this.renderContent();
    }

    // 保存笔记
    saveNote() {
        const title = document.getElementById('note-title').value.trim();
        const content = document.getElementById('note-content').value.trim();
        const category = document.getElementById('note-category').value;

        if (!title || !content) {
            alert('请填写标题和内容');
            return;
        }

        const now = new Date().toISOString();

        if (this.editingId) {
            // 编辑现有笔记
            const note = this.notes.find(n => n.id === this.editingId);
            if (note) {
                note.title = title;
                note.content = content;
                note.category = category;
                note.updatedAt = now;
            }
        } else {
            // 创建新笔记
            const newNote = {
                id: this.generateId(),
                title,
                content,
                category,
                createdAt: now,
                updatedAt: now
            };
            this.notes.unshift(newNote);
        }

        this.saveData('notes', this.notes);
        this.closeModal('note-modal');
        this.renderContent();
    }

    // 保存待办事项
    saveTodo() {
        const text = document.getElementById('todo-text').value.trim();
        const priority = document.getElementById('todo-priority').value;
        const category = document.getElementById('todo-category').value;
        const reminderInput = document.getElementById('todo-reminder').value;

        if (!text) {
            alert('请填写任务内容');
            return;
        }

        const now = new Date().toISOString();
        const reminder = reminderInput ? new Date(reminderInput).toISOString() : null;

        if (this.editingId) {
            // 编辑现有待办事项
            const todo = this.todos.find(t => t.id === this.editingId);
            if (todo) {
                todo.text = text;
                todo.priority = priority;
                todo.category = category;
                todo.reminder = reminder;
                todo.updatedAt = now;
            }
        } else {
            // 创建新待办事项
            const newTodo = {
                id: this.generateId(),
                text,
                priority,
                category,
                reminder,
                completed: false,
                createdAt: now,
                updatedAt: now
            };
            this.todos.unshift(newTodo);
        }

        this.saveData('todos', this.todos);
        this.closeModal('todo-modal');
        this.renderContent();
        
        // 设置提醒
        if (reminder) {
            this.scheduleReminder(text, new Date(reminder));
        }
    }

    // 重置表单
    resetNoteForm() {
        const form = document.getElementById('note-form');
        if (form) {
            form.reset();
        }
    }

    resetTodoForm() {
        const form = document.getElementById('todo-form');
        if (form) {
            form.reset();
        }
    }

    // 模态框操作
    openModal(modalId) {
        console.log('打开模态框:', modalId);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            console.log('模态框已显示');
        } else {
            console.error('未找到模态框:', modalId);
        }
    }

    closeModal(modalId) {
        console.log('关闭模态框:', modalId);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
        this.editingId = null;
    }

    // 设置提醒系统
    setupReminders() {
        // 检查待办事项的提醒
        setInterval(() => {
            this.checkReminders();
        }, 60000); // 每分钟检查一次

        // 立即检查一次
        this.checkReminders();
    }

    // 检查提醒
    checkReminders() {
        const now = new Date();
        
        this.todos.forEach(todo => {
            if (todo.reminder && !todo.completed && !todo.reminded) {
                const reminderTime = new Date(todo.reminder);
                if (now >= reminderTime) {
                    this.showNotification('待办提醒', todo.text);
                    todo.reminded = true;
                    this.saveData('todos', this.todos);
                }
            }
        });
    }

    // 安排提醒
    scheduleReminder(text, reminderTime) {
        const now = new Date();
        const delay = reminderTime.getTime() - now.getTime();
        
        if (delay > 0) {
            setTimeout(() => {
                this.showNotification('待办提醒', text);
            }, delay);
        }
    }

    // 显示通知
    showNotification(title, body) {
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification(title, { body });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new Notification(title, { body });
                    }
                });
            }
        }
    }

    // 工具函数
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    formatDate(dateString) {
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
    }

    formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('zh-CN');
    }

    formatDateTimeInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    getCategoryName(category) {
        const names = {
            personal: '个人',
            work: '工作',
            study: '学习'
        };
        return names[category] || category;
    }

    getPriorityName(priority) {
        const names = {
            low: '低',
            medium: '中',
            high: '高'
        };
        return names[priority] || priority;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 数据持久化
    saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    loadData(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
}

// 全局函数（供 HTML 调用）
function closeModal(modalId) {
    app.closeModal(modalId);
}

// 等待 DOM 加载完成后再初始化应用
let app;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM 加载完成，初始化应用');
        initializeApp();
    });
} else {
    console.log('DOM 已经加载完成，立即初始化应用');
    initializeApp();
}

function initializeApp() {
    // 初始化应用
    app = new NotebookApp();

    // 请求通知权限
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }

    // 添加一些示例数据（仅在首次运行时）
    if (app.notes.length === 0 && app.todos.length === 0) {
        const now = new Date().toISOString();
        
        // 示例笔记
        app.notes = [
            {
                id: 'note1',
                title: '欢迎使用每日记事本',
                content: '这是一个功能强大的记事本应用，您可以：\n\n• 创建和管理笔记\n• 添加待办事项\n• 设置提醒\n• 按分类整理内容\n\n开始记录您的想法和计划吧！',
                category: 'personal',
                createdAt: now,
                updatedAt: now
            }
        ];
        
        // 示例待办事项
        app.todos = [
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
        
        app.saveData('notes', app.notes);
        app.saveData('todos', app.todos);
        app.renderContent();
    }
}
