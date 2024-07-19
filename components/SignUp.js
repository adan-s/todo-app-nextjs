"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addUser, getUser } from '@/serverApi/userApi';

const SignUp = () => {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignInClick = (e) => {
    e.preventDefault();
    router.push('/SignIn');
  };

  const handleGetStartedClick = () => {
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!validateUsername(username)) {
      setError('Username should not contain numbers.');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be between 8 to 15 characters and include numbers.');
      return;
    }


    try {
      const existingUser = await getUser(email);
      
      if (existingUser.email!=false) {
        setError('An account with this email already exists.');
        return;
      }
      
      console.log("new user details:",{username,email,password});

      const newUser = await addUser(username, email, password);

      console.log('User added successfully:', newUser);
      setSuccess('User signed up successfully!');
      setError('');
      setTimeout(() => {
        router.push('/ToDo');
      }, 2000);
    } catch (error) {
      console.error('Error adding user:', error);
      setError('Error signing up. Please try again.');
      setSuccess('');
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateUsername = (username) => {
    const regex = /\d/;
    return !regex.test(username);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{8,15})$/;
    return regex.test(password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="container mx-auto p-4 md:p-6 lg:p-12">
        <main className="flex flex-col items-center justify-center w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img src="/images/home-icon.jpg" alt="Organic Mind" className="w-full h-96 object-cover" />
              <p className="text-center my-6 text-3xl text-orange-500 font-bold py-4">TODO-WISE</p>
            </div>
         
            <div className="bg-white rounded-lg shadow-lg p-10 flex flex-col justify-center">
              {showForm ? (
                <form onSubmit={handleSubmit}>
                  <h2 className="text-4xl font-bold mb-6">Sign Up</h2>
                  {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded" role="alert">
                    <p>{error}</p>
                  </div>}
                  {success && 
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-4 rounded" role="alert" >
                    <p className='successMsg' role='successMsg'>{success}</p>
                  </div>}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="mb-6 relative">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-3 px-5 rounded w-full mb-6"
                  >
                    Sign Up
                  </button>
                  
                  <p className="text-gray-600 flex items-center justify-center">
                    Already have an account?{' '}
                    <a href="#" onClick={handleSignInClick} className="text-blue-600 hover:text-blue-800">
                      Sign in
                    </a>
                  </p>
                </form>
                
              ) : (
                <>
                  <h2 className="text-4xl font-bold mb-6">Welcome to Your Ultimate To-Do List Manager!</h2>
                  <p className="text-gray-600 mb-8">
                    Are you tired of feeling overwhelmed by your daily tasks and projects? Say goodbye to chaos 
                    and hello to productivity with our advanced 
                    To-Do List Manager! Our platform is designed to help you organize, prioritize, and achieve your goals effortlessly.
                  </p>
                  <button
                    onClick={handleGetStartedClick}
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-3 px-5 rounded mb-6"
                  >
                    Get Started
                  </button>
                  <p className="text-gray-600 flex items-center justify-center">
                    Already have an account?{' '}
                    <a href="#" onClick={handleSignInClick} className="text-blue-600 hover:text-blue-800">
                      Sign in
                    </a>
                  </p>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SignUp;
