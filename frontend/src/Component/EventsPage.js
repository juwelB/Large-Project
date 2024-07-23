import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import EventCard from './EventCard';
import { toast } from 'react-toastify';

const EventList = () => {
  const { user, logout } = useContext(AuthContext); // Add logout
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Add state for dropdown
  const navigate = useNavigate(); 

  // Add toggleDropdown and handleClickOutside functions
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
    navigate('/');
  };

  const [rsvpedEvents, setRsvpedEvents] = useState([]);
  const [clubEvents, setClubEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [adminStatus, setAdminStatus] = useState({}); 

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    if (!user) return; 
    try {
      const userEventsResponse = await axios.get(`/api/v1/users/${user._id}/events`);
      setRsvpedEvents(userEventsResponse.data);

      const clubsResponse = await axios.post('/api/v1/clubs/viewMyClubs', { userId: user._id });
      const userClubs = clubsResponse.data;

      let allClubEvents = [];
      let adminStatusTemp = {};
      for (const club of userClubs) {
        if (!club._id) continue; 
        const clubEventsResponse = await axios.get(`/api/v1/clubs/${club._id}/events`);
        const clubEvents = clubEventsResponse.data;
        allClubEvents = allClubEvents.concat(clubEvents);

        adminStatusTemp[club._id] = club.adminId === user._id;
      }

      setAdminStatus(adminStatusTemp);
      const nonRsvpedClubEvents = allClubEvents.filter(event => !userEventsResponse.data.some(rsvpEvent => rsvpEvent._id === event._id));
      setClubEvents(nonRsvpedClubEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleUnRSVP = async (eventId) => {
    try {
      await axios.post(`/api/v1/events/unjoinEvent/${eventId}`, { userId: user._id });
      setRsvpedEvents(rsvpedEvents.filter(event => event._id !== eventId));
      toast.success('Successfully Un-RSVP\'d from Event');
      fetchEvents(); // Re-fetch events after un-RSVPing
    } catch (error) {
      console.error('Error unRSVPing from event:', error);
      toast.error('Error Un-RSVPing from event: ' + (error.response ? error.response.data : error.message));
    }
  };

  const handleRSVP = async (eventId) => {
    try {
      await axios.post(`/api/v1/events/joinEvent/${eventId}`, { userId: user._id });
      setRsvpedEvents([...rsvpedEvents, { _id: eventId }]);
      toast.success('Successfully RSVP\'d to Event');
      fetchEvents(); // Re-fetch events after RSVPing
    } catch (error) {
      console.error('Error RSVPing to event:', error);
      toast.error('Error RSVPing to event: ' + (error.response ? error.response.data : error.message));
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if(window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`/api/v1/events/deleteEvent/${eventId}`);
        fetchEvents();
        toast.success('Successfully Deleted Event');
      } catch (error) {
        console.error('Error deleting event:', error.response ? error.response.data : error.message);
        toast.error('Error deleting event: ' + (error.response ? error.response.data : error.message));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">UCF Portal</div>
          <nav className="flex items-center relative">
            <Link to="/calendar" className="mx-2 hover:text-gray-300">Calendar</Link>
            <Link to="/dashboard" className="mx-2 hover:text-gray-300">Home</Link>
            <Link to="/clubs" className="mx-2 hover:text-gray-300">Clubs</Link>
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
        <h2 className="text-3xl font-bold mb-6">Your RSVP'ed Events</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {rsvpedEvents.length > 0 ? (
            rsvpedEvents.map((event, index) => (
              <EventCard
                key={index}
                name={event.Ename}
                date={event.date}
                image={event.image}
                description={Array.isArray(event.eventDetail) ? event.eventDetail.map(detail => detail.describe).join(', ') : ''}
                location={event.location}
                onRSVP={() => handleUnRSVP(event._id)}
                rsvpStatus={true}
                onDelete={() => handleDeleteEvent(event._id)}
                isAdmin={adminStatus[event.clubId]} // Use the admin status from state
                className="mb-4 p-2 text-sm transform transition-all duration-300 hover:scale-105 hover:border-4 hover:border-darkGold hover:shadow-xl" // Add hover effects
              />
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full">No RSVP'ed events found.</p>
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
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {clubEvents.length > 0 ? (
            clubEvents.map((event, index) => (
              <EventCard
                key={index}
                name={event.Ename}
                date={event.date}
                image={event.image}
                description={Array.isArray(event.eventDetail) ? event.eventDetail.map(detail => detail.describe).join(', ') : ''}
                location={event.location}
                onRSVP={() => handleRSVP(event._id)}
                rsvpStatus={false}
                onDelete={() => handleDeleteEvent(event._id)}
                isAdmin={adminStatus[event.clubId]} 
                className="mb-4 p-2 text-sm transform transition-all duration-300 hover:scale-105 hover:border-4 hover:border-darkGold hover:shadow-xl" // Add hover effects
              />
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full">No events found for your clubs.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default EventList;