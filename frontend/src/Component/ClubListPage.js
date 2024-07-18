import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ClubCard from './ClubCard';
import ClubModal from './ClubModal';
import Modal from './Modal';
import ClubForm from './ClubForm';

const ClubListPage = () => {
  const { user } = useContext(AuthContext);
  const [userClubs, setUserClubs] = useState([]);
  const [adminClubs, setAdminClubs] = useState([]);
  const [discoverClubs, setDiscoverClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user's clubs from the backend API
    const fetchUserClubs = async () => {
      try {
        const response = await fetch('/api/v1/clubs/viewMyClubs'); // Adjust the URL to your API endpoint
        const data = await response.json();
        setUserClubs(data.filter(club => !user.adminOf.includes(club._id)));
        setAdminClubs(data.filter(club => user.adminOf.includes(club._id)));
      } catch (error) {
        console.error('Error fetching user clubs:', error);
      }
    };

    // Fetch discover clubs from the backend API
    const fetchDiscoverClubs = async () => {
      try {
        const response = await fetch('/api/v1/clubs/viewAllClubs?limit=6'); // Adjust the URL to your API endpoint
        const data = await response.json();
        setDiscoverClubs(data);
      } catch (error) {
        console.error('Error fetching discover clubs:', error);
      }
    };

    fetchUserClubs();
    fetchDiscoverClubs();
  }, [user]);

  const handleJoinClub = (club) => {
    console.log(`Joining club: ${club.name}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">UCF Portal</div>
          <nav>
            <span className="mx-2">Hey, {user ? user.name : 'Guest'}</span>
          </nav>
        </div>
      </header>
      <main>
        <section className="container mx-auto py-12 px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Your Clubs</h2>
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Admin Clubs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {adminClubs.map((club, index) => (
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
            <h3 className="text-2xl font-bold mb-4 mt-8">Member Clubs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {userClubs.map((club, index) => (
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
        <hr className="my-8" />
        <section className="container mx-auto py-12 px-4 text-center">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setIsModalOpen(true)}
          >
            Create Your Own Club
          </button>
        </section>
        <hr className="my-8" />
        <section className="container mx-auto py-12 px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Discover Clubs</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {discoverClubs.map((club, index) => (
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
      </main>
      {selectedClub && (
        <ClubModal
          club={selectedClub}
          onClose={() => setSelectedClub(null)}
          onJoin={handleJoinClub}
        />
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ClubForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default ClubListPage;