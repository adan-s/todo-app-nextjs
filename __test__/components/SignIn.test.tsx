import SignIn from '@/components/SignIn';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/serverApi/userApi', () => ({
  getUsers: jest.fn().mockResolvedValue([
    { email: 'example@gmail.com', password: 'password123' },
  ]),
}));

describe('SignIn', () => {
  const push = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      push,
    }));
  });

  it('renders a heading', () => {
    render(<SignIn />);
    const heading = screen.getByText('Email');
    expect(heading).toBeInTheDocument();
  });

  it('handles sign in', async () => {
    render(<SignIn />);
    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'example@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/ToDo'); 
    });

  });


});
