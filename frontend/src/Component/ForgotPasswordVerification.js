import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ForgotPasswordVerification = () => {
  const location = useLocation();
  const { email } = location.state || {};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
        <p className="mb-4">We just sent a password reset email to</p>
        <p className="font-semibold mb-4">{email}</p>
        <p className="mb-6 text-sm">
          Just click on the link in the email to reset your password. If you don't see it, you may need to check your spam folder.
        </p>
        <Link 
          to="/login" 
          className="text-blue-600 hover:underline text-sm"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordVerification;