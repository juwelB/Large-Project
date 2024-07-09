import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LandingPage() {
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch clubs
    axios.get('/api/v1/clubs')
      .then(response => {
        setClubs(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the clubs!', error);
      });

    // Fetch events
    axios.get('/api/v1/events')
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the events!', error);
      });
  }, []);

  return (
    <div className="landing-page">
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <img src="/path/to/logo.png" alt="Logo" className="h-12" />
        <nav>
          <a href="/signup" className="mx-2 text-black">Sign-Up</a>
          <a href="/login" className="mx-2 text-black">Login</a>
        </nav>
      </header>
      <section className="text-center bg-cover bg-center text-white py-20" style={{ backgroundImage: 'url(/path/to/hero-image.jpg)' }}>
        <h1 className="text-4xl font-bold">Welcome to the Knights Events & Clubs Portal</h1>
        <p className="text-xl mt-4">Explore. Connect. Engage.</p>
      </section>
      <section className="p-8">
        <h2 className="text-2xl font-bold mb-4">Our Clubs</h2>
        <div className="flex flex-wrap justify-around">
          {clubs.map(club => (
            <div key={club._id} className="bg-gray-100 p-4 m-2 rounded-lg text-center w-48">
              <img src={club.logoUrl} alt={club.name} className="w-full h-32 object-cover rounded-lg" />
              <p className="mt-2">{club.name}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="p-8">
        <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
        <div className="flex flex-wrap justify-around">
          {events.map(event => (
            <div key={event._id} className="bg-gray-100 p-4 m-2 rounded-lg text-center w-48">
              <p>{event.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default LandingPage;