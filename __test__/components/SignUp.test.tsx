import SignUp from "@/components/SignUp";
import { getUser } from "@/serverApi/userApi";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/serverApi/userApi", () => ({
  getUser: jest.fn(),
  addUser: jest.fn().mockResolvedValue({ success: true }),
  getUsers: jest
    .fn()
    .mockResolvedValue([
      { email: "example@gmail.com", password: "password123" },
    ]),
}));

describe("SignUp", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: mockPush,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the initial page with Get Started button", () => {
    render(<SignUp />);
    const heading = screen.getByText(
      /Welcome to Your Ultimate To-Do List Manager!/i
    );
    expect(heading).toBeInTheDocument();
    const getStartedButton = screen.getByText(/Get Started/i);
    expect(getStartedButton).toBeInTheDocument();
  });

  it("shows the sign-up form when Get Started button is clicked", () => {
    render(<SignUp />);
    const getStartedButton = screen.getByText(/Get Started/i);
    fireEvent.click(getStartedButton);
    const signUpHeading = screen.getByText(/Username/i);
    expect(signUpHeading).toBeInTheDocument();
  });

  it("shows an error if the user already exists", async () => {
    await act(async () => render(<SignUp />));

    const mockUseGetUser = getUser as jest.Mock;

    mockUseGetUser.mockImplementation(() => {
      return {
        email: "example@gmail.com",
      };
    });

    fireEvent.click(screen.getByText(/Get Started/i));
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "example@gmail.com" },
    });
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => {
      const errorMessage = screen.getByText(
        /An account with this email already exists./i
      );
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it("signs up the user and redirects to /ToDo on success", async () => {
    await act(async () => render(<SignUp />));

    const mockUseGetUser = getUser as jest.Mock;
    mockUseGetUser.mockImplementation(() => {
      return {
        email: false,
      };
    });

    fireEvent.click(screen.getByText(/Get Started/i));
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "newuser@gmail.com" },
    });
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "newuser" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => {
      const successMessage = screen.getByText(/User signed up successfully!/i);
      expect(successMessage).toBeInTheDocument();
    });

    expect(mockPush).toHaveBeenCalledWith("/ToDo");
  });

  it("shows an error for invalid username", async () => {
    await act(async () => render(<SignUp />));

    fireEvent.click(screen.getByText(/Get Started/i));
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "valid@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "invalidusername1" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "validpassword1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => {
      const errorMessage = screen.getByText(
        /Username should not contain numbers./i
      );
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it("shows an error for invalid password", async () => {
    await act(async () => render(<SignUp />));

    fireEvent.click(screen.getByText(/Get Started/i));
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "valid@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "validusername" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "short" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => {
      const errorMessage = screen.getByText(
        /Password must be between 8 to 15 characters and include numbers./i
      );
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it("shows an error for invalid email", async () => {
    await act(async () => render(<SignUp />));

    fireEvent.click(screen.getByText(/Get Started/i));
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "validexample.com" },
    });
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "validusername" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => {
      const errorMessage = screen.getByText(
        /Please enter a valid email address./i
      );
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it("renders the SignIn page with Sign In button", async () => {
    await act(async () => render(<SignUp />));

    fireEvent.click(screen.getByText(/Sign in/i));
    expect(mockPush).toHaveBeenCalledWith("/SignIn");

    const signInPage = screen.getByText(
      /Welcome to Your Ultimate To-Do List Manager!/i
    );
    expect(signInPage).toBeInTheDocument();
  });
});
