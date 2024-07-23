import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-toastify';
import EventCard from './EventCard'; 

const CalendarPage = () => {
  const { user, logout } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedClub, setSelectedClub] = useState('All Clubs');
  const [userEvents, setUserEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [clubs, setClubs] = useState([]); 
  const navigate = useNavigate(); // Define navigate

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (event.target.closest('.dropdown') === null) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/'); // Use navigate
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return; 
    try {
      const userEventsResponse = await axios.get(`/api/v1/users/${user._id}/events`);
      setUserEvents(userEventsResponse.data);

      const clubsResponse = await axios.post('/api/v1/clubs/viewMyClubs', { userId: user._id });
      setClubs(clubsResponse.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Error fetching user data', { toastId: 'fetchUserDataError' });
    }
  };

  // Ensure the events have a 'clubId' field and filter accordingly
  const filteredEvents = selectedClub === 'All Clubs' ? userEvents : userEvents.filter(event => {
    const club = clubs.find(club => club._id === event.clubId);
    return club && club.name === selectedClub;
  });

  // Debugging logs
  console.log('Selected Club:', selectedClub);
  console.log('User Events:', userEvents);
  console.log('Filtered Events:', filteredEvents);

  const renderHeader = () => {
    const dateFormat = 'MMMM yyyy';

    return (
      <div className="flex justify-between items-center mb-6">
        <div>
          <button onClick={prevMonth} className="w-full bg-darkGold hover:bg-darkYellow text-gray-800 font-bold py-2 px-4 rounded border border-black">&lt;</button>
          <span className="mx-2 font-bold">{format(currentMonth, dateFormat)}</span>
          <button onClick={nextMonth} className="w-full bg-darkGold hover:bg-darkYellow text-gray-800 font-bold py-2 px-4 rounded border border-black">&gt;</button>
        </div>
        <div className="flex items-center">
          <label htmlFor="clubFilter" className="mr-2 text-gray-700">Filter by Club:</label> {/* Added label */}
          <select
            id="clubFilter" // Added id for accessibility
            value={selectedClub}
            onChange={(e) => setSelectedClub(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="All Clubs">All Clubs</option>
            {Array.isArray(clubs) && clubs.map((club, index) => (
              <option key={index} value={club.name}>{club.name}</option>
            ))}
          </select>
        </div>
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
            className={`p-4 text-center cursor-pointer border border-gray-200 ${!isSameMonth(day, monthStart) ? 'bg-gray-100' : ''}`} // Removed hover effects
            key={day}
            onClick={() => handleDayClick(cloneDay)}
          >
            <div className={`text-lg font-bold ${isSameDay(day, new Date()) ? 'text-blue-600' : ''}`}>
              {formattedDate}
            </div>
            {Array.isArray(filteredEvents) && filteredEvents.filter(event => isSameDay(new Date(event.date), day)).map((event, idx) => {
              const club = clubs.find(club => club._id === event.clubId);
              return (
                <div
                  key={idx}
                  className="w-full bg-darkGold hover:bg-darkYellow text-gray-800 font-bold py-2 px-4 rounded border border-black mt-1 cursor-pointer text-xs flex items-center transform transition-all duration-300" // Updated styles
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEvent(event);
                  }}
                >
                  {club && club.clubInfo && <img src={club.clubInfo.logo} alt="logo" className="w-4 h-4 mr-1" />}
                  <span className="ml-1">{event.Ename}</span> {/* Display event title using Ename */}
                </div>
              );
            })}
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
    const eventsOnDay = Array.isArray(filteredEvents) ? filteredEvents.filter(event => isSameDay(new Date(event.date), day)) : [];
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
          <nav className="flex items-center relative">
            <Link to="/dashboard" className="mx-2 hover:text-gray-300">Home</Link>
            <Link to="/clubs" className="mx-2 hover:text-gray-300">Clubs</Link>
            <Link to="/events" className="mx-2 hover:text-gray-300">Events</Link>
            <div className="dropdown relative mx-2">
              <span onClick={toggleDropdown} className="cursor-pointer">Hey, {user ? user.name : 'Guest'}</span>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-gray-800 hover:bg-red-600 hover:text-white w-full text-left"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
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
              name={selectedEvent.Ename}
              date={selectedEvent.date}
              image={selectedEvent.image}
              description={selectedEvent.description}
              location={selectedEvent.location}
              eventDetail={selectedEvent.eventDetail}
              className="mx-auto max-w-xs"
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default CalendarPage;