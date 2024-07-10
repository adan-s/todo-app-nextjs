import React, { useState, useEffect } from "react";
import { getTasks, addTask, updateTask } from "@/serverApi/taskApi";
import { findUser } from "@/serverApi/userApi";

const Upcoming = () => {
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
      try {
        const fetchedTasks = await getTasks();
        setTasks(fetchedTasks || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Error fetching tasks. Please try again.");
      }
    };

    fetchTasks();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

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
        setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));

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

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Upcoming</h1>
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

      {/* Display Tasks */}
      {tasks.length === 0 ? (
        <p>No tasks</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-10 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Today</h2>
          <ul className="list-disc">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between mb-2"
              >
                <span className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>{task.title}</span>
                </span>
                <svg
                  onClick={() => handleEditTask(task)}
                  className="w-6 h-6 cursor-pointer"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Popup Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
              {selectedTask ? "Edit Task" : "Add New Task"}
            </h2>
            <form onSubmit={handleFormSubmit}>
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
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
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
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
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
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="status"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="New">New</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Finished">Finished</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="category"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                  {selectedTask ? "Save Changes" : "Add Task"}
                </button>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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

export default Upcoming;