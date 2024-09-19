import React from 'react';
import TaskDisplay from './components/TaskList';
import { Task } from './models/Task';

const App: React.FC = () => {
    const sampleTasks: Task[] = [
        { id: '1', description: 'Task One', isComplete: false },
        { id: '2', description: 'Task Two', isComplete: true },
        { id: '3', description: 'Task Three', isComplete: false },
    ];

    return (
        <div className="App">
            <h1>Task Management App</h1>
            <TaskDisplay tasks={sampleTasks} />
        </div>
    );
};

export default App;
