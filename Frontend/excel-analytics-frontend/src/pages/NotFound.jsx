import React from 'react'
import { Link } from 'react-router-dom'


const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center font-sans bg-white dark:bg-black text-black dark:text-white px-4">

      <div className="flex items-center">

        <h1 className="text-4xl font-semibold border-r border-gray-300 dark:border-gray-600 pr-6 mr-6">404</h1>

        <div>
          <h2 className="text-lg font-normal">This page could not be found.</h2>
          <Link to="/" className="mt-6 inline-block text-blue-600 hover:underline">
            Return to Home
          </Link>



        </div>
      </div>
    </div>
  );
};

export default NotFound;
