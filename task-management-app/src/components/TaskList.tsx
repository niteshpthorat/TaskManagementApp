import React, { useState } from 'react';
import { Task } from '../models/Task';
import SubtaskList from './SubtaskList';

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

const TaskList: React.FC<TaskListProps> = ({ tasks, dispatch ,categories}) => {
    
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [updatedDescription, setUpdatedDescription] = useState('');
    const [updatedDueDate, setUpdatedDueDate] = useState('');
    const [updatedCategory, setUpdatedCategory] = useState('');
    
    const [filter, setFilter] = useState<Filter>(Filter.All);
    const [categoryFilter, setCategoryFilter] = useState<string>('All');

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
                       {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                                    ))}
                    </select>
                    <button onClick={() => handleEditSave(task.id)}>Save</button>
                    <button onClick={() => setEditingTaskId(null)}>Cancel</button>
                </div>
            ) : (
                <div>
                     <span>{task.description} : {task.isComplete ? 'Complete' : 'Incomplete'}</span>
                     <span>- Due: {task.dueDate.toLocaleDateString()} - Category : {task.category}</span>
                    <button onClick={() => handleEditStart(task)}>Edit</button>
                    <button onClick={() => handleDelete(task.id)}>Delete</button>
                    <button onClick={() => handleCompleteIncompleteTask(task.id)}>
                        {task.isComplete ? 'Mark Incomplete' : 'Mark Complete'}
                    </button>

                    <SubtaskList
                        task={task}
                        onAddSubtask={handleAddSubtask}
                        onDeleteSubtask={handleDeleteSubtask}
                        onChangeSubtask={handleChangeSubtask}
                    />
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
        const taskToUpdate = tasks.find(task => task.id === taskId);
        if (taskToUpdate) {
            const updatedTask: Task = {
                id: taskId,
                description: updatedDescription,
                dueDate: new Date(updatedDueDate),
                category: updatedCategory || '',
                subtasks: taskToUpdate.subtasks, // Retain existing subtasks
                isComplete: taskToUpdate.isComplete, // Retain the current completion status
            };
            dispatch({ type: 'EDIT_TASK', payload: updatedTask });
            setEditingTaskId(null);
        }
    };

    const handleCompleteIncompleteTask = (taskId: string) => {
        const taskToUpdate = tasks.find(task => task.id === taskId);
        if (taskToUpdate) {
            // Check if all subtasks are complete
            const allSubtasksComplete = taskToUpdate.subtasks.every(subtask => subtask.isComplete);
            const updatedTaskData = {
                ...taskToUpdate,
                isComplete: allSubtasksComplete, // Set task complete if all subtasks are complete
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

    return (

        <div>
            <h2>Task List</h2>
            <div>
                <label>Filter tasks by Status: </label>
                <select value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
                    <option value={Filter.All}>All</option>
                    <option value={Filter.Complete}>Complete</option>
                    <option value={Filter.Incomplete}>Incomplete</option>
                </select>
            </div>
            <div>
                <label>Filter tasks by category: </label>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option value="All">All</option>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
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
