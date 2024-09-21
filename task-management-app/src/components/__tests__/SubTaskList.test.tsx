import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SubtaskList from '../SubtaskList';  

describe('SubtaskList Component', () => {
  const mockOnAddSubtask = jest.fn();
  const mockOnDeleteSubtask = jest.fn();
  const mockOnChangeSubtask = jest.fn();
  const task = {
    id: 'task1',
    description: 'Main Task',
    subtasks: [
      { id: 'sub1', description: 'Subtask 1', isComplete: false },
      { id: 'sub2', description: 'Subtask 2', isComplete: true }
    ]
  };

  it('renders subtasks correctly', () => {
    render(<SubtaskList task={task} onAddSubtask={mockOnAddSubtask} onDeleteSubtask={mockOnDeleteSubtask} onChangeSubtask={mockOnChangeSubtask} />);
    expect(screen.getByText('Subtask 1')).toBeInTheDocument();
    expect(screen.getByText('Subtask 2')).toBeInTheDocument();
  });

  it('allows adding a subtask', async () => {
    render(<SubtaskList task={task} onAddSubtask={mockOnAddSubtask} onDeleteSubtask={mockOnDeleteSubtask} onChangeSubtask={mockOnChangeSubtask} />);
    const input = screen.getByPlaceholderText('Add a subtask');
    await userEvent.type(input, 'New Subtask{enter}');
    expect(mockOnAddSubtask).toHaveBeenCalledWith(task.id, 'New Subtask');
  });

  it('allows deleting a subtask', async () => {
    render(<SubtaskList task={task} onAddSubtask={mockOnAddSubtask} onDeleteSubtask={mockOnDeleteSubtask} onChangeSubtask={mockOnChangeSubtask} />);
    const deleteButtons = screen.getAllByText('Delete');
    await userEvent.click(deleteButtons[0]); // Click delete on the first subtask
    expect(mockOnDeleteSubtask).toHaveBeenCalledWith(task.id, 'sub1');
  });

  it('allows changing the completion status of a subtask', async () => {
    render(<SubtaskList task={task} onAddSubtask={mockOnAddSubtask} onDeleteSubtask={mockOnDeleteSubtask} onChangeSubtask={mockOnChangeSubtask} />);
    const toggleCompleteButtons = screen.getAllByText('Mark Complete');
    await userEvent.click(toggleCompleteButtons[0]); // Toggle completion of the first subtask
    expect(mockOnChangeSubtask).toHaveBeenCalledWith(task.id, 'sub1');
  });
});
