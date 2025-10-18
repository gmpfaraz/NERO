import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-secondary">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-100">
          Page Not Found
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block btn-primary"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

