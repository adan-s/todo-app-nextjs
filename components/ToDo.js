"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Upcoming from './Upcoming'
import Today from './Today'
import {
  UserCircleIcon,
  BriefcaseIcon,
  LogoutIcon,
  DotsCircleHorizontalIcon,
  CheckIcon,
  InboxInIcon,
} from "@heroicons/react/outline";
import Work from "./Work";
import Personal from "./Personal";
import Other from "./Other";

const ToDo = () => {
  const router = useRouter();
  const [currentView, setCurrentView] = useState("upcoming");

  const handleSignOut = (e) => {
    e.preventDefault();
    router.push("/SignIn");
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
                href="#"
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
            
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-black mb-2 flex items-center">
              Categories
            </h3>
            <ul>
              <li   className={`py-2 ${
                  currentView === "work" ? "font-bold" : ""
                }`}
                onClick={() => setCurrentView("work")}>
                <a
                href="#"
                  className="text-black hover:text-orange-700 flex items-center"
                >
                  <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-500" />
                  Work
                </a>
              </li>
              <li className={`py-2 ${
                  currentView === "personal" ? "font-bold" : ""
                }`}
                onClick={() => setCurrentView("personal")}>
                <a
                href="#"
                  className="text-black hover:text-orange-700 flex items-center"
                >
                  <UserCircleIcon className="h-5 w-5 mr-2 text-gray-500" />
                  Personal
                </a>
              </li>
              <li className={`py-2 ${
                  currentView === "other" ? "font-bold" : ""
                }`}
                onClick={() => setCurrentView("other")}>
                <a
                href="#"
                  className="text-black hover:text-orange-700 flex items-center"
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

        {/* Work Area */}
        {currentView === 'work' && (
        <Work/>
        )}

       {/* Personal Area */}
       {currentView === 'personal' && (
        <Personal/>
        )}

          {/* Other Area */}
       {currentView === 'other' && (
        <Other/>
        )}


    
    </div>
  );
};
  

export default ToDo;




