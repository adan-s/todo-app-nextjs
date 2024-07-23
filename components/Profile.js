import React, { useState, useEffect } from "react";
import { getUser, updateUser } from "@/serverApi/userApi";

const Profile = () => {
  const userEmail = JSON.parse(localStorage.getItem("loggedInUser"));
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const User = await getUser(userEmail);
        setUser(User);
        setUpdatedUser({
          username: User.username,
          email: User.email,
          password: "",
        });
        console.log("userid:", User);
      } catch (error) {
        console.error("Error fetching User ID:", error);
        setError("Error fetching user ID. Please try again.");
      }
    };

    fetchUserId();
  }, [userEmail]);

  const handleEditClick = () => {
    setEditMode(true);
    setSuccess("");
    setError("");
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setUpdatedUser({
      username: user.username,
      email: user.email,
      password: "",
    });
    setSuccess("");
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^[a-zA-Z]+$/.test(updatedUser.username)) {
      setError("Username must contain alphabets.");
      return;
    }

    try {
      await updateUser(user.id, updatedUser);
      setEditMode(false);
      setError("");
      setSuccess("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user profile:", error);
      setSuccess("");
      setError("Error updating user profile. Please try again.");
    }
  };

  if (!user) {
    return <p className="text-red-500 mt-96 ml-96 p-2 pt-6 border border-red-500 rounded h-20 items-center justify-center">
      You are not Logged In. Kindly click on SignOut to redirect on SignIn Page.</p>;
  }

  return (
    <div className="container mx-auto p-10">
      <div className="flex items-center justify-center mb-2">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">User Profile</h1>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-10 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Profile Details
        </h2>
        {error && (
          <p className="text-red-500 mb-4 p-2 border border-red-500 rounded">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-500 mb-4 p-2 border border-green-500 rounded">
            {success}
          </p>
        )}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={updatedUser.username || ""}
            onChange={handleInputChange}
            disabled={!editMode}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={updatedUser.email || ""}
            disabled
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {editMode && (
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={updatedUser.password || ""}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        )}
        {!editMode ? (
          <>
            <button
              onClick={handleEditClick}
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Edit
            </button>
          </>
        ) : null}
        <div className="flex items-center justify-between">
          {editMode ? (
            <>
              <button
                onClick={handleSubmit}
                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-3 px-5 rounded"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-5 rounded"
              >
                Cancel
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Profile;
