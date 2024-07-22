import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ClubCard from './ClubCard';
import EventCard from './EventCard';
import ClubModal from './ClubModal';

const LandingPage = () => {
  const clubs = [
    { name: 'Knights Experimental Rocketry', logo: '/images/club-logos/kxr-logo.png', description: 'A club for experimental rocketry enthusiasts.' },
    { name: 'Knight Hacks', logo: '/images/club-logos/knightHacks-logo.png', description: 'A club for hackathon enthusiasts.' },
    { name: 'AI@UCF', logo: '/images/club-logos/aiUCF-logo.png', description: 'A club for AI enthusiasts.' },
  ];

  const events = [
    { name: 'UCF Football', date: '2023-05-01', image: '/images/events-images/ucfsports-image.jpg' },
    { name: 'UCF Baseball', date: '2023-05-15', image: '/images/events-images/ucfsports-image.jpg' },
    { name: 'UCF Basketball', date: '2023-05-30', image: '/images/events-images/ucfsports-image.jpg' },
  ];

  const [selectedClub, setSelectedClub] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">UCF</div>
          <nav>
            <Link to="/" className="mx-2 hover:text-gray-300">Home</Link>
            <Link to="/signup" className="mx-2 hover:text-gray-300">Sign-Up</Link>
            <Link to="/login" className="mx-2 hover:text-gray-300">Login</Link>
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
              Welcome to the UCF Club & Events Portal
            </h1>
            <p className="text-xl" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
              Explore. Connect. Engage.
            </p>
          </div>
        </section>
        <section className="container mx-auto py-12 px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Clubs</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {clubs.map((club, index) => (
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
          <h2 className="text-3xl font-bold mb-6 text-center">Upcoming Events</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <EventCard
                  key={index}
                  name={event.name}
                  date={event.date}
                  image={event.image}
                  className="transform transition-all duration-300 hover:scale-105 hover:border-4 hover:border-blue-500 hover:shadow-xl"
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
          showSignUp={true}  
        />
      )}
    </div>
  );
};

export default LandingPage;