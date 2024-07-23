import React from 'react';
import { Link } from 'react-router-dom';

const EmailVerified = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold mb-6">Email Verified</h2>
        <p className="mb-4">Your email has been successfully verified.</p>
        <Link 
          to="/login" 
          className="mt-4 bg-gold hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
          style={{ backgroundColor: '#FFD700' }}
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default EmailVerified;