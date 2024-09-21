import React, { useState } from 'react';
import { Task } from '../models/Task';
import SubtaskList from './SubtaskList';
import {
    Button,
    TextField,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';

enum Filter {
    All = 'all',
    Complete = 'complete',
    Incomplete = 'incomplete'
}

interface TaskListProps {
    tasks: Task[];
    dispatch: React.Dispatch<any>;
    categories: string[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks, dispatch, categories }) => {
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [updatedDescription, setUpdatedDescription] = useState('');
    const [updatedDueDate, setUpdatedDueDate] = useState('');
    const [updatedCategory, setUpdatedCategory] = useState('');

    const [filter, setFilter] = useState<Filter>(Filter.All);
    const [categoryFilter, setCategoryFilter] = useState<string>('All');

    const handleDelete = (id: string) => {
        dispatch({ type: 'DELETE_TASK', payload: id });
    };

    const handleEditStart = (task: Task) => {
        setEditingTaskId(task.id);
        setUpdatedDescription(task.description);
        setUpdatedDueDate(task.dueDate.toISOString().substring(0, 10));
        setUpdatedCategory(task.category);
    };

    const handleEditSave = (taskId: string) => {
        const taskToUpdate = tasks.find(task => task.id === taskId);
        if (taskToUpdate) {
            const updatedTask: Task = {
                id: taskId,
                description: updatedDescription,
                dueDate: new Date(updatedDueDate),
                category: updatedCategory || '',
                subtasks: taskToUpdate.subtasks,
                isComplete: taskToUpdate.isComplete,
            };
            dispatch({ type: 'EDIT_TASK', payload: updatedTask });
            setEditingTaskId(null);
        }
    };

    const handleCompleteIncompleteTask = (taskId: string) => {
        const taskToUpdate = tasks.find(task => task.id === taskId);
        if (taskToUpdate) {
            const allSubtasksComplete = taskToUpdate.subtasks.every(subtask => subtask.isComplete);
            const updatedTaskData = {
                ...taskToUpdate,
                isComplete: allSubtasksComplete,
            };
            dispatch({ type: 'EDIT_TASK', payload: updatedTaskData });
        }
    };

    const filteredTasks = tasks.filter(task => {
        const completionFilter =
            filter === Filter.All || (filter === Filter.Complete && task.isComplete) || (filter === Filter.Incomplete && !task.isComplete);
        const checkCategoryFilter = categoryFilter === 'All' || task.category === categoryFilter;

        return completionFilter && checkCategoryFilter;
    });

    const handleAddSubtask = (taskId: string, description: string) => {
        const newSubtask = {
            id: new Date().toISOString(),
            description,
            isComplete: false,
        };
        const taskToUpdate = tasks.find(task => task.id === taskId);
        if (taskToUpdate) {
            const updatedTaskData = {
                ...taskToUpdate,
                subtasks: [...taskToUpdate.subtasks, newSubtask],
            };
            dispatch({ type: 'EDIT_TASK', payload: updatedTaskData });
        }
    };

    const handleDeleteSubtask = (taskId: string, subtaskId: string) => {
        const taskToUpdate = tasks.find(task => task.id === taskId);
        if (taskToUpdate) {
            const updatedSubtasks = taskToUpdate.subtasks.filter(subtask => subtask.id !== subtaskId);
            const updatedTaskData = {
                ...taskToUpdate,
                subtasks: updatedSubtasks,
            };
            dispatch({ type: 'EDIT_TASK', payload: updatedTaskData });
        }
    };

    const handleChangeSubtask = (taskId: string, subtaskId: string) => {
        const taskToUpdate = tasks.find(task => task.id === taskId);
        if (taskToUpdate) {
            const updatedSubtasks = taskToUpdate.subtasks.map(subtask =>
                subtask.id === subtaskId ? { ...subtask, isComplete: !subtask.isComplete } : subtask
            );
            const updatedTaskData = {
                ...taskToUpdate,
                subtasks: updatedSubtasks,
            };
            dispatch({ type: 'EDIT_TASK', payload: updatedTaskData });
        }
    };

    const isOverdue = (dueDate : Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return dueDate < today;
      };
      
      const isDueToday = (dueDate : Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return dueDate.toDateString() === today.toDateString();
      };

    const checkDate = (task: Task) => {
        const dueDate = new Date(task.dueDate);
        const overdue = isOverdue(dueDate);
        const dueToday = isDueToday(dueDate);
      
        const taskStyle = {
          color: overdue ? 'red' : dueToday ? 'orange' : 'black', // Overdue tasks are red, due today are orange
          fontWeight: overdue || dueToday ? 'bold' : 'normal',
        };
    }

    const renderTask = (task: Task) => (
        <Box key={task.id} sx={{ padding: '10px', borderRadius: '5px', backgroundColor: '#f5f5f5', marginBottom: '10px' }}>
            {editingTaskId === task.id ? (
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="Description"
                        value={updatedDescription}
                        onChange={(e) => setUpdatedDescription(e.target.value)}
                    />
                    <TextField
                        label="Due Date"
                        type="date"
                        value={updatedDueDate}
                        onChange={(e) => setUpdatedDueDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                    <FormControl>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={updatedCategory}
                            onChange={(e) => setUpdatedCategory(e.target.value)}
                        >
                            {categories.map(category => (
                                <MenuItem key={category} value={category}>{category}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box display="flex" gap={1}>
                        <Button variant="contained" color="primary" onClick={() => handleEditSave(task.id)}>Save</Button>
                        <Button variant="outlined" onClick={() => setEditingTaskId(null)}>Cancel</Button>
                    </Box>
                </Box>
            ) : (
                <Box display="flex" flexDirection="column">
                    <ListItem>
                        <ListItemText
                            primary={
                                <Typography variant="h6" color={task.isComplete ? 'success.main' : 'error.main'}>
                                    {task.description}
                                </Typography>
                            }
                            secondary={
                                <Typography variant="body2"
                                    sx={{ ...checkDate, marginBottom: '10px'}}>
                                    Due: {task.dueDate.toLocaleDateString()} | Category: {task.category}
                                </Typography>
                            }
                        />
                        <ListItemSecondaryAction>
                            <Button variant="outlined" onClick={() => handleEditStart(task)}>Edit</Button>
                            <Button variant="outlined" color="secondary" onClick={() => handleDelete(task.id)} style={{ marginLeft: '10px' }}>Delete</Button>
                            <Button variant="contained" color={task.isComplete ? 'error' : 'success'} onClick={() => handleCompleteIncompleteTask(task.id)} style={{ marginLeft: '10px' }}>
                                {task.isComplete ? 'Mark Incomplete' : 'Mark Complete'}
                            </Button>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <SubtaskList
                        task={task}
                        onAddSubtask={handleAddSubtask}
                        onDeleteSubtask={handleDeleteSubtask}
                        onChangeSubtask={handleChangeSubtask}
                    />
                    <Divider sx={{ margin: '10px 0' }} />
                </Box>
            )}
        </Box>
    );

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>Task List</Typography>
            <Box display="flex" gap={2} marginBottom={2}>
                <FormControl variant="outlined" fullWidth margin="normal">
                    <InputLabel htmlFor="status-filter">Status Filter</InputLabel>
                    <Select
                        labelId="status-filter-label"
                        id="status-filter"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as Filter)}
                        label="Status Filter"  // This prop enhances accessibility and style
                    >
                        <MenuItem value={Filter.All}>All</MenuItem>
                        <MenuItem value={Filter.Complete}>Complete</MenuItem>
                        <MenuItem value={Filter.Incomplete}>Incomplete</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="outlined" fullWidth margin="normal">
                    <InputLabel id="category-filter-label">Category Filter</InputLabel>
                    <Select
                        labelId="category-filter-label"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        label="Category Filter"  // Ensures the floating label works correctly
                    >
                        <MenuItem value="All">All</MenuItem>
                        {categories.map((category, index) => (
                            <MenuItem key={index} value={category}>{category}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            {tasks.length === 0 ? (
                <Typography>No tasks available. Please add a task.</Typography>
            ) : (
                <List sx={{ marginTop: 2 }}>
                    {filteredTasks.map(renderTask)}
                </List>
            )}
        </Box>
    );
};

export default TaskList;
