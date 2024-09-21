import React, { useState } from 'react';
import { Button, TextField, List, ListItem, ListItemText, ListItemSecondaryAction, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

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
    const [dialogOpen, setDialogOpen] = useState(false);

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

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    return (
        <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '8px', width: '300px', margin: 'auto' }}>
            <Button
                variant="contained"
                color="primary"
                onClick={handleDialogOpen}
                style={{ width: '100%' }}
            >
                Manage Categories
            </Button>

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Manage Categories</DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', marginBottom: '10px' }}>
                        <TextField
                            variant="outlined"
                            placeholder="New category"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            style={{ flex: 1, marginRight: '10px' }}
                        />
                        <Button variant="contained" color="primary" onClick={handleAddCategory}>
                            Add
                        </Button>
                    </div>
                    <List>
                        {categories.map((category) => (
                            <ListItem key={category} divider>
                                {editingCategory === category ? (
                                    <div style={{ display: 'flex', width: '100%' }}>
                                        <TextField
                                            variant="outlined"
                                            value={updatedCategory}
                                            onChange={(e) => setUpdatedCategory(e.target.value)}
                                            style={{ flex: 1, marginRight: '10px' }}
                                        />
                                        <ListItemSecondaryAction>
                                            <Button variant="contained" color="primary" onClick={handleEditSave}>
                                                Save
                                            </Button>
                                            <Button variant="outlined" color="secondary" onClick={() => setEditingCategory(null)} style={{ marginLeft: '10px' }}>
                                                Cancel
                                            </Button>
                                        </ListItemSecondaryAction>
                                    </div>
                                ) : (
                                    <ListItemText
                                        primary={category}
                                        secondary={
                                            <div>
                                                <Button variant="outlined" color="primary" onClick={() => handleEditStart(category)} style={{ marginRight: '10px' }}>
                                                    Edit
                                                </Button>
                                                <Button variant="outlined" color="secondary" onClick={() => onDeleteCategory(category)}>
                                                    Delete
                                                </Button>
                                            </div>
                                        }
                                    />
                                )}
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CategoryManager;
