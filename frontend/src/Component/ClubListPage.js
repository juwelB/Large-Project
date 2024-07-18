import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { AuthContext } from '../context/AuthContext';
import ClubCard from './ClubCard';
import ClubModal from './ClubModal';

const ClubListPage = () => {
  const { user } = useContext(AuthContext);
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Fetch clubs from the backend API
    const fetchClubs = async () => {
      try {
        const response = await fetch('/api/clubs'); // Adjust the URL to your API endpoint
        const data = await response.json();
        setClubs(data);
      } catch (error) {
        console.error('Error fetching clubs:', error);
      }
    };

    fetchClubs();
  }, []);

  const handleJoinClub = (club) => {
    // Logic to join the club
    console.log(`Joining club: ${club.name}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">UCF Portal</div>
          <nav>
            <span className="mx-2">Hey, {user ? user.name : 'Guest'}</span>
            {/* Add other navigation links if needed */}
          </nav>
        </div>
      </header>
      <main>
        <section className="container mx-auto py-12 px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Discover Clubs</h2>
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
          <div className="text-center mt-8">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => navigate('/create-club')}
            >
              Create Your Own Club
            </button>
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

export default ClubListPage;