import { render, screen } from '@testing-library/react';
import App from './App';
import useLocalStorage from '@hooks/useLocalStorage';

jest.mock('../hooks/useLocalStorage');

describe('App Component', () => {
  beforeEach(() => {
    (useLocalStorage as jest.Mock).mockImplementation(() => [
      [], // mock state as empty array initially
      jest.fn() // mock setter function
    ]);
  });

  it('renders the task management header', () => {
    render(<App />);
    expect(screen.getByText(/Task Management App/i)).toBeInTheDocument();
  });

  // Add more tests for dispatch actions, effect hooks etc.
});
