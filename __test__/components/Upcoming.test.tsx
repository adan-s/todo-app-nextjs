import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Upcoming from '@/components/Upcoming';
import { addTask, updateTask, getUserTasks, deleteTask } from '@/serverApi/taskApi';
import { findUser } from '@/serverApi/userApi';

jest.mock('@/serverApi/taskApi', () => ({
  addTask: jest.fn(),
  updateTask: jest.fn(),
  getUserTasks: jest.fn(),
  deleteTask: jest.fn(),
}));

jest.mock('@/serverApi/userApi', () => ({
  findUser: jest.fn(),
}));

describe('Upcoming Component', () => {
  const mockTasks = [
    { id: 1, title: 'Task 1', description: 'Description 1', duedate: new Date().toISOString(), status: 'New', category_name: 'Work' },
    { id: 2, title: 'Task 2', description: 'Description 2', duedate: new Date(Date.now() + 86400000).toISOString(), status: 'In Progress', category_name: 'Personal' },
    { id: 3, title: 'Task 3', description: 'Description 3', duedate: new Date(Date.now() + 172800000).toISOString(), status: 'Completed', category_name: 'Other' },
  ];

  const mockUser = { id: 1, email: 'test@example.com' };

  beforeEach(() => {
    localStorage.setItem('loggedInUser', JSON.stringify(mockUser.email));
    (findUser as jest.Mock).mockResolvedValue(mockUser.id);
    (getUserTasks as jest.Mock).mockResolvedValue(mockTasks);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders component and fetches tasks', async () => {
    render(<Upcoming />);

    expect(screen.getByRole('heading', { level: 1, name: /Upcoming/i })).toBeInTheDocument();

    expect(screen.getByText('+ Add New Task')).toBeInTheDocument();

    await waitFor(() => {
      expect(getUserTasks).toHaveBeenCalledWith(mockUser.id);
    });

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
  });

  it('opens form for adding new task', async () => {
    render(<Upcoming />);

    fireEvent.click(screen.getByText('+ Add New Task'));

    await waitFor(() => {

        expect(screen.getByRole('button', {  name: /Add Task/i })).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Task' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'New Description' } });
    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: new Date().toISOString().split('T')[0] } });
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'New' } });
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'Work' } });

    fireEvent.click(screen.getByRole('button', {  name: /Add Task/i }));

    await waitFor(() => {
      expect(addTask).toHaveBeenCalledWith('New Task', 'New Description', new Date().toISOString().split('T')[0], 'New', 'Work', mockUser.id);
    });

  });
//     render(<Upcoming />);

//     await waitFor(() => {
//       expect(screen.getByText('Task 1')).toBeInTheDocument();
//     });

//     fireEvent.click(screen.getByText('Details', { selector: 'button' }));

//     await waitFor(() => {
//       expect(screen.getByText('Edit Task')).toBeInTheDocument();
//     });

//     fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Task 1' } });
//     fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Updated Description 1' } });
//     fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: new Date().toISOString().split('T')[0] } });
//     fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'In Progress' } });
//     fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'Personal' } });

//     fireEvent.click(screen.getByText('Update Task'));

//     await waitFor(() => {
//       expect(updateTask).toHaveBeenCalledWith(1, 'Personal', {
//         title: 'Updated Task 1',
//         description: 'Updated Description 1',
//         duedate: new Date().toISOString().split('T')[0],
//         status: 'In Progress',
//       }, mockUser.id);
//     });

//     expect(screen.queryByText('Edit Task')).not.toBeInTheDocument();
//   });

//   it('handles task deletion', async () => {
//     render(<Upcoming />);

//     await waitFor(() => {
//       expect(screen.getByText('Task 1')).toBeInTheDocument();
//     });

//     fireEvent.click(screen.getByText('Delete', { selector: 'button' }));

//     await waitFor(() => {
//       expect(screen.getByText('Are you sure you want to delete the task?')).toBeInTheDocument();
//     });

//     fireEvent.click(screen.getByText('Delete', { selector: 'button' }));

//     await waitFor(() => {
//       expect(deleteTask).toHaveBeenCalledWith(1);
//     });

//     expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
//   });

//   it('shows error messages for form validation', async () => {
//     render(<Upcoming />);

//     fireEvent.click(screen.getByText('+ Add New Task'));

//     await waitFor(() => {
//       expect(screen.getByText('Add Task')).toBeInTheDocument();
//     });

//     fireEvent.click(screen.getByText('Add Task'));

//     await waitFor(() => {
//       expect(screen.getByText('All fields are required.')).toBeInTheDocument();
//     });

//     fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2020-01-01' } });
//     fireEvent.click(screen.getByText('Add Task'));

//     await waitFor(() => {
//       expect(screen.getByText('Due date cannot be earlier than the current date.')).toBeInTheDocument();
//     });
//   });
});
