import SignIn from "@/components/SignIn";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { useRouter } from "next/navigation";
import React from "react";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/serverApi/userApi", () => ({
  getUsers: jest
    .fn()
    .mockResolvedValue([
      { email: "example@gmail.com", password: "password123" },
    ]),
}));

const localStorageMock = (function () {
  let store: any = {};

  return {
    getItem: function (key: any) {
      return store[key] || null;
    },
    setItem: function (key: any, value: any) {
      store[key] = value.toString();
    },
    removeItem: function (key: any) {
      delete store[key];
    },
    clear: function () {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("SignIn", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: mockPush,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders a heading", () => {
    render(<SignIn />);
    const heading = screen.getByText("Email");
    expect(heading).toBeInTheDocument();
  });

  it("shows an error if the user does not exist", async () => {
    await act(async () =>  render(<SignIn />));
    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
    const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: "wrong@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    await act(async () => {
      fireEvent.click(screen.getByText("Login"));
    });

    const error = await screen.findByText(/User doesn't exist/i);

    await waitFor(() => {
      expect(error).toBeInTheDocument();
    });
  });

  it("shows an error if the password is incorrect", async () => {
    await act(async () =>  render(<SignIn />));

    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
    const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: "example@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(screen.getByText("Login"));

    const error = await screen.findByText(/Wrong password/i);

    await waitFor(() => {
      expect(error).toBeInTheDocument();
    });
  });

  it("logs in the user if the credentials are correct", async () => {
    await act(async () => await render(<SignIn />));

    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
    const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: "example@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(localStorage.getItem("loggedInUser")).toBe(
        JSON.stringify("example@gmail.com")
      );
      expect(mockPush).toHaveBeenCalledWith("/ToDo");
    });
  });


  it('renders Sign Up', async () => {
    render(<SignIn />);

    fireEvent.click(screen.getByRole('link', { name: /SignUp/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/SignUp');
    });
  });

});
