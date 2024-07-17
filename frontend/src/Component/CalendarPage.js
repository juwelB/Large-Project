import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import axios from 'axios';
import EventModal from './EventModal';

const CalendarPage = () => {
  const { user } = useContext(AuthContext);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedClub, setSelectedClub] = useState('All Clubs');
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const clubs = [
    { name: 'Knights Experimental Rocketry' },
    { name: 'Knight Hacks' },
    { name: 'AI@UCF' },
  ];

  useEffect(() => {
    // Fetch events from backend
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/v1/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = selectedClub === 'All Clubs' ? events : events.filter(event => event.club === selectedClub);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedEvent(null); // Clear selected event if needed
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setSelectedDate(null); // Clear selected date if needed
  };

  const handleFormSubmit = async (eventData) => {
    const eventToAdd = {
      ...eventData,
      date: selectedDate,
    };
    try {
      const response = await axios.post('/api/v1/events/createevent', eventToAdd);
      setEvents([...events, response.data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding event:', error);
    }
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
        <button 
          onClick={() => setIsModalOpen(true)}
          className="ml-auto bg-yellow-600 text-white font-bold py-2 px-4 rounded"
        >
          Add Event
        </button>
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
            className={`p-2 text-center cursor-pointer ${!isSameMonth(day, monthStart) ? 'text-gray-400' : ''} 
              ${isSameDay(day, new Date()) ? 'bg-blue-200' : ''} 
              ${selectedDate && isSameDay(day, selectedDate) ? 'bg-gray-300' : ''} 
              hover:bg-gray-200`}
            key={day}
            onClick={() => handleDateClick(cloneDay)}
          >
            <span>{formattedDate}</span>
            {filteredEvents.filter(event => isSameDay(new Date(event.date), day)).map((event, idx) => (
              <div
                key={idx}
                className="bg-purple-500 text-white rounded-md p-1 mt-1 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering date click
                  handleEventClick(event);
                }}
              >
                {event.Ename}
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
            <span className="mx-2">Hey, {user ? user.firstName : 'Guest'}</span>
          </nav>
        </div>
      </header>
      <main className="container mx-auto py-12 px-4">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
        {selectedEvent && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            {selectedDate && (
              <p className="mb-4"><strong>Date Selected:</strong> {format(selectedDate, 'MMMM d, yyyy')}</p>
            )}
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
        {isModalOpen && (
          <EventModal
            clubs={clubs}
            selectedDate={selectedDate}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleFormSubmit}
          />
        )}
      </main>
    </div>
  );
};
// TESTING
export default CalendarPage;
