"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Upcoming from "./Upcoming";
import Today from "./Today";
import Work from "./Work";
import Personal from "./Personal";
import Other from "./Other";
import Profile from "./Profile";
import { getCategory } from "@/serverApi/categoryApi";
import {
  UserCircleIcon,
  BriefcaseIcon,
  LogoutIcon,
  DotsCircleHorizontalIcon,
  CheckIcon,
  InboxInIcon,
  UserIcon,
} from "@heroicons/react/outline";

const ToDo = () => {
  const router = useRouter();
  const [currentView, setCurrentView] = useState("upcoming");
  const [categories, setCategories] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getCategory();
      setCategories(result);
    };

    fetchCategories();
  }, []);

  const handleSignOut = () => {
    setIsLoggedIn(false);
    router.push('/SignIn');
  };

  if (isLoggedIn) {
    return null;
  }

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
                  currentView === "upcoming"
                    ? "font-bold text-orange-500"
                    : "text-black"
                }`}
                onClick={() => setCurrentView("upcoming")}
              >
                <a href="#" className="flex items-center">
                  <InboxInIcon
                    className={`h-5 w-5 mr-2 ${
                      currentView === "upcoming"
                        ? "text-orange-500"
                        : "text-gray-500"
                    }`}
                  />
                  Upcoming
                </a>
              </li>
              <li
                className={`py-2 ${
                  currentView === "today"
                    ? "font-bold text-orange-500"
                    : "text-black"
                }`}
                onClick={() => setCurrentView("today")}
              >
                <a href="#" className="flex items-center">
                  <CheckIcon
                    className={`h-5 w-5 mr-2 ${
                      currentView === "today"
                        ? "text-orange-500"
                        : "text-gray-500"
                    }`}
                  />
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
              {categories.map((category) => (
                <li
                  key={category.category_name}
                  className={`py-2 ${
                    currentView === category.category_name.toLowerCase()
                      ? "font-bold text-orange-500"
                      : "text-black"
                  }`}
                  onClick={() => setCurrentView(category.category_name.toLowerCase())}
                >
                  <a href="#" className="flex items-center">
                    {category.category_name === "Work" && (
                      <BriefcaseIcon
                        className={`h-5 w-5 mr-2 ${
                          currentView === "work"
                            ? "text-orange-500"
                            : "text-gray-500"
                        }`}
                      />
                    )}
                    {category.category_name === "Personal" && (
                      <UserCircleIcon
                        className={`h-5 w-5 mr-2 ${
                          currentView === "personal"
                            ? "text-orange-500"
                            : "text-gray-500"
                        }`}
                      />
                    )}
                    {category.category_name === "Other" && (
                      <DotsCircleHorizontalIcon
                        className={`h-5 w-5 mr-2 ${
                          currentView === "other"
                            ? "text-orange-500"
                            : "text-gray-500"
                        }`}
                      />
                    )}
                    {category.category_name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-black mb-2 flex items-center">
              Account
            </h3>
            <ul>
              <li
                className={`py-2 ${
                  currentView === "profile"
                    ? "font-bold text-orange-500"
                    : "text-black"
                }`}
                onClick={() => setCurrentView("profile")}
              >
                <a href="#" className="flex items-center">
                  <UserIcon
                    className={`h-5 w-5 mr-2 ${
                      currentView === "profile"
                        ? "text-orange-500"
                        : "text-gray-500"
                    }`}
                  />
                  Profile
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
      {currentView === "upcoming" && <Upcoming />}

      {/* Today Area */}
      {currentView === "today" && <Today />}

      {/* Work Area */}
      {currentView === "work" && <Work />}

      {/* Personal Area */}
      {currentView === "personal" && <Personal />}

      {/* Other Area */}
      {currentView === "other" && <Other />}

      {/* Profile Area */}
      {currentView === "profile" && <Profile />}
    </div>
  );
};

export default ToDo;
