import React, { useReducer, useEffect, useState } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import { Task } from './models/Task';
import useLocalStorage from './hooks/useLocalStorage';
import CategoryManager from './components/CategoryManager';
import NotificationManager from './components/NotificationManager';
import { Typography, Container, Box } from '@mui/material';


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

    useEffect(() => {
        if (Notification.permission !== "granted") {
          Notification.requestPermission();
        }
      
        const now = new Date();
        state.forEach(task => {
          const dueDate = new Date(task.dueDate);
          const timeDiff = dueDate.getTime() - now.getTime();
      
          if (timeDiff > 0 && timeDiff <= 24 * 60 * 60 * 1000) { // Task is within the next 24 hours
            if (Notification.permission === "granted") {
              new Notification("Reminder", {
                body: `Task "${task.description}" is due soon!`,            
              });
            }
          }
        });
      }, [state]); // Dependency on tasks to re-run when tasks update
      

    return (



        <div className="App">
            <Container maxWidth="lg">
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="150px" bgcolor="primary.main" color="primary.contrastText" borderRadius={5} boxShadow={3}>
                    <Typography variant="h2" component="h1" align="center" gutterBottom>
                        Task Management App
                    </Typography>
                </Box>
            </Container>

            <Box sx={{ margin: '20px 0' }}>
                <TaskForm
                    dispatch={dispatch}
                    categories={categories}
                />
            </Box>

            <Box sx={{ margin: '20px 0' }}>
                <CategoryManager
                    categories={categories}
                    onAddCategory={handleAddCategory}
                    onEditCategory={handleEditCategory}
                    onDeleteCategory={handleDeleteCategory}
                />
            </Box>

            <Box sx={{ margin: '20px 0' }}>
                <TaskList tasks={state} dispatch={dispatch}
                    categories={categories} />
            </Box>
            <NotificationManager tasks={state} /> {/* Add NotificationManager here */}
        </div>

    );
};

export default App;
