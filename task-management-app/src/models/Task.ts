export interface Subtask {
    id: string;
    description: string;
    isComplete: boolean;
}

export interface Task {
    id: string;
    description: string;
    dueDate: Date;
    category: string;
    subtasks: Subtask[];
    isComplete: boolean;
}
