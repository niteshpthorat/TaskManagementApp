import React, { useState } from 'react';
import { Task, Subtask } from '../models/Task';

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

    const renderSubtask = (subtask: Subtask) => (
        <li key={subtask.id}>
            <span>
                <span>Description: {subtask.description} - </span>
                <span>Status: {subtask.isComplete ? 'Complete' : 'Incomplete'}</span>
            </span>
            <button onClick={() => onChangeSubtask(task.id, subtask.id)}>
                {subtask.isComplete ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
            <button onClick={() => onDeleteSubtask(task.id, subtask.id)}>Delete</button>
        </li>
    );

    return (
        <div>
            <h4>Subtasks</h4>
            <input
                type="text"
                placeholder="Add a subtask"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button onClick={handleAddSubtask}>Add Subtask</button>
            <ul>
                {task.subtasks.map(renderSubtask)}
            </ul>
        </div>
    );
};

export default SubtaskList;
