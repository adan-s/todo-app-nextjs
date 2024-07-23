import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Profile from '@/components/Profile';
import "@testing-library/jest-dom";


const getUserMock = jest.fn();
const updateUserMock = jest.fn();
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


jest.mock("@/serverApi/userApi", () => ({
  getUser: () => getUserMock(),
  updateUser: (id:number,
    updatedUser: {
    username: string,
    email:string,
    password:string,
  }) => updateUserMock(id,updatedUser),
}));

const mockUser = {
  id: 1,
  username: "testuser",
  email: "testuser@example.com",
};

describe("Profile Component", () => {
  beforeEach(() => {
    localStorageMock.setItem("loggedInUser", JSON.stringify(mockUser.email));
    getUserMock.mockResolvedValue(mockUser);
    updateUserMock.mockResolvedValue({ ...mockUser, username: "updateduser" });
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  it("renders Profile component correctly", async () => {
    render(<Profile />);

    await waitFor(() =>
      expect(screen.getByText("User Profile")).toBeInTheDocument()
    );
  });

  it("fetches and displays user data", async () => {
    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByLabelText("Username")).toHaveValue(mockUser.username);
      expect(screen.getByLabelText("Email")).toHaveValue(mockUser.email);
    });
  });

  it("toggles edit mode", async () => {
    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText("Edit")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Edit"));

    await waitFor(() => {
      expect(screen.getByLabelText("New Password")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(screen.queryByLabelText("New Password")).not.toBeInTheDocument();
    });
  });

  it("validates form input", async () => {
    render(<Profile />);

    fireEvent.click(await screen.findByText("Edit"));
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "1234" },
    });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(
        screen.getByText("Username must contain alphabets.")
      ).toBeInTheDocument();
    });
  });

  it("submits form and updates user profile", async () => {
    render(<Profile />);

    fireEvent.click(await screen.findByText("Edit"));
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "updateduser" },
    });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(updateUserMock).toHaveBeenCalledWith(mockUser.id, {
        username: "updateduser",
        email: mockUser.email,
        password: "",
      });
      expect(
        screen.getByText("Profile updated successfully!")
      ).toBeInTheDocument();
    });
  });
});
