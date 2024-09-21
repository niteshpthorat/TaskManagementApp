import React, { useState } from 'react';
import { Task, Subtask } from '../models/Task';
import {
    Button,
    TextField,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Box,
} from '@mui/material';

interface SubtaskListProps {
    task: Task;
    onAddSubtask: (taskId: string, description: string) => void;
    onDeleteSubtask: (taskId: string, subtaskId: string) => void;
    onChangeSubtask: (taskId: string, subtaskId: string) => void; 
}

const SubtaskList: React.FC<SubtaskListProps> = ({ task, onAddSubtask, onDeleteSubtask, onChangeSubtask }) => {
    const [newSubtask, setNewSubtask] = useState('');

    const handleAddSubtask = () => {
        if (newSubtask.trim()) {
            onAddSubtask(task.id, newSubtask);
            setNewSubtask(''); // Clearing input after insert
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddSubtask();
        }
    };

    return (
        <div>
            <List>
                {task.subtasks.map((subtask: Subtask) => (
                    <ListItem key={subtask.id}>
                        <ListItemText
                            primary={subtask.description}
                            secondary={`Status: ${subtask.isComplete ? 'Complete' : 'Incomplete'}`}
                        />
                        <ListItemSecondaryAction>
                            <Button
                                variant="outlined"
                                onClick={() => onChangeSubtask(task.id, subtask.id)}
                            >
                                {subtask.isComplete ? 'Mark Incomplete' : 'Mark Complete'}
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => onDeleteSubtask(task.id, subtask.id)}
                                sx={{ marginLeft: '10px' }}
                            >
                                Delete
                            </Button>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            <TextField
                variant="outlined"
                placeholder="Add a subtask"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={handleKeyDown}
                sx={{ marginBottom: '10px' }}
            />
        </div>
    );
};

export default SubtaskList;
