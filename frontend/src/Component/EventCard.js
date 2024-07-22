import React, { useEffect } from 'react';
import { format, isValid } from 'date-fns';

const EventCard = ({ name, date, image, description, location, className, onRSVP, rsvpStatus, onDelete, isAdmin }) => {
  
  useEffect(() => {
    console.log(`EventCard Debug - Event: ${name}`);
    console.log(`isAdmin: ${isAdmin}`);
    console.log(`onDelete: ${onDelete ? 'Function exists' : 'Function does not exist'}`);
  }, [name, isAdmin, onDelete]);

  // Check if the date is valid
  const eventDate = new Date(date);
  const formattedDate = isValid(eventDate) ? format(eventDate, 'MMMM dd, yyyy') : 'Invalid date';
  const formattedTime = isValid(eventDate) ? format(eventDate, 'hh:mm a') : 'Invalid time';

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 text-center ${className}`}>
      <img src={image} alt={`${name} event`} className="w-full h-48 object-cover mb-4" />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-gray-600">{formattedDate} at {formattedTime}</p>
        {description && <p className="text-gray-600 mt-2">{description}</p>}
        {location && (
          <p className="text-gray-600 mt-2">
            {location.address ? location.address : ''}{location.city ? `, ${location.city}` : ''}{location.state ? `, ${location.state}` : ''}
          </p>
        )}
        {onRSVP && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRSVP();
            }}
            className={`mt-4 ${rsvpStatus ? 'bg-red-600' : 'bg-blue-600'} hover:bg-blue-600 text-white font-bold py-2 px-4 rounded`}
          >
            {rsvpStatus ? 'Un-RSVP' : 'RSVP'}
          </button>
        )}
        {isAdmin && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete Event
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;