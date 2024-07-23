import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EventForm = ({ isOpen, onClose, clubId }) => {
  const [Ename, setEname] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [eventDetail, setEventDetail] = useState([{ topic: '', describe: '' }]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Combine date and time into a single DateTime value
      const dateTime = new Date(`${date}T${time}`);
      console.log(dateTime);

      const response = await axios.post('/api/v1/events/createEvent', {
        Ename,
        date: dateTime, // Use the combined DateTime value
        location,
        eventDetail,
        clubId
      });
      toast.success('Event created successfully', { toastId: 'eventCreated' });
      
      setEname('');
      setDate('');
      setTime('');
      setLocation('');
      setEventDetail([{ topic: '', describe: '' }]);
      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Error creating event: ' + (error.response ? error.response.data.message : error.message), { toastId: 'eventCreationError' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
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
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="time"
              id="time"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={time}
              onChange={(e) => setTime(e.target.value)}
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
            <label htmlFor="eventDetail" className="block text-sm font-medium text-gray-700 mb-1">Event Details</label>
            {eventDetail.map((detail, index) => (
              <div key={index} className="mb-2">
                <input
                  type="text"
                  placeholder="Topic"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-1"
                  value={detail.topic}
                  onChange={(e) => {
                    const newEventDetail = [...eventDetail];
                    newEventDetail[index].topic = e.target.value;
                    setEventDetail(newEventDetail);
                  }}
                />
                <input
                  type="text"
                  placeholder="Description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={detail.describe}
                  onChange={(e) => {
                    const newEventDetail = [...eventDetail];
                    newEventDetail[index].describe = e.target.value;
                    setEventDetail(newEventDetail);
                  }}
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Event
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EventForm;