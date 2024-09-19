import React from 'react';
import { Task } from '../models/Task';

interface TaskListProps {
    tasks: Task[];               
    dispatch: React.Dispatch<any>; 
}

const TaskList: React.FC<TaskListProps> = ({ tasks, dispatch }) => {
    // Display of Tasks
    const renderTaskItem = (task: Task) => (
        <li key={task.id}>
            {task.description} : {task.isComplete ? 'Complete' : 'Incomplete'}
            - Due: {task.dueDate.toLocaleDateString()} - Category : {task.category}
        </li>
    );

    return (
        <div>
            <h2>Task List</h2>
            <ul>
                {tasks.length > 0 ? (
                    tasks.map(renderTaskItem) 
                ) : (
                    <li>No tasks available.</li>
                )}
            </ul>
        </div>
    );
};

export default TaskList;
