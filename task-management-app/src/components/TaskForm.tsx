import React, { useState } from 'react';
import { Task } from '../models/Task';
import { validateTask } from '../utils/validations';
import {
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    styled
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

interface TaskFormProps {
    dispatch: React.Dispatch<any>;
    categories: string[];
}

const TaskForm: React.FC<TaskFormProps> = ({ dispatch, categories }) => {
    const [taskDetails, setTaskDetails] = useState({
        description: '',
        dueDate: '',
        category: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTaskDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setTaskDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { description, dueDate, category } = taskDetails;
        const dueDateObj = new Date(`${dueDate}T00:00:00`);

        if (validateTask(description, dueDateObj, category)) {
            const newTask: Task = {
                id: Date.now().toString(),
                description,
                dueDate: dueDateObj,
                category,
                subtasks: [],
                isComplete: false,
            };

            dispatch({ type: 'ADD_TASK', payload: newTask });
            setTaskDetails({ description: '', dueDate: '', category: '' }); // Reset form fields
        } else {
            alert('Please ensure all fields are filled out correctly.');
        }
    };
    const FancyTypography = styled(Typography)(({ theme }) => ({
        fontSize: '2.5rem', // Larger font size
        fontWeight: 'bold', // Bold font weight for emphasis
        color: theme.palette.secondary.main, // Use the secondary color from the theme
        textShadow: '1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue', // Text shadow for a glowing effect
        padding: theme.spacing(2), // Padding around the text
        borderRadius: theme.shape.borderRadius, // Rounded corners
        boxShadow: `0 3px 5px 2px rgba(255, 105, 135, .3)`, // Box shadow for depth
        textAlign: 'center', // Center the text
        transition: 'transform 0.5s ease-in-out', // Smooth transform on hover
        '&:hover': {
          transform: 'scale(1.1)' // Scale up effect on hover
        }
      }));
    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
            <FancyTypography variant="h2" >
                Add New Task
            </FancyTypography>
            
            <TextField
                label="Task Description"
                name="description"
                value={taskDetails.description}
                onChange={handleInputChange}
                placeholder="Enter task description"
                required
                fullWidth
                margin="normal"
            />

            <TextField
                label="Due Date"
                type="date"
                name="dueDate"
                value={taskDetails.dueDate}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
            />

            <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel shrink={Boolean(taskDetails.category)}>Category</InputLabel>
                <Select
                    name="category"
                    value={taskDetails.category}
                    onChange={handleSelectChange}
                    required
                    label="Category"
                >
                    <MenuItem value="" disabled>Select a category</MenuItem>
                    {categories.map(cat => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Button type="submit" variant="contained" color="primary" style={{ marginTop: '15px' }}>
                Add Task
            </Button>
        </form>
    );
};

export default TaskForm;
