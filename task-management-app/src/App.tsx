import React, { useReducer, useEffect , useState} from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import { Task } from './models/Task';
import useLocalStorage from './hooks/useLocalStorage';
import CategoryManager from './components/CategoryManager';

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

    const [categories, setCategories] = useState<string[]>(['Work', 'Personal', 'Urgent']); // Predefined categories

    const handleAddCategory = (category: string) => {
      setCategories((prev) => [...prev, category]);
    };

    const handleEditCategory = (oldCategory: string, newCategory: string) => {
        setCategories((prev) => 
            prev.map(category => (category === oldCategory ? newCategory : category))
        );
    };

    const handleDeleteCategory = (category: string) => {
        setCategories((prev) => prev.filter(cat => cat !== category));
    };

    useEffect(() => {
      setStoredTasks(state);
    }, [state, setStoredTasks]);


    return (
        <div className="App">
            <h1>Task Management App</h1>
            <CategoryManager
                categories={categories}
                onAddCategory={handleAddCategory}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
            />
            <TaskForm 
              dispatch={dispatch }
              categories={categories}
             />
            
            <TaskList tasks={state} dispatch={dispatch}
              categories={categories} />
        </div>
    );
};

export default App;
