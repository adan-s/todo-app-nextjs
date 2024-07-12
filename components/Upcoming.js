import React, { useState, useEffect } from "react";
import { addTask, updateTask, getUserTasks, deleteTask } from "@/serverApi/taskApi";
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const currentDate = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await findUser(userEmail);
        setUserId(id);
      } catch (error) {
        setError("Error fetching user ID. Please try again.");
      }
    };

    fetchUserId();
  }, [userEmail]);

  useEffect(() => {
    const fetchTasks = async () => {

      try {
        const fetchedTasks = await getUserTasks(userId);
        setTasks(fetchedTasks || []);
      } catch (error) {
        setError("Error fetching tasks. Please try again.");
      }
    };

    fetchTasks();
  }, [userId]);

  const tasksToday = tasks.filter(task => task.duedate.split('T')[0] === currentDate);
  const tasksTomorrow = tasks.filter(task => task.duedate.split('T')[0] === tomorrowDate);
  const tasksUpcoming = tasks.filter(task => task.duedate.split('T')[0] > tomorrowDate);
  const tasksPast = tasks.filter(task => task.duedate.split('T')[0] < currentDate);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Basic validation checks
    if (formData.title.trim() === "" || formData.desc.trim() === "" || formData.duedate === "") {
      setError("All fields are required.");
      return;
    }

    if (formData.duedate < currentDate) {
      setError("Due date cannot be earlier than the current date.");
      return;
    }

    try {
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
        setTasks(tasks.filter(task => task.id !== taskToDelete.id));
        setTaskToDelete(null);
        setShowDeleteModal(false);
      }
    } catch (error) {
      setError("Error deleting task. Please try again.");
    }
  };

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
      <div className="bg-white rounded-lg shadow-md p-10 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Today</h2>
        {tasksToday.length === 0 ? (
          <p>No tasks for today</p>
        ) : (
          <ul className="list-disc">
            {tasksToday.map((task) => (
              <li key={task.id} className="flex items-center justify-between mb-2">
                <span className="flex items-center">
                  <span>{task.title}</span>
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
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-10 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Tomorrow</h2>
        {tasksTomorrow.length === 0 ? (
          <p>No tasks for tomorrow</p>
        ) : (
          <ul className="list-disc">
            {tasksTomorrow.map((task) => (
              <li key={task.id} className="flex items-center justify-between mb-2">
                <span className="flex items-center">
                  <span>{task.title}</span>
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
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-10 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming</h2>
        {tasksUpcoming.length === 0 ? (
          <p>No upcoming tasks</p>
        ) : (
          <ul className="list-disc">
            {tasksUpcoming.map((task) => (
              <li key={task.id} className="flex items-center justify-between mb-2">
                <span className="flex items-center">
                  <span>{task.title}</span>
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
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-10 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Past</h2>
        {tasksPast.length === 0 ? (
          <p>No past tasks</p>
        ) : (
          <ul className="list-disc">
            {tasksPast.map((task) => (
              <li key={task.id} className="flex items-center justify-between mb-2">
                <span className="flex items-center">
                  <span>{task.title}</span>
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
        )}
      </div>


      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50"></div>
          <div className="bg-white p-6 rounded-lg shadow-md z-10">
            <p className="text-lg font-semibold mb-4">Are you sure you want to delete the task?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setTaskToDelete(null);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTask}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <form onSubmit={handleFormSubmit}>
              <h2 className="text-lg font-medium mb-4">
                {selectedTask ? "Edit Task" : "Add Task"}
              </h2>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  name="desc"
                  value={formData.desc}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  name="duedate"
                  value={formData.duedate}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Status
                </label>
                <select
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
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Category
                </label>
                <select
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

export default Upcoming;
