import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ClubModal = ({ club, onClose, onJoin, onLeave, onDelete, showSignUp }) => {
  const { user } = useContext(AuthContext);

  const handleJoinClick = async () => {
    if (user && user.id) {
        console.log('User ID:', user.id); // Debugging
        await onJoin(club._id.toString(), user.id.toString());
        toast.success('Successfully Joined Club');
        onClose();
    } else {
        console.error('User ID not available');
    }
  };

  const handleLeaveClick = async () => {
    if (user && user.id) {
        console.log('User ID:', user.id); // Debugging
        await onLeave(club._id.toString(), user.id.toString());
        toast.success('Successfully Left Club');
        onClose();
    } else {
        console.error('User ID not available');
    }
  };

  const handleDeleteClick = async () => {
    if (user && user.id) {
        console.log('User ID:', user.id); // Debugging
        await onDelete(club._id.toString());
        toast.success('Successfully Deleted Club');
        onClose();
    } else {
        console.error('User ID not available');
    }
  };

  const isMember = user && Array.isArray(club.memberList) && club.memberList.includes(user.id);
  const isAdmin = user && club.adminId === user.id;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">{club.name}</h2>
        {club.clubInfo && (
          <img src={`../../..${club.clubInfo.logo}`} alt={`${club.name} logo`} className="w-24 h-24 mx-auto mb-4" />
        )}
        <p className="text-gray-600 mb-4">{club.description}</p>
        {showSignUp ? (
          <>
            <p className="text-gray-600 mb-4">Sign up to join this club and participate in its activities.</p>
            <Link
              to="/signup"
              className="w-full bg-darkGold hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded block text-center"
            >
              Sign Up to Join
            </Link>
          </>
        ) : (
          user ? (
            isAdmin ? (
              <button
                onClick={handleDeleteClick}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Delete Club
              </button>
            ) : isMember ? (
              <button
                onClick={handleLeaveClick}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Leave Club
              </button>
            ) : (
              <button
                onClick={handleJoinClick}
                className="w-full bg-darkGold hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
              >
                Join Club
              </button>
            )
          ) : (
            <>
              <p className="text-gray-600 mb-4">Sign up to join this club and participate in its activities.</p>
              <Link
                to="/signup"
                className="w-full bg-darkGold hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded block text-center"
              >
                Sign Up to Join
              </Link>
              <Link
                to="/"
                className="w-full mt-4 bg-darkGray hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded block text-center"
              >
                Back to Home
              </Link>
            </>
          )
        )}
        <button
          onClick={onClose}
          className="w-full mt-4 bg-darkGray hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ClubModal;