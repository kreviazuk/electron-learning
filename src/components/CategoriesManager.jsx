import React, { useState } from 'react';

const CategoriesManager = ({ categories, onAddCategory, onEditCategory, onDeleteCategory }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    color: '#667eea'
  });

  const defaultCategories = ['personal', 'work', 'study'];

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        icon: category.icon,
        color: category.color || '#667eea'
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        icon: '',
        color: '#667eea'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      icon: '',
      color: '#667eea'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.icon.trim()) {
      alert('请填写分类名称和图标');
      return;
    }

    const categoryData = {
      name: formData.name.trim(),
      icon: formData.icon.trim(),
      color: formData.color
    };

    if (editingCategory) {
      onEditCategory(editingCategory.id, categoryData);
    } else {
      onAddCategory(categoryData);
    }

    handleCloseModal();
  };

  const handleDelete = (categoryId, categoryName) => {
    if (defaultCategories.includes(categoryId)) {
      alert('默认分类不能删除');
      return;
    }

    if (window.confirm(`确定要删除分类"${categoryName}"吗？删除后该分类下的所有笔记和待办事项将移动到"个人"分类。`)) {
      onDeleteCategory(categoryId);
    }
  };

  const commonIcons = ['📝', '💼', '📚', '🏠', '❤️', '🎯', '💡', '🎨', '🏃‍♂️', '🍔', '✈️', '🎵', '📱', '💰', '🎮'];

  return (
    <div className="categories-manager">
      <div className="categories-header">
        <h3>分类管理</h3>
        <button className="add-category-btn" onClick={() => handleOpenModal()}>
          + 新建分类
        </button>
      </div>

      <div className="categories-list">
        {categories.map(category => (
          <div key={category.id} className="category-item">
            <div className="category-info">
              <span className="category-icon" style={{ color: category.color }}>
                {category.icon}
              </span>
              <span className="category-name">{category.name}</span>
              {defaultCategories.includes(category.id) && (
                <span className="default-badge">默认</span>
              )}
            </div>
            <div className="category-actions">
              <button
                className="edit-btn"
                onClick={() => handleOpenModal(category)}
                title="编辑分类"
              >
                ✏️
              </button>
              {!defaultCategories.includes(category.id) && (
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(category.id, category.name)}
                  title="删除分类"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCategory ? '编辑分类' : '新建分类'}</h3>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>分类名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入分类名称"
                  autoFocus
                />
              </div>
              
              <div className="form-group">
                <label>图标</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="请输入或选择图标"
                />
                <div className="icon-picker">
                  {commonIcons.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, icon })}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label>颜色</label>
                <div className="color-picker">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                  <span className="color-preview" style={{ backgroundColor: formData.color }}>
                    {formData.icon}
                  </span>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={handleCloseModal} className="btn-cancel">
                  取消
                </button>
                <button type="submit" className="btn-save">
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesManager; 