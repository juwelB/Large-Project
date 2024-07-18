import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const EventList = () => {
  const { user } = useContext(AuthContext);
  const [rsvpedEvents, setRsvpedEvents] = useState([]);
  const [clubEvents, setClubEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      const response = await axios.post('/api/v1/events/userEvents', { userId: user._id });
      const { rsvpedEvents, clubEvents } = response.data;
      setRsvpedEvents(rsvpedEvents);
      setClubEvents(clubEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleUnRSVP = async (eventId) => {
    try {
      await axios.post(`/api/v1/events/unjoinEvent/${eventId}`, { userId: user._id });
      setRsvpedEvents(rsvpedEvents.filter(event => event._id !== eventId));
    } catch (error) {
      console.error('Error unRSVPing from event:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">UCF Portal</div>
          <nav>
            <Link to="/calendar" className="mx-2 hover:text-gray-300">Calendar</Link>
            <Link to="/dashboard" className="mx-2 hover:text-gray-300">Home</Link>
            <Link to="/clubs" className="mx-2 hover:text-gray-300">Clubs</Link>
            <span className="mx-2">Hey, {user ? user.name : 'Guest'}</span>
          </nav>
        </div>
      </header>
      <main className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold mb-6">Your RSVP'ed Events</h2>
        <div className="max-w-4xl mx-auto">
          {rsvpedEvents.length > 0 ? (
            rsvpedEvents.map((event, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 mb-4 flex justify-between items-center">
                <div className="flex items-center">
                  <img src={event.logo} alt={`${event.name} logo`} className="w-12 h-12 mr-4" />
                  <div>
                    <h3 className="text-xl font-semibold">{event.name}</h3>
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      ...
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleUnRSVP(event._id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  UnRSVP
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No RSVP'ed events found.</p>
          )}
        </div>
        {selectedEvent && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h3 className="text-2xl font-bold mb-4">{selectedEvent.name}</h3>
            <p className="mb-4"><strong>Description:</strong> {selectedEvent.description}</p>
            <p className="mb-4"><strong>When:</strong> {selectedEvent.date}</p>
            <p className="mb-4"><strong>Where:</strong> {selectedEvent.location}</p>
            <button
              onClick={() => setSelectedEvent(null)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        )}
        <h2 className="text-3xl font-bold mb-6 mt-12">Discover Your Club Events</h2>
        <div className="max-w-4xl mx-auto">
          {clubEvents.length > 0 ? (
            clubEvents.map((event, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 mb-4 flex justify-between items-center">
                <div className="flex items-center">
                  <img src={event.logo} alt={`${event.name} logo`} className="w-12 h-12 mr-4" />
                  <div>
                    <h3 className="text-xl font-semibold">{event.name}</h3>
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      ...
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No events found for your clubs.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default EventList;