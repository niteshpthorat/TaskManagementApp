import React, { useState } from 'react';
import { Task } from '../models/Task';
import { validateTask } from '../utils/validations';

interface TaskFormProps {
    dispatch: React.Dispatch<any>;
}

const TaskForm: React.FC<TaskFormProps> = ({ dispatch }) => {
    const [taskDetails, setTaskDetails] = useState({
        description: '',
        dueDate: '',
        category: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTaskDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { description, dueDate, category } = taskDetails;
        const dueDateObj = new Date(dueDate);

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
            setTaskDetails({ description: '', dueDate: '', category: '' }); // Reset category
        } else {
            alert('Please ensure all fields are filled out correctly.');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Task Description</label>
                <input
                    type="text"
                    name="description"
                    value={taskDetails.description}
                    onChange={handleInputChange}
                    placeholder="Enter task description"
                    required
                    style={{ width: '100%', padding: '8px'}}
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Due Date</label>
                <input
                    type="date"
                    name="dueDate"
                    value={taskDetails.dueDate}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '8px' }}
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block' }}>Category</label>
                <select
                    name="category"
                    value={taskDetails.category}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '8px'}}
                    required
                >
                    <option value="" disabled>Select a category</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Urgent">Urgent</option>
                </select>
            </div>

            <button type="submit" style={{ padding: '10px 15px'}}>
                Add Task
            </button>
        </form>
    );
};

export default TaskForm;
