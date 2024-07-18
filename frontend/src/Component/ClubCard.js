import React from 'react';

const ClubCard = ({ name, logo, description, className, onClick, onJoin }) => {
  return (
    <div onClick={onClick} className={`bg-white rounded-lg shadow-md p-6 text-center border border-transparent transition-all duration-300 ${className}`}>
      <img src={`/images/${logo}`} alt={`${name} logo`} className="w-24 h-24 mx-auto mb-4" />
      <h3 className="text-xl font-semibold">{name}</h3>
      {description && <p className="text-gray-600 mt-2">{description}</p>}
      {onJoin && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onJoin();
          }}
          className="mt-4 bg-gold hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
          style={{ backgroundColor: '#FFD700' }}
        >
          Join Club
        </button>
      )}
    </div>
  );
};

export default ClubCard;