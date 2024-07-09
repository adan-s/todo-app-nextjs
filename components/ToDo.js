"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Upcoming from './Upcoming'
import Today from './Today'
import {
  CalendarIcon,
  ClipboardCheckIcon,
  UserCircleIcon,
  BriefcaseIcon,
  LogoutIcon,
  CollectionIcon,
  DotsCircleHorizontalIcon,
  CheckIcon,
  InboxInIcon,
} from "@heroicons/react/outline";

const ToDo = () => {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentView, setCurrentView] = useState("upcoming");
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    duedate: "",
    status: "New",
    category: "Work",
  });

  const handleSignOut = (e) => {
    e.preventDefault();
    router.push("/SignIn");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    //logic to submit form data
    console.log(formData);
    setIsFormOpen(false);
  };

  return (
    <div className="container flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-6 flex flex-col">
        <div className="py-4">
          <h2 className="text-xl font-bold text-gray-800">TODO-Wise</h2>
        </div>
        <div className="mt-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-black mb-2 flex items-center">
              Tasks
            </h3>
            <ul>
            <li
                className={`py-2 ${
                  currentView === "upcoming" ? "font-bold" : ""
                }`}
                onClick={() => setCurrentView("upcoming")}
              >
                <a
                  href=""
                  className="text-black hover:text-orange-800 flex items-center"
                >
                  <InboxInIcon className="h-5 w-5 mr-2 text-gray-500" />
                  Upcoming
                </a>
              </li>
              <li
                className={`py-2 ${
                  currentView === "today" ? "font-bold" : ""
                }`}
                onClick={() => setCurrentView("today")}
              >
                <a
                  href="#"
                  className="text-black hover:text-orange-800 flex items-center"
                >
                  <CheckIcon className="h-5 w-5 mr-2 text-gray-500" />
                  Today
                </a>
              </li>
              <li className="py-2">
                <a
                  href="#"
                  className="text-black hover:text-orange-800 flex items-center"
                >
                  <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
                  Calendar
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-black mb-2 flex items-center">
              Categories
            </h3>
            <ul>
              <li className="py-2">
                <a
                  href="#"
                  className="text-black hover:text-green-700 flex items-center"
                >
                  <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-500" />
                  Work
                </a>
              </li>
              <li className="py-2">
                <a
                  href="#"
                  className="text-black hover:text-green-700 flex items-center"
                >
                  <UserCircleIcon className="h-5 w-5 mr-2 text-gray-500" />
                  Personal
                </a>
              </li>
              <li className="py-2">
                <a
                  href="#"
                  className="text-black hover:text-green-700 flex items-center"
                >
                  <DotsCircleHorizontalIcon className="h-5 w-5 mr-2 text-gray-500" />
                  Other
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-auto">
          <button
            onClick={handleSignOut}
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded w-full flex items-center justify-center mt-6"
          >
            <LogoutIcon className="h-5 w-5 mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Upcoming Area */}
        {currentView === 'upcoming' && (
        <Upcoming/>
        )}



       {/* Today Area */}
       {currentView === 'today' && (
        <Today/>
        )}


    

      {isFormOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
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
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="desc">
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
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duedate">
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
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
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
                    Add Task
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
  

export default ToDo;




