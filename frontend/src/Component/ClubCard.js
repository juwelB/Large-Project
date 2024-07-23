import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ClubCard = ({ name, logo, description, onClick, onCreateEvent, adminId }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full">
      <div>
        <img src={logo} alt={`${name} logo`} className="w-24 h-24 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">{name}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
      </div>
      <div className="mt-auto">
        <button
          onClick={onClick}
          className="w-full bg-darkGold hover:bg-darkYellow text-gray-800 font-bold py-2 px-4 rounded border border-black mb-2"
        >
          View Club
        </button>
        {user && user._id === adminId && (
          <button
            onClick={onCreateEvent}
            className="w-full bg-darkGold hover:bg-darkYellow text-gray-800 font-bold py-2 px-4 rounded border border-black"
          >
            Create Event
          </button>
        )}
      </div>
    </div>
  );
};

export default ClubCard;