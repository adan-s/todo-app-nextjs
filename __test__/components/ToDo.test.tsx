import ToDo from "@/components/ToDo";
import { getCategory } from "@/serverApi/categoryApi";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { useRouter } from "next/navigation";
import React from "react";

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/serverApi/categoryApi', () => ({
  getCategory: jest.fn(),
}));

describe('ToDo Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (getCategory as jest.Mock).mockResolvedValue([
        { category_name: 'Work' },
        { category_name: 'Personal' },
        { category_name: 'Other' },
      ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders ToDo component ', async () => {
    render(<ToDo />);

    expect(screen.getByText('TODO-Wise')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Work')).toBeInTheDocument();
      expect(screen.getByText('Personal')).toBeInTheDocument();
      expect(screen.getByText('Other')).toBeInTheDocument();
    });
  });

  it('navigates between different views', async () => {
    render(<ToDo />);

    await waitFor(() => {
        expect(screen.getByRole('button', { name: /Add New Task/i }));
    });

    fireEvent.click(screen.getByRole('link', { name: /Today/i }));
    expect(screen.getByRole('link', { name: /Today/i }));

    fireEvent.click(screen.getByRole('link', { name: /Work/i }));
    expect(screen.getByRole('link', { name: /Work/i }));

    fireEvent.click(screen.getByRole('link', { name: /Personal/i }));
    expect(screen.getByRole('link', { name: /Personal/i }));

    fireEvent.click(screen.getByRole('link', { name: /Other/i }));
    expect(screen.getByRole('link', { name: /Other/i }));

    fireEvent.click(screen.getByRole('link', { name: /Profile/i }));
    expect(screen.getByRole('link', { name: /Profile/i }));
  });

  it('fetches and displays categories', async () => {
    render(<ToDo />);

    await waitFor(() => {
      expect(getCategory).toHaveBeenCalled();
      expect(screen.getByText('Work')).toBeInTheDocument();
      expect(screen.getByText('Personal')).toBeInTheDocument();
      expect(screen.getByText('Other')).toBeInTheDocument();
    });
  });

  it('handles sign out', async () => {
    render(<ToDo />);

    fireEvent.click(screen.getByRole('button', { name: /Sign Out/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/SignIn');
    });
  });
});
