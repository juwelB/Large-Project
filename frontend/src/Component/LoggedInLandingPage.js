import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ClubCard from './ClubCard';
import EventCard from './EventCard';
import ClubModal from './ClubModal';
import EventForm from './EventForm';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoggedInLandingPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [rsvpedEvents, setRsvpedEvents] = useState([]);

  const fetchClubsAndEvents = async () => {
    if (!user) return; // Ensure user is defined before making API calls
    try {
      const clubsResponse = await fetch('/api/v1/clubs/viewAllClubs');
      if (!clubsResponse.ok) {
        throw new Error('Failed to fetch clubs');
      }
      const clubsData = await clubsResponse.json();
      setClubs(clubsData);

      const publicClubResponse = await fetch('/api/v1/clubs/viewPublicClubEvents');
      if (!publicClubResponse.ok) {
        throw new Error('Failed to fetch public club events');
      }
      const publicClubEvents = await publicClubResponse.json();
      if (Array.isArray(publicClubEvents)) {
        setEvents(publicClubEvents);
      } else {
        console.error('Expected an array of events');
      }

      const userRsvpsResponse = await axios.get(`/api/v1/events/userRsvps/${user._id}`);
      setRsvpedEvents(userRsvpsResponse.data);
    } catch (error) {
      console.error('Error fetching clubs and events:', error);
    }
  };

  useEffect(() => {
    fetchClubsAndEvents();
  }, [user]); // Ensure fetchClubsAndEvents is called when user changes

  const handleJoinClub = async (clubId, userId) => {
    try {
      await axios.post('/api/v1/clubs/joinClub', {
        userId: userId,
        clubId: clubId
      });
      console.log(`Joined club: ${clubId}`);
      // Refetch clubs and events to update the UI
      fetchClubsAndEvents();
      //toast.success('Successfully Joined Club', { toastId: 'joinClubSuccess' });
    } catch (error) {
      console.error('Error joining club:', error.response ? error.response.data : error.message);
      toast.error('Error joining club: ' + (error.response ? error.response.data : error.message), { toastId: 'joinClubError' });
    }
  };

  const handleLeaveClub = async (clubId, userId) => {
    try {
      await axios.post('/api/v1/clubs/leaveClub', {
        userObjId: userId,
        clubObjId: clubId
      });
      console.log(`Left club: ${clubId}`);
      fetchClubsAndEvents();
    } catch (error) {
      console.error('Error leaving club:', error.response ? error.response.data : error.message);
      toast.error('Error leaving club: ' + (error.response ? error.response.data : error.message), { toastId: 'leaveClubError' });
    }
  };

  const handleDeleteClub = async (clubId) => {
    try {
      await axios.delete('/api/v1/clubs/deleteclub', { data: { clubId } });
      console.log(`Deleted club: ${clubId}`);
      fetchClubsAndEvents();
      toast.success('Successfully Deleted Club', { toastId: 'deleteClubSuccess' });
    } catch (error) {
      console.error('Error deleting club:', error.response ? error.response.data : error.message);
      toast.error('Error deleting club: ' + (error.response ? error.response.data : error.message), { toastId: 'deleteClubError' });
    }
  };

  const handleCreateEvent = (clubId) => {
    setSelectedClub(clubId);
    setIsEventModalOpen(true);
  };

  const handleRSVPEvent = async (eventId) => {
    try {
      await axios.post(`/api/v1/events/joinEvent/${eventId}`, { userId: user._id });
      console.log(`RSVP'd to event: ${eventId}`);
      fetchClubsAndEvents();
      toast.success('Successfully RSVP\'d to Event', { toastId: 'rsvpEventSuccess' });
    } catch (error) {
      console.error('Error RSVPing to event:', error.response ? error.response.data : error.message);
      toast.error('Error RSVPing to event: ' + (error.response ? error.response.data : error.message), { toastId: 'rsvpEventError' });
    }
  };

  const handleUnRSVPEvent = async (eventId) => {
    try {
      await axios.post(`/api/v1/events/unjoinEvent/${eventId}`, { userId: user._id });
      console.log(`Un-RSVP'd from event: ${eventId}`);
      fetchClubsAndEvents();
      toast.success('Successfully Un-RSVP\'d from Event', { toastId: 'unrsvpEventSuccess' });
    } catch (error) {
      console.error('Error Un-RSVPing from event:', error.response ? error.response.data : error.message);
      toast.error('Error Un-RSVPing from event: ' + (error.response ? error.response.data : error.message), { toastId: 'unrsvpEventError' });
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`/api/v1/events/deleteEvent/${eventId}`);
      fetchClubsAndEvents();
      toast.success('Successfully Deleted Event', { toastId: 'deleteEventSuccess' });
    } catch (error) {
      console.error('Error deleting event:', error.response ? error.response.data : error.message);
      toast.error('Error deleting event: ' + (error.response ? error.response.data : error.message), { toastId: 'deleteEventError' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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

  const handleCloseEventForm = () => {
    setIsEventModalOpen(false);
    setSelectedClub(null);
  };

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">UCF Portal</div>
          <nav className="flex items-center relative">
            <Link to="/calendar" className="mx-2 hover:text-gray-300">Calendar</Link>
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
      <main>
        <section
          className="bg-cover bg-center h-96 flex items-center justify-center text-white relative"
          style={{ backgroundImage: "url('/images/LPBackground.png')" }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="text-center relative z-10">
            <h1 className="text-4xl font-bold mb-4" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
              Welcome to the Knights Events & Clubs Portal
            </h1>
            <p className="text-xl" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
              Explore. Connect. Engage.
            </p>
            <div className="mt-6">
              <input
                type="text"
                placeholder="Enter Your Search Here"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                style={{ color: 'black', backgroundColor: 'white' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </section>
        <section className="container mx-auto py-12 px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Discover Clubs</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredClubs.map((club, index) => (
                <ClubCard
                  key={index}
                  name={club.name}
                  logo={club.clubInfo.logo}
                  description={club.clubInfo.description}
                  className="transform transition-all duration-300 hover:scale-105 hover:border-4 hover:border-darkGold hover:shadow-xl"
                  onClick={() => setSelectedClub(club)}
                  onCreateEvent={() => handleCreateEvent(club._id)}
                  adminId={club.adminId}
                  clubId={club._id}
                  refetchClubs={fetchClubsAndEvents}
                />
              ))}
            </div>
          </div>
        </section>
        <section className="container mx-auto py-12 px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Upcoming UCF Events</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <EventCard
                  key={index}
                  name={event.Ename}
                  date={event.date}
                  image={event.image}
                  description={event.eventDetail.map(detail => detail.describe).join(', ')}
                  location={event.location}
                  className="transform transition-all duration-300 hover:scale-105 hover:border-4 hover:border-darkGold hover:shadow-xl"
                  onRSVP={() => rsvpedEvents.includes(event._id) ? handleUnRSVPEvent(event._id) : handleRSVPEvent(event._id)}
                  rsvpStatus={rsvpedEvents.includes(event._id)}
                  onDelete={() => handleDeleteEvent(event._id)}
                  isAdmin={user?.adminOf?.includes(event.clubId)} 
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      {selectedClub && !isEventModalOpen && ( 
        <ClubModal
          club={selectedClub}
          onClose={() => setSelectedClub(null)}
          onJoin={handleJoinClub}
          onLeave={handleLeaveClub}
          onDelete={handleDeleteClub}
        />
      )}
      {isEventModalOpen && (
        <EventForm
          isOpen={isEventModalOpen}
          onClose={handleCloseEventForm}
          clubId={selectedClub}
          onCreate={handleCreateEvent}
        />
      )}
    </div>
  );
};

export default LoggedInLandingPage;