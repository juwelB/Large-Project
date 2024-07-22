import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { userId, token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordRequirements, setPasswordRequirements] = useState({
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    minLength: false,
  });
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRegex = {
    hasLowercase: /[a-z]/,
    hasUppercase: /[A-Z]/,
    hasNumber: /\d/,
    hasSpecialChar: /[@$!%*?&]/,
    minLength: /.{8,}/,
  };

  const checkPasswordRequirements = (password) => {
    setPasswordRequirements({
      hasLowercase: passwordRegex.hasLowercase.test(password),
      hasUppercase: passwordRegex.hasUppercase.test(password),
      hasNumber: passwordRegex.hasNumber.test(password),
      hasSpecialChar: passwordRegex.hasSpecialChar.test(password),
      minLength: passwordRegex.minLength.test(password),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (
      !passwordRequirements.hasLowercase ||
      !passwordRequirements.hasUppercase ||
      !passwordRequirements.hasNumber ||
      !passwordRequirements.hasSpecialChar ||
      !passwordRequirements.minLength
    ) {
      toast.error('Password must contain at least 1 lowercase, 1 uppercase, 1 number, 1 special character, and be at least 8 characters long');
      return;
    }

    try {
      const response = await axios.post(`/api/v1/users/${userId}/resetpassword/${token}`, { newPassword });
      if (response.status === 200) {
        toast.success('Password reset successfully');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Password reset failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter New Password Here"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  checkPasswordRequirements(e.target.value);
                }}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? "Hide" : "Show"}
              </button>
            </div>
            {isPasswordFocused && (
              <div className="text-sm mt-1 text-gray-700">
                <p>Password must contain:</p>
                <ul>
                  <li className={passwordRequirements.hasLowercase ? 'text-green-600' : 'text-red-600'}>At least 1 lowercase letter</li>
                  <li className={passwordRequirements.hasUppercase ? 'text-green-600' : 'text-red-600'}>At least 1 uppercase letter</li>
                  <li className={passwordRequirements.hasNumber ? 'text-green-600' : 'text-red-600'}>At least 1 number</li>
                  <li className={passwordRequirements.hasSpecialChar ? 'text-green-600' : 'text-red-600'}>At least 1 special character (@$!%*?&)</li>
                  <li className={passwordRequirements.minLength ? 'text-green-600' : 'text-red-600'}>At least 8 characters long</li>
                </ul>
              </div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Confirm Password Here"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gold hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
            style={{ backgroundColor: '#FFD700' }}
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;