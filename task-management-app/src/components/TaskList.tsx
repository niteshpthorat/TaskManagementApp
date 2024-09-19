import React, { useState } from 'react';
import { Task } from '../models/Task';

enum Filter {
    All = 'all',
    Complete = 'complete',
    Incomplete = 'incomplete'
}

interface TaskListProps {
    tasks: Task[];               
    dispatch: React.Dispatch<any>; 
}

const TaskList: React.FC<TaskListProps> = ({ tasks, dispatch }) => {
    
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [updatedDescription, setUpdatedDescription] = useState('');
    const [updatedDueDate, setUpdatedDueDate] = useState('');
    const [updatedCategory, setUpdatedCategory] = useState('');

    const [filter, setFilter] = useState<Filter>(Filter.All);

    const renderTask = (task: Task) => (
        <li key={task.id}>
            {editingTaskId === task.id ? (
                <div>
                    <input
                        type="text"
                        value={updatedDescription}
                        onChange={(e) => setUpdatedDescription(e.target.value)}
                    />
                    <input
                        type="date"
                        value={updatedDueDate}
                        onChange={(e) => setUpdatedDueDate(e.target.value)}
                    />
                    <select
                        value={updatedCategory}
                        onChange={(e) => setUpdatedCategory(e.target.value)}
                    >
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Urgent">Urgent</option>
                    </select>
                    <button onClick={() => handleEditSave(task.id)}>Save</button>
                    <button onClick={() => setEditingTaskId(null)}>Cancel</button>
                </div>
            ) : (
                <div>
                    {task.description} : {task.isComplete ? 'Complete' : 'Incomplete'}
                    - Due: {task.dueDate.toLocaleDateString()} - Category : {task.category}
                    <button onClick={() => handleEditStart(task)}>Edit</button>
                    <button onClick={() => handleDelete(task.id)}>Delete</button>
                    <button onClick={() => handleCompleteIncompleteTask(task.id)}>
                        {task.isComplete ? 'Mark Incomplete' : 'Mark Complete'}
                    </button>
                </div>
            )}
        </li>
    );

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
        const updatedTask: Task = {
            id: taskId,
            description: updatedDescription,
            dueDate: new Date(updatedDueDate),
            category: updatedCategory,
            subtasks: [], // Will update once the subtasks part is added
            isComplete: false, 
        };
        dispatch({ type: 'EDIT_TASK', payload: updatedTask });
        setEditingTaskId(null); 
    };

    const handleCompleteIncompleteTask = (taskId: string) => {
        dispatch({ type: 'CHANGE_TASK', payload: taskId });
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'complete') return task.isComplete;
        if (filter === 'incomplete') return !task.isComplete;
        return true; 
    });


    return (

        <div>
            <h2>Task List</h2>
            <div>
                <label>Filter tasks: </label>
                <select value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
                    <option value={Filter.All}>All</option>
                    <option value={Filter.Complete}>Complete</option>
                    <option value={Filter.Incomplete}>Incomplete</option>
                </select>
            </div>
            {filteredTasks.length === 0 ? (
                <li>No tasks available. Please add a task.</li>
            ) : (
                <ul>{filteredTasks.map(renderTask)}</ul>
            )}
        </div>
    );
};
export default TaskList;
