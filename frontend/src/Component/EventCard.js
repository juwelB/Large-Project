import React from 'react';

const EventCard = ({ name, date, image, className }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 text-center ${className}`}>
      <img src={image} alt={`${name} event`} className="w-full h-48 object-cover mb-4" />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-gray-600">{date}</p>
      </div>
    </div>
  );
};

export default EventCard;