const Today = () => {
  return (
    <div className="container mx-auto p-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Today</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline "
        >
          + Add New Task
        </button>
      </div>

      {/* Today's Tasks */}
      <div className="bg-white rounded-lg shadow-md p-10 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Today</h2>
        <ul className="list-disc">
          <li className="flex items-center justify-between mb-2">
            <span className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Research content ideas</span>
            </span>
            <svg
              className="w-6 h-6"
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
          <li className="flex items-center justify-between mb-2">
            <span className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Create a database of guest authors</span>
            </span>
            <svg
              className="w-6 h-6"
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
          <li className="flex items-center justify-between mb-2">
            <span className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Renew driver's license</span>
            </span>
            <svg
              className="w-6 h-6"
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
          <li className="flex items-center justify-between mb-2">
            <span className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Consult accountant</span>
            </span>
            <svg
              className="w-6 h-6"
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
        </ul>
      </div>
    </div>
  );
};

export default Today;