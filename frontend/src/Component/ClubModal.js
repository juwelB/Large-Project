import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ClubModal = ({ club, onClose, onJoin, onLeave }) => {
  const { user } = useContext(AuthContext);

  const handleJoinClick = () => {
    if (user && user.id) {
        console.log('User ID:', user.id); // Debugging
        onJoin(club._id.toString(), user.id.toString());
        onClose();
    } else {
        console.error('User ID not available');
        // Optionally, show an error message to the user
    }
  };

  const handleLeaveClick = () => {
    if (user && user.id) {
        console.log('User ID:', user.id); // Debugging
        onLeave(club._id.toString(), user.id.toString());
        onClose();
    } else {
        console.error('User ID not available');
        // Optionally, show an error message to the user
    }
  };

  const isMember = user && club.memberList.includes(user.id);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">{club.name}</h2>
        <img src={`../../..${club.clubInfo.logo}`} alt={`${club.name} logo`} className="w-24 h-24 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">{club.description}</p>
        {user ? (
          isMember ? (
            <button
              onClick={handleLeaveClick}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Leave Club
            </button>
          ) : (
            <button
              onClick={handleJoinClick}
              className="w-full bg-gold hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
              style={{ backgroundColor: '#FFD700' }}
            >
              Join Club
            </button>
          )
        ) : (
          <>
            <p className="text-gray-600 mb-4">Sign up to join this club and participate in its activities.</p>
            <Link
              to="/signup"
              className="w-full bg-gold hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded block text-center"
              style={{ backgroundColor: '#FFD700' }}
            >
              Sign Up to Join
            </Link>
            <Link
              to="/"
              className="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded block text-center"
            >
              Back to Home
            </Link>
          </>
        )}
        <button
          onClick={onClose}
          className="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ClubModal;