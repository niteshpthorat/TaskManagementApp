import React, { useReducer, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import { Task } from './models/Task';
import useLocalStorage from './hooks/useLocalStorage';

// Defining as empty array for intital state
const initialState: Task[] = [];

// Define the reducer function to manage task state
const reducer = (state: Task[], action: any): Task[] => {
    switch (action.type) {
      case 'ADD_TASK':
          return [...state, action.payload];
      case 'EDIT_TASK':
          return state.map(task => task.id === action.payload.id ? action.payload : task);
      case 'DELETE_TASK':
          return state.filter(task => task.id !== action.payload);
      case 'CHANGE_TASK':
          return state.map(task => task.id === action.payload ? { ...task, isComplete: !task.isComplete } : task);
      default:
          return state;
    }
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
