import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';

const CalendarPage = () => {
  const { user } = useContext(AuthContext);
  const [currentMonth, setCurrentMonth] = useState(new Date());
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

  const renderHeader = () => {
    const dateFormat = 'MMMM yyyy';

    return (
      <div className="flex justify-between items-center mb-6">
        <div>
          <button onClick={prevMonth} className="text-gray-600 hover:text-gray-800">&lt;</button>
          <span className="mx-2 font-bold">{format(currentMonth, dateFormat)}</span>
          <button onClick={nextMonth} className="text-gray-600 hover:text-gray-800">&gt;</button>
        </div>
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
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = 'EEEE';

    let startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-center font-bold" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="grid grid-cols-7 mb-4">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = 'd';
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={`p-2 text-center ${!isSameMonth(day, monthStart) ? 'text-gray-400' : ''} ${isSameDay(day, new Date()) ? 'bg-blue-200' : ''}`}
            key={day}
            onClick={() => handleEventClick(cloneDay)}
          >
            <span>{formattedDate}</span>
            {filteredEvents.filter(event => isSameDay(new Date(event.date), day)).map((event, idx) => (
              <div
                key={idx}
                className="bg-purple-500 text-white rounded-md p-1 mt-1 cursor-pointer"
                onClick={() => handleEventClick(event)}
              >
                {event.name}
              </div>
            ))}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day}>
          {days}
        </div>
      );
      days = [];
    }

    return <div>{rows}</div>;
  };

  const nextMonth = () => {
    setCurrentMonth(addDays(currentMonth, 30));
  };

  const prevMonth = () => {
    setCurrentMonth(addDays(currentMonth, -30));
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
            <span className="mx-2">Hey, {user ? user.name : 'Guest'}</span>
          </nav>
        </div>
      </header>
      <main className="container mx-auto py-12 px-4">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
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
      </main>
    </div>
  );
};

export default CalendarPage;