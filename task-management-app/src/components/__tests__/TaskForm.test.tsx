import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from '../TaskForm';  // Adjust the import path as necessary

describe('TaskForm Component', () => {
  const mockDispatch = jest.fn();
  const categories = ['Work', 'Personal'];

  beforeEach(() => {
    render(<TaskForm dispatch={mockDispatch} categories={categories} />);
  });

  it('submits form with task details', async () => {
    // Fill in the task description
    const descriptionInput = screen.getByLabelText(/Task Description/i);
    await userEvent.type(descriptionInput, 'Complete the project');

    // Set the due date
    const dueDateInput = screen.getByLabelText(/Due Date/i);
    await userEvent.type(dueDateInput, '2024-12-31');

    // Select a category
    const categorySelect = screen.getByLabelText(/Category/i);
    await userEvent.selectOptions(categorySelect, 'Work');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Add Task/i });
    await userEvent.click(submitButton);

    // Check if dispatch was called
    expect(mockDispatch).toHaveBeenCalled();
  });
});
