"use client"

import React, { useState } from "react";

const Upcoming = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    duedate: "",
    status: "New",
    category: "Work",
  });
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
    <div className="container mx-auto p-10">
<div className="flex items-center justify-between mb-2">
  <h1 className="text-3xl font-bold text-gray-800 mb-6">Upcoming</h1>
  <button
    onClick={() => setIsFormOpen(true)}
    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline "
  >
    + Add New Task
  </button>
</div>

{/* Today's Tasks */}
<div className="bg-white rounded-lg shadow-md p-10 mb-6" >
  <h2 className="text-xl font-bold text-gray-800 mb-4">Today</h2>
  <ul className="list-disc">
    <li className="flex items-center justify-between mb-2">
      <span className="flex items-center">
        <input type="checkbox" className="mr-2" />
        <span>Research content ideas</span>
      </span>
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </li>
    <li className="flex items-center justify-between mb-2">
      <span className="flex items-center">
        <input type="checkbox" className="mr-2" />
        <span>Create a database of guest authors</span>
      </span>
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </li>
    <li className="flex items-center justify-between mb-2">
      <span className="flex items-center">
        <input type="checkbox" className="mr-2" />
        <span>Renew driver's license</span>
      </span>
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </li>
    <li className="flex items-center justify-between mb-2">
      <span className="flex items-center">
        <input type="checkbox" className="mr-2" />
        <span>Consult accountant</span>
      </span>
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </li>
  </ul>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Tomorrow's Tasks */}
  <div className="bg-white rounded-lg shadow-md p-4">
    <h2 className="text-xl font-bold text-gray-800 mb-4">Tomorrow</h2>
    <ul className="list-disc">
      <li className="flex items-center justify-between mb-2">
        <span className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span>Create job posting for SEO specialist</span>
        </span>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </li>
      <li className="flex items-center justify-between mb-2">
        <span className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span>Follow up with pending emails</span>
        </span>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </li>
      <li className="flex items-center justify-between mb-2">
        <span className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span>Write blog post on AI trends</span>
        </span>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </li>
      <li className="flex items-center justify-between mb-2">
        <span className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span>Prepare slides for presentation</span>
        </span>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </li>
    </ul>
  </div>

  {/* This Week's Tasks */}
  <div className="bg-white rounded-lg shadow-md p-4">
    <h2 className="text-xl font-bold text-gray-800 mb-4">This Week</h2>
    <ul className="list-disc">
      <li className="flex items-center justify-between mb-2">
        <span className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span>Research content ideas</span>
        </span>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </li>
      <li className="flex items-center justify-between mb-2">
        <span className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span>Create a database of guest authors</span>
        </span>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </li>
      <li className="flex items-center justify-between mb-2">
        <span className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span>Renew driver's license</span>
        </span>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </li>
      <li className="flex items-center justify-between mb-2">
        <span className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span>Consult accountant</span>
        </span>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </li>
    </ul>
  </div>
</div>

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
)}

export default Upcoming;