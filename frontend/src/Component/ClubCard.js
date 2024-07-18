// holy fuck
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ClubCard = ({ name, logo, description, onClick, onCreateEvent, adminId }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
      <img src={logo} alt={`${name} logo`} className="w-24 h-24 mx-auto mb-4" />
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <button
        onClick={onClick}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-2"
      >
        View Club
      </button>
      {user && user._id === adminId && (
        <button
          onClick={() => onCreateEvent(adminId)}
          className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Create Event
        </button>
      )}
    </div>
  );
};

export default ClubCard;