import React, { useEffect } from 'react';
import { Task } from '../models/Task';

interface NotificationManagerProps {
    tasks: Task[];
}

const NotificationManager: React.FC<NotificationManagerProps> = ({ tasks }) => {
    useEffect(() => {
        const now = new Date();
        tasks.forEach(task => {
            const taskDueDate = new Date(task.dueDate);
            const timeDiff = taskDueDate.getTime() - now.getTime();
            if (timeDiff <= 24 * 60 * 60 * 1000) { // within 24 hours
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new Notification(`Reminder: Task "${task.description}" is due soon!`);
                    }
                });
            }
        });
    }, [tasks]);

    return null; // This component does not need to render anything
};

export default NotificationManager;
