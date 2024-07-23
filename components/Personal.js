import React, { useState, useEffect } from "react";
import {
  getUserTasks,
  addTask,
  updateTask,
  deleteTask,
} from "@/serverApi/taskApi";
import { findUser } from "@/serverApi/userApi";
import Checkbox from "@mui/material/Checkbox";

const Personal = () => {
  const userEmail = JSON.parse(localStorage.getItem("loggedInUser"));
  const [userId, setUserId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    duedate: "",
    status: "New",
    category: "Work",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await findUser(userEmail);
        setUserId(id);
        console.log("userid:", id);
      } catch (error) {
        console.error("Error fetching user ID:", error);
        setError("Error fetching user ID. Please try again.");
      }
    };

    fetchUserId();
  }, [userEmail]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!userId) {
        setError("Error! You are not logged in.");
        return;
      }

      try {
        const fetchedTasks = await getUserTasks(userId);
        console.log("userid:", userId);
        console.log(fetchedTasks);
        setTasks(fetchedTasks || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Error fetching tasks. Please try again.");
      }
    };

    console.log("fecth tasks:", fetchTasks);
    fetchTasks();
  }, [userId]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const currentDate = new Date().toISOString().split("T")[0];

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Basic validation checks
    if (
      formData.title.trim() === "" ||
      formData.desc.trim() === "" ||
      formData.duedate === ""
    ) {
      setError("All fields are required.");
      return;
    }

    if (formData.duedate < currentDate) {
      setError("Due date cannot be earlier than the current date.");
      return;
    }

    try {
      console.log("Form data before submission:", formData);
      if (selectedTask) {
        const updatedTask = await updateTask(
          selectedTask.id,
          formData.category,
          {
            title: formData.title,
            description: formData.desc,
            duedate: formData.duedate,
            status: formData.status,
          },
          userId
        );
        setTasks(
          tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        );

        console.log("Updated task:", updatedTask);
      } else {
        const newTask = await addTask(
          formData.title,
          formData.desc,
          formData.duedate,
          formData.status,
          formData.category,
          userId
        );
        setTasks([...tasks, newTask]);
      }

      setIsFormOpen(false);
      setFormData({
        title: "",
        desc: "",
        duedate: "",
        status: "New",
        category: "Work",
      });
      setSelectedTask(null);
      setError("");
    } catch (error) {
      console.error("Error adding/editing task:", error.message);
      setError("Error adding/editing task. Please try again.");
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      desc: task.description,
      duedate: task.duedate,
      status: task.status,
      category: task.category_name,
    });
    setIsFormOpen(true);
  };

  const handleDeleteTask = async () => {
    try {
      if (taskToDelete) {
        await deleteTask(taskToDelete.id);
        setTasks(tasks.filter((task) => task.id !== taskToDelete.id));
        setTaskToDelete(null);
        setShowDeleteModal(false);
      }
    } catch (error) {
      setError("Error deleting task. Please try again.");
    }
  };

  const personalTasks = tasks.filter(
    (task) => task.category_name === "Personal"
  );

  return (
    <div className="container mx-auto p-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Personal</h1>
        <button
          onClick={() => {
            setSelectedTask(null);
            setFormData({
              title: "",
              desc: "",
              duedate: "",
              status: "New",
              category: "Work",
            });
            setIsFormOpen(true);
          }}
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          + Add New Task
        </button>
      </div>

      {/* Display Personal Tasks */}
      {personalTasks.length === 0 ? (
        <p>No tasks</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-10 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Tasks</h2>
          <ul className="list-disc">
            {personalTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between mb-2"
              >
                <span className="flex items-center">
                  <Checkbox checked={task.status === "Completed"} />
                  <span className={`ml-2   `}>{task.title}</span>
                </span>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleEditTask(task)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => {
                      setTaskToDelete(task);
                      setShowDeleteModal(true);
                    }}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50"></div>
          <div className="bg-white p-6 rounded-lg shadow-md z-10">
            <p className="text-lg font-semibold mb-4">
              Are you sure you want to delete the task?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setTaskToDelete(null);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                No
              </button>
              <button
                onClick={handleDeleteTask}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Popup Form */}
      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <form onSubmit={handleFormSubmit}>
              <h2 className="text-lg font-medium mb-4">
                {selectedTask ? "Edit Task" : "Add Task"}
              </h2>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="title"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    error && formData.title.trim() === ""
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {error && formData.title.trim() === "" && (
                  <p className="text-red-500 text-xs italic">
                    Title is required.
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="desc"
                >
                  Description
                </label>
                <input
                  type="text"
                  id="desc"
                  name="desc"
                  value={formData.desc}
                  onChange={handleFormChange}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    error && formData.desc.trim() === "" ? "border-red-500" : ""
                  }`}
                />
                {error && formData.desc.trim() === "" && (
                  <p className="text-red-500 text-xs italic">
                    Description is required.
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="duedate"
                >
                  Due Date
                </label>
                <input
                  type="date"
                  id="duedate"
                  name="duedate"
                  value={formData.duedate}
                  onChange={handleFormChange}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    error && formData.duedate === "" ? "border-red-500" : ""
                  }`}
                />
                {error && formData.duedate === "" && (
                  <p className="text-red-500 text-xs italic">
                    Due Date is required.
                  </p>
                )}
                {error && formData.duedate < currentDate && (
                  <p className="text-red-500 text-xs italic">
                    Due Date cannot be earlier than the current date.
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="status"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="category"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {selectedTask ? "Update Task" : "Add Task"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Personal;
