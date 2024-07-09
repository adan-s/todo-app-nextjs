"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const SignUp = () => {
  const router = useRouter();

  const handleSignInClick = (e) => {
    e.preventDefault();
    router.push('/SignIn');
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
              <h2 className="text-4xl font-bold mb-6">Welcome to Your Ultimate To-Do List Manager!</h2>
              <p className="text-gray-600 mb-8">Are you tired of feeling overwhelmed by your daily tasks and projects? Say goodbye to chaos 
                and hello to productivity with our advanced 
                To-Do List Manager! Our platform is designed to help you organize, prioritize, and achieve your goals effortlessly.</p>
              <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-3 px-5 rounded mb-6">Get Started</button>
              <p className="text-gray-600 flex items-center justify-center">Already have an account? <a href="#" onClick={handleSignInClick} className="text-blue-600 hover:text-blue-800">Sign in</a></p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SignUp;
