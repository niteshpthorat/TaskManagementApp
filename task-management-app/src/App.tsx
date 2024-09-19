import React, { useReducer, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import { Task } from './models/Task';
import useLocalStorage from './hooks/useLocalStorage';

// Define the initial state as an empty array of tasks
const initialState: Task[] = [];

type Action = { type: 'ADD_TASK'; payload: Task };

// Define the reducer function to manage task state
const reducer = (state: Task[], action: Action): Task[] => {
    if (action.type === 'ADD_TASK') {
        return [...state, action.payload];
    }
    return state; 
};

const App: React.FC = () => {
    // Custom hooks for managing local storage
    const [storedTasks, setStoredTasks] = useLocalStorage<Task[]>('tasks', initialState);
    
    // For managing task stage
    const [state, dispatch] = useReducer(reducer, storedTasks);

    useEffect(() => {
        setStoredTasks(state);
    }, [state, setStoredTasks]);

    return (
        <div className="App">
            <h1>Task Management App</h1>
            <TaskForm dispatch={dispatch} />
            
            <TaskList tasks={state} dispatch={dispatch} />
        </div>
    );
};

export default App;
