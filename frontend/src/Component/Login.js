import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://ucf-club-and-event-manager-1c53fb944ab8.herokuapp.com/api/v1/users/login', {
        email,
        password
      });
      if (response.status === 201) {
        login(response.data);
        navigate('/');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Login</h2>
          <Link to="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Student Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter Student Email Here"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter Password Here"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 text-right">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot Password?</Link>
          </div>
          <button
            type="submit"
            className="w-full bg-gold hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
            style={{ backgroundColor: '#FFD700' }}
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/signup" className="text-sm text-blue-600 hover:underline">Don't Have An Account?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;