import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClubCard from './ClubCard';
import EventCard from './EventCard';
import ClubModal from './ClubModal';
import { AuthContext } from '../context/AuthContext';

const LoggedInLandingPage = () => {
  const { user } = useContext(AuthContext);
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch clubs from the backend API
    const fetchClubs = async () => {
      try {
        const response = await fetch(`/api/v1/clubs/user/${user?.id}`); // Adjust the URL to your API endpoint
        const data = await response.json();
        setClubs(data);
      } catch (error) {
        console.error('Error fetching clubs:', error);
      }
    };

    // Fetch events from the backend API
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events'); // Adjust the URL to your API endpoint
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    if (user) {
      fetchClubs();
      fetchEvents();
    }
  }, [user]);

  const handleJoinClub = (club) => {
    // Logic to join the club
    console.log(`Joining club: ${club.name}`);
  };

  const handleRSVPEvent = (event) => {
    // Logic to RSVP for the event
    console.log(`RSVPing for event: ${event.name}`);
  };

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">UCF Portal</div>
          <nav>
            <Link to="/calendar" className="mx-2 hover:text-gray-300">Calendar</Link>
            <Link to="/clubs" className="mx-2 hover:text-gray-300">Clubs</Link>
            <Link to="/events" className="mx-2 hover:text-gray-300">Events</Link>
            <span className="mx-2">Hey, {user ? user.name : 'Guest'}</span>
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
                style={{ color: 'black', backgroundColor: 'white' }} // css for text search input
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
                  logo={club.logo}
                  description={club.description}
                  className="transform transition-all duration-300 hover:scale-105 hover:border-4 hover:border-blue-500 hover:shadow-xl"
                  onClick={() => setSelectedClub(club)}
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
                  name={event.name}
                  date={event.date}
                  image={event.image}
                  description={event.description}
                  location={event.location}
                  className="transform transition-all duration-300 hover:scale-105 hover:border-4 hover:border-blue-500 hover:shadow-xl"
                  onRSVP={() => handleRSVPEvent(event)}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      {selectedClub && (
        <ClubModal
          club={selectedClub}
          onClose={() => setSelectedClub(null)}
          onJoin={handleJoinClub}
        />
      )}
    </div>
  );
};

export default LoggedInLandingPage;