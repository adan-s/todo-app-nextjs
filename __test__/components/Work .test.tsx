import React from "react";
import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import Work from "@/components/Work";

const getUserTasksMock = jest.fn();
const addTaskMock = jest.fn();
const findUserMock = jest.fn();
const updateTaskMock = jest.fn();
const deleteTaskMock = jest.fn();
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


jest.mock("@/serverApi/taskApi", () => ({
  addTask: (
    title: string,
    description: string,
    duedate: string,
    status: string,
    category_name: string,
    userId: number
  ) => addTaskMock(title, description, duedate, status, category_name, userId),
  updateTask: (
    id: number,
    category_name: string,
    updatedTask: {
      title: string;
      description: string;
      duedate: string;
      status: string;
    },
    userId: number
  ) => updateTaskMock(id, category_name, updatedTask, userId),
  getUserTasks: (id: number) => getUserTasksMock(id),
  deleteTask: (id: number) => deleteTaskMock(id),
}));

jest.mock("@/serverApi/userApi", () => ({
  findUser: (email: string) => findUserMock(email),
}));

describe("Work Component", () => {
  const mockUser = { id: 1, email: "test@example.com" };
  const mockTasks = [
    {
      id: 1,
      title: "Task 1",
      description: "Description 1",
      duedate: new Date().toISOString(),
      status: "New",
      category_name: "Work",
      user_id: mockUser.id,
    },
    {
      id: 2,
      title: "Task 2",
      description: "Description 2",
      duedate: new Date().toISOString(),
      status: "In Progress",
      category_name: "Work",
      user_id: mockUser.id,
    },
    {
      id: 3,
      title: "Task 3",
      description: "Description 3",
      duedate: new Date().toISOString(),
      status: "Completed",
      category_name: "Work",
      user_id: mockUser.id,
    },
  ];

  beforeEach(() => {
    localStorageMock.setItem("loggedInUser", JSON.stringify(mockUser.email));

    findUserMock.mockImplementation((email) => {
      if (email === mockUser.email) {
        return Promise.resolve(mockUser.id);
      }
      return Promise.reject(new Error("User not found"));
    });

    getUserTasksMock.mockImplementation((id) => {
      if (id === mockUser.id) {
        return Promise.resolve(mockTasks);
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  it("renders component and fetches tasks", async () => {
    await act(async () => render(<Work />));

    expect(
      screen.getByRole("heading", { level: 1, name: /Work/i })
    ).toBeInTheDocument();
    expect(screen.getByText("+ Add New Task")).toBeInTheDocument();

    await waitFor(() => {
      expect(findUserMock).toHaveBeenCalledWith(mockUser.email);
      expect(getUserTasksMock).toHaveBeenCalledWith(mockUser.id);
    });

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
    expect(screen.getByText("Task 3")).toBeInTheDocument();
  });

  it("opens form for adding new task", async () => {
    addTaskMock.mockResolvedValue({
      id: 4,
      title: "New Task",
      description: "New Description",
      duedate: new Date().toISOString(),
      status: "New",
      category_name: "Work",
      user_id: mockUser.id,
    });

    render(<Work />);

    fireEvent.click(screen.getByText("+ Add New Task"));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Add Task/i })
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "New Task" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "New Description" },
    });
    fireEvent.change(screen.getByLabelText("Due Date"), {
      target: { value: new Date().toISOString().split("T")[0] },
    });
    fireEvent.change(screen.getByLabelText("Status"), {
      target: { value: "New" },
    });
    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "Work" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Add Task/i }));

    await waitFor(() => {
      expect(addTaskMock).toHaveBeenCalledWith(
        "New Task",
        "New Description",
        expect.any(String),
        "New",
        "Work",
        mockUser.id
      );
    });
  });

  it("handles task update", async () => {
    render(<Work />);

    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
    });

    const detailButtons = screen.getAllByRole("button", { name: /Details/i });
    fireEvent.click(detailButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Edit Task")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Updated Task 1" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Updated Description 1" },
    });
    fireEvent.change(screen.getByLabelText("Due Date"), {
      target: { value: new Date().toISOString().split("T")[0] },
    });
    fireEvent.change(screen.getByLabelText("Status"), {
      target: { value: "In Progress" },
    });
    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "Work" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Update Task/i }));

    await waitFor(() => {
      expect(updateTaskMock).toHaveBeenCalledWith(
        1,
        "Work",
        {
          title: "Updated Task 1",
          description: "Updated Description 1",
          duedate: new Date().toISOString().split("T")[0],
          status: "In Progress",
        },
        mockUser.id
      );
    });
  });

  it("handles task deletion", async () => {
    render(<Work />);

    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole("button", { name: /Delete/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(
        screen.getByText("Are you sure you want to delete the task?")
      ).toBeInTheDocument();
      fireEvent.click(screen.getByText(/Yes/i));
    });

    await waitFor(() => {
      expect(deleteTaskMock).toHaveBeenCalledWith(1);
    });

    expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
  });

  it("shows error messages for form validation", async () => {
    render(<Work />);

    fireEvent.click(screen.getByText("+ Add New Task"));

    await waitFor(() => {
      expect(screen.getByText("Title")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Add Task/i }));

    await waitFor(() => {
      expect(screen.getByText("Title is required.")).toBeInTheDocument();
      expect(screen.getByText("Description is required.")).toBeInTheDocument();
      expect(screen.getByText("Due Date is required.")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Due Date"), {
      target: { value: "2020-01-01" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Add Task/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Due Date cannot be earlier than the current date.")
      ).toBeInTheDocument();
    });
  });
});
