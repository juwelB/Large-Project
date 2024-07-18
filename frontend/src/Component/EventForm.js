import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EventForm = ({ isOpen, onClose, clubId }) => {
  const [Ename, setEname] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [eventDetail, setEventDetail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/events/createEvent', {
        Ename,
        date,
        location: { address: location },
        eventDetail: [{ describe: eventDetail }],
        clubId
      });
      toast.success('Event created successfully');
      onClose();
    } catch (error) {
      toast.error('Error creating event');
      console.error('Error creating event:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Create Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="Ename" className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
            <input
              type="text"
              id="Ename"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={Ename}
              onChange={(e) => setEname(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              id="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              id="location"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="eventDetail" className="block text-sm font-medium text-gray-700 mb-1">Event Detail</label>
            <input
              type="text"
              id="eventDetail"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={eventDetail}
              onChange={(e) => setEventDetail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gold hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
            style={{ backgroundColor: '#FFD700' }}
          >
            Create Event
          </button>
        </form>
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

export default EventForm;