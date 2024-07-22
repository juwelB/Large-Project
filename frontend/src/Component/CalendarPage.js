import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import axios from 'axios';
import EventCard from './EventCard'; // Import EventCard component

const CalendarPage = () => {
  const { user } = useContext(AuthContext);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedClub, setSelectedClub] = useState('All Clubs');
  const [userEvents, setUserEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (user) {
      axios.get(`/api/users/${user._id}/events`)
        .then(response => setUserEvents(response.data))
        .catch(error => console.error('Error fetching user events:', error));
    }
  }, [user]);

  const filteredEvents = selectedClub === 'All Clubs' ? userEvents : userEvents.filter(event => event.club === selectedClub);

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
            className={`p-2 text-center cursor-pointer border border-gray-200 ${!isSameMonth(day, monthStart) ? 'bg-gray-100' : ''}`}
            key={day}
            onClick={() => handleDayClick(cloneDay)}
          >
            <div className={`text-sm font-bold ${isSameDay(day, new Date()) ? 'text-blue-600' : ''}`}>
              {formattedDate}
            </div>
            {filteredEvents.filter(event => isSameDay(new Date(event.date), day)).map((event, idx) => (
              <div
                key={idx}
                className="bg-purple-500 text-white rounded-md p-1 mt-1 cursor-pointer text-xs"
                onClick={() => setSelectedEvent(event)}
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

  const handleDayClick = (day) => {
    const eventsOnDay = filteredEvents.filter(event => isSameDay(new Date(event.date), day));
    if (eventsOnDay.length > 0) {
      setSelectedEvent(eventsOnDay[0]);
    } else {
      setSelectedEvent(null);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
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
          <div className="mt-8">
            <EventCard
              name={selectedEvent.name}
              date={selectedEvent.date}
              image={selectedEvent.image}
              description={selectedEvent.description}
              location={selectedEvent.location}
              eventDetail={selectedEvent.eventDetail}
              className="mx-auto"
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default CalendarPage;