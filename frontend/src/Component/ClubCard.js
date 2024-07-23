import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import EditModal from './EditModal';

const ClubCard = ({ name, logo, description, onClick, onCreateEvent, adminId, clubId, refetchClubs }) => {
  console.log(clubId);
  const { user } = useContext(AuthContext);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
  };

  const handleEditSave = (updatedClub) => {
    // Handle the updated club data (e.g., update the state or re-fetch the club list)
    console.log('Club updated:', updatedClub);
    // Optionally, update the state or re-fetch the club list here
  };

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
          <>
            <button
              onClick={onCreateEvent}
              className="w-full bg-darkGold hover:bg-darkYellow text-gray-800 font-bold py-2 px-4 rounded border border-black mb-2"
            >
              Create Event
            </button>
            <button
              onClick={handleEditClick}
              className="w-full bg-darkGold hover:bg-darkYellow text-gray-800 font-bold py-2 px-4 rounded border border-black"
            >
              Edit Club
            </button>
          </>
        )}
      </div>
      <EditModal
        clubId={clubId}
        isOpen={isEditModalOpen}
        onClose={handleEditClose}
        onSave={handleEditSave}
        refetchClubs={refetchClubs}
      />
    </div>
  );
};

export default ClubCard;