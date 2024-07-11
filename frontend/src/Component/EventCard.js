import React from 'react';

const EventCard = ({ name, date, image, description, location, className, onRSVP }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 text-center ${className}`}>
      <img src={image} alt={`${name} event`} className="w-full h-48 object-cover mb-4" />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-gray-600">{date}</p>
        {description && <p className="text-gray-600 mt-2">{description}</p>}
        {location && <p className="text-gray-600 mt-2">{location}</p>}
        {onRSVP && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRSVP();
            }}
            className="mt-4 bg-gold hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
            style={{ backgroundColor: '#FFD700' }}
          >
            RSVP
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;