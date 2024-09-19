import React, { useState } from 'react';

interface CategoryManagerProps {
    categories: string[];
    onAddCategory: (category: string) => void;
    onEditCategory: (oldCategory: string, newCategory: string) => void;
    onDeleteCategory: (category: string) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onAddCategory, onEditCategory, onDeleteCategory }) => {
    const [newCategory, setNewCategory] = useState('');
    const [editingCategory, setEditingCategory] = useState<string | null>(null);
    const [updatedCategory, setUpdatedCategory] = useState('');

    const handleAddCategory = () => {
        if (newCategory.trim()) {
            onAddCategory(newCategory);
            setNewCategory('');
        }
    };

    const handleEditStart = (category: string) => {
        setEditingCategory(category);
        setUpdatedCategory(category);
    };

    const handleEditSave = () => {
        if (editingCategory && updatedCategory.trim()) {
            onEditCategory(editingCategory, updatedCategory);
            setEditingCategory(null);
            setUpdatedCategory('');
        }
    };

    return (
        <div>
            <h4>Manage Categories</h4>
            <input
                type="text"
                placeholder="New category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
            />
            <button onClick={handleAddCategory}>Add Category</button>

            <ul>
                {categories.map((category) => (
                    <li key={category}>
                        {editingCategory === category ? (
                            <div>
                                <input
                                    type="text"
                                    value={updatedCategory}
                                    onChange={(e) => setUpdatedCategory(e.target.value)}
                                />
                                <button onClick={handleEditSave}>Save</button>
                                <button onClick={() => setEditingCategory(null)}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                <span>{category}</span>
                                <button onClick={() => handleEditStart(category)}>Edit</button>
                                <button onClick={() => onDeleteCategory(category)}>Delete</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryManager;
