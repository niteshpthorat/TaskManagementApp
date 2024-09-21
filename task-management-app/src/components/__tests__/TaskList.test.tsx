import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskList from '../TaskList';

describe('TaskList Component', () => {
  const mockDispatch = jest.fn();
  const tasks = [
    { id: '1', description: 'Task 1', dueDate: new Date('2024-09-25'), category: 'Work', isComplete: false, subtasks: [] },
    { id: '2', description: 'Task 2', dueDate: new Date('2024-09-26'), category: 'Personal', isComplete: true, subtasks: [] }
  ];

  it('calls dispatch when the delete button is clicked', async () => {
    render(<TaskList tasks={tasks} dispatch={mockDispatch} categories={['Work', 'Personal']} />);
    const deleteButton = await screen.findAllByText('Delete');
    await userEvent.click(deleteButton[0]);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'DELETE_TASK', payload: '1' });
  });

  it('filters tasks based on category', async () => {
    render(<TaskList tasks={tasks} dispatch={mockDispatch} categories={['Work', 'Personal']} />);
    const categoryFilterButton = screen.getByLabelText('Category Filter');
    await userEvent.click(categoryFilterButton);
    const workOption = await screen.findByRole('option', { name: 'Work' });
    await userEvent.click(workOption);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
  });
});
