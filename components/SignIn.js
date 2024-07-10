"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline'; 
import { getUsers } from '@/serverApi/userApi';

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getUsers();
        console.log("Fetched users: ", result);
        setUsers(result);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('loggedInUser', JSON.stringify(email));
      router.push('/ToDo');
    } else {
      localStorage.removeItem('loggedInUser');
    }
  }, [isLoggedIn, email]);

  const handleSignUpClick = (e) => {
    e.preventDefault();
    router.push('/SignUp');
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    const user = users.find(user => user.email === email);
    
    if (!user) {
      setError("User doesn't exist");
      return;
    }
    
    if (user.password !== password) {
      setError("Wrong password");
      return;
    }
    
    setIsLoggedIn(true);
  };

  const clearError = () => {
    setError('');
  };

  if (isLoggedIn) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="container mx-auto p-4 md:p-6 lg:p-12">
        <main className="flex flex-col items-center justify-center w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl">
            <div className="bg-white rounded-lg shadow-lg p-10 flex flex-col justify-center">
              <h2 className="text-4xl font-bold mb-6">Welcome to Your Ultimate To-Do List Manager!</h2>

              <form onSubmit={handleSignIn}>
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
                <div className="mb-6 relative">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-3 px-5 rounded w-full mb-6"
                >
                  Login
                </button>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded" role="alert">
                  <p>{error}</p>
                  <button onClick={clearError} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                    <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>}
              </form>

              <p className="text-gray-600 flex items-center justify-center">
                Don't have an account?{' '}
                <a href="#" onClick={handleSignUpClick} className="text-blue-600 hover:text-blue-800">
                  SignUp
                </a>
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img src="/images/home-icon.jpg" alt="Organic Mind" className="w-full h-96 object-cover" />
              <p className="text-center my-6 text-3xl text-orange-500 font-bold py-4">TODO-WISE</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SignIn;
