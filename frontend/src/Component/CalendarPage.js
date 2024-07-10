import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CalendarPage = () => {
  const { user } = useContext(AuthContext);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedClub, setSelectedClub] = useState('All Clubs');

  const clubs = [
    { name: 'Knights Experimental Rocketry' },
    { name: 'Knight Hacks' },
    { name: 'AI@UCF' },
  ];

  const events = [
    { name: 'Knight Hacks GBM', date: '2023-05-01', description: 'General Body Meeting for Knight Hacks', location: 'Room 101', club: 'Knight Hacks' },
    { name: 'AI@UCF Workshop', date: '2023-05-03', description: 'AI Workshop', location: 'Room 202', club: 'AI@UCF' },
  ];

  const filteredEvents = selectedClub === 'All Clubs' ? events : events.filter(event => event.club === selectedClub);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">UCF Portal</div>
          <nav>
            <Link to="/dashboard" className="mx-2 hover:text-gray-300">Home</Link>
            <Link to="/clubs" className="mx-2 hover:text-gray-300">Clubs</Link>
            <Link to="/events" className="mx-2 hover:text-gray-300">Events</Link>
            <span className="mx-2">Hey, {user ? user.firstName : 'Guest'}</span>
          </nav>
        </div>
      </header>
      <main className="container mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Calendar</h2>
          <select
            value={selectedClub}
            onChange={(e) => setSelectedClub(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="All Clubs">All Clubs</option>
            {clubs.map((club, index) => (
              <option key={index} value={club.name}>{club.name}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-7 gap-4 mb-6">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 text-center">
              <h3 className="font-bold mb-2">{day}</h3>
              {filteredEvents.filter(event => new Date(event.date).getDay() === index + 1).map((event, idx) => (
                <div
                  key={idx}
                  className="bg-purple-500 text-white rounded-md p-2 mb-2 cursor-pointer"
                  onClick={() => handleEventClick(event)}
                >
                  {event.name}
                </div>
              ))}
            </div>
          ))}
        </div>
        {selectedEvent && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold mb-4">{selectedEvent.name}</h3>
            <p className="mb-4"><strong>Description:</strong> {selectedEvent.description}</p>
            <p className="mb-4"><strong>When:</strong> {selectedEvent.date}</p>
            <p className="mb-4"><strong>Where:</strong> {selectedEvent.location}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CalendarPage;