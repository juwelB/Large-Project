import React from 'react';
import { Link } from 'react-router-dom';

const ClubModal = ({ club, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{club.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <img src={club.logo} alt={`${club.name} logo`} className="w-24 h-24 mx-auto mb-4" />
        <p className="text-gray-600 mb-6">
          {club.description || "No description available."}
        </p>
        <Link 
          to="/signup" 
          className="block w-full bg-gold hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded text-center"
        >
          Sign Up To Join!
        </Link>
        <button 
          onClick={onClose}
          className="mt-4 block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded text-center"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ClubModal;