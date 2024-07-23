import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEmailTouched, setIsEmailTouched] = useState('');
  const [isPasswordTouched, setIsPasswordTouched] = useState('');
  const [isPasswordTwoTouched, setIsPasswordTwoTouched] = useState('');
  const [isUsernameTouched, setIsUsernameTouched] = useState('');
  const [isFirstnameTouched, setIsFirstnameTouched] = useState('');
  const [isLastnameTouched, setIsLastnameTouched] = useState('');

  let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // requirements fields
  const [passwordRequirements, setPasswordRequirements] = useState({
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    minLength: false,
  });
  const [isPasswordFocused, setIsPasswordFocused] = useState(false); // ui focus of passowrd

  // regex for password
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
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (
      !passwordRequirements.hasLowercase ||
      !passwordRequirements.hasUppercase ||
      !passwordRequirements.hasNumber ||
      !passwordRequirements.hasSpecialChar ||
      !passwordRequirements.minLength
    ) {
      toast.error("Password must contain at least 1 lowercase, 1 uppercase, 1 number, 1 special character, and be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('https://ucf-club-and-event-manager-1c53fb944ab8.herokuapp.com/api/v1/users/register', {
        email,
        password,
        userName,
        firstName,
        lastName
      });
      if (response.status === 201) {
        login(response.data);
        navigate('/verify-email', { state: { email: email } });
      }
    } catch (error) {
      console.error('Error during registration:', error);
      if (error.response && error.response.data && error.response.data.message) {
        if (error.response.data.message === 'Email already in use') {
          toast.error('Email already in use');
        } else if (error.response.data.message === 'Username already in use') {
          toast.error('Username already in use');
        } else {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error('Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(emailRegex.test(value));
    setIsEmailTouched(true);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    checkPasswordRequirements(value);
    setIsPasswordTouched(true);
  };



  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Sign Up</h2>
          <Link to="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className = "relative">
              <input 
                type="email"
                id="email"
                className={`w-full px-3 py-2 border rounded-md ${isEmailTouched && isEmailValid ? 'border-green-500' : (isEmailTouched && !isEmailValid ? 'border-red-500' : 'border-gray-300')}`}
                placeholder="Enter Email Here"
                value={email}
                onChange = {handleEmailChange}
                onFocus={() => {setIsEmailTouched(true); setIsPasswordFocused(false);}}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`w-full px-3 py-2 border rounded-md ${isPasswordTouched && Object.values(passwordRequirements).every(Boolean) ? 'border-green-500' : (isPasswordTouched && !Object.values(passwordRequirements).every(Boolean) ? 'border-red-500' : 'border-gray-300')}`}
                placeholder="Enter Password Here"
                value={password}
                onChange = {handlePasswordChange}
                onFocus={() => {setIsPasswordTouched(true); setIsPasswordFocused(true);}}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
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
                className={`w-full px-3 py-2 border rounded-md ${isPasswordTwoTouched && confirmPassword === password ? 'border-green-500' : (isPasswordTwoTouched && confirmPassword !== password? 'border-red-500' : 'border-gray-300')}`}
                placeholder="Confirm Password Here"
                value={confirmPassword}
                onChange={(e) => {setConfirmPassword(e.target.value); setIsPasswordTwoTouched(true);}}
                onFocus={() => {setIsPasswordFocused(false); setIsPasswordTwoTouched(true);}}
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
          <div className="mb-4">
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              id="userName"
              className={`w-full px-3 py-2 border rounded-md ${isUsernameTouched && userName.length > 0 ? 'border-green-500' : (isUsernameTouched && userName.length === 0 ? 'border-red-500' : 'border-gray-300')}`}
              placeholder="Enter Username Here"
              value={userName}
              onChange={(e) => {setIsUsernameTouched(true); setUserName(e.target.value);}}
              onFocus={() => {setIsPasswordFocused(false); setIsUsernameTouched(true);}}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              id="firstName"
              className={`w-full px-3 py-2 border rounded-md ${isFirstnameTouched && firstName.length > 0 ? 'border-green-500' : (isFirstnameTouched && firstName.length === 0 ? 'border-red-500' : 'border-gray-300')}`}
              placeholder="Enter First Name Here"
              value={firstName}
              onChange={(e) => {setFirstName(e.target.value); setIsFirstnameTouched(true);}}
              onFocus={() => {setIsPasswordFocused(false); setIsFirstnameTouched(true);}}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              id="lastName"
              className={`w-full px-3 py-2 border rounded-md ${isLastnameTouched && lastName.length > 0 ? 'border-green-500' : (isLastnameTouched && lastName.length === 0 ? 'border-red-500' : 'border-gray-300')}`}
              placeholder="Enter Last Name Here"
              value={lastName}
              onChange={(e) => {setLastName(e.target.value); setIsLastnameTouched(true);}}
              onFocus={() => {setIsPasswordFocused(false); setIsLastnameTouched(true);}}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-darkGold hover:bg-darkYellow text-gray-800 font-bold py-2 px-4 rounded border border-black"
            disabled={isLoading}
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/login" className="text-sm text-blue-600 hover:underline">
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;