import React from 'react';
import { Task } from '../models/Task';

interface TaskListProps {
    tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
    return (
        <div>
            <h2>Task List</h2>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        {task.isComplete ? 'Complete: ' : 'Incomplete: '}
                        {task.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;
