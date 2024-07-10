// profile.js

import React, { useState, useEffect } from 'react';
import { getUsers, updateUser } from '@/serverApi/userApi';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const users = await getUsers();
        // Assuming you have a way to identify the currently logged-in user, for example, based on session or token
        // Here, we assume the first user in the fetched users array is the logged-in user
        setUser(users[0]); 
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error fetching user data. Please try again.');
      }
    };

    fetchUserData();
  }, []);

  const handleEditClick = () => {
    setEditMode(true);
    // Initialize updatedUser state with current user data for editing
    setUpdatedUser({
      username: user.username,
      email: user.email,
      password: '',
    });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setUpdatedUser({});
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateUser(user.id, updatedUser); 
      setEditMode(false);
      setError('');
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating user profile:', error);
      setError('Error updating user profile. Please try again.');
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex items-center justify-center">
      <div className="container mx-auto p-4 md:p-6 lg:p-12">
        <main className="flex flex-col items-center justify-center w-full">
          <div className="bg-white rounded-lg shadow-lg p-10 w-94">
            <h2 className="text-4xl font-bold mb-6">User Profile</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={updatedUser.username || ''}
                onChange={handleInputChange}
                disabled={!editMode}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={updatedUser.email || ''}
                onChange={handleInputChange}
                disabled={!editMode}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {editMode && (
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={updatedUser.password || ''}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            )}
            <div className="flex items-center justify-between">
              {!editMode ? (
                <button
                  onClick={handleEditClick}
                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-3 px-5 rounded"
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSubmit}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-5 rounded"
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
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
