import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ClubCard from './ClubCard';
import ClubModal from './ClubModal';
import Modal from './Modal';
import ClubForm from './ClubForm';
import axios from 'axios';

const ClubListPage = () => {
  const { user } = useContext(AuthContext);
  const [userClubs, setUserClubs] = useState([]);
  const [adminClubs, setAdminClubs] = useState([]);
  const [discoverClubs, setDiscoverClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserClubs = async () => {
      try {
        const response = await axios.get('/api/v1/clubs/viewMyClubs');
        const data = response.data;
        setUserClubs(data.filter(club => !user.adminOf.includes(club._id)));
        setAdminClubs(data.filter(club => user.adminOf.includes(club._id)));
      } catch (err) {
        setError('Error fetching user clubs: ' + err.message);
      }
    };

    const fetchDiscoverClubs = async () => {
      try {
        const response = await axios.get('/api/v1/clubs/viewAllClubs');
        setDiscoverClubs(response.data);
      } catch (err) {
        setError('Error fetching discover clubs: ' + err.message);
      }
    };

    fetchUserClubs();
    fetchDiscoverClubs();
  }, [user]);

  const handleJoinClub = async (club) => {
    try {
      await axios.post('https://ucf-club-and-event-manager-1c53fb944ab8.herokuapp.com/api/v1/clubs/joinClub', {
        userId: user._id,
        clubId: club._id
      });
      console.log(`Joined club: ${club.name}`);
      // Optionally, update the state to reflect the changes
    } catch (error) {
      console.error('Error joining club:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">UCF Portal</div>
          <nav>
            <Link to="/dashboard" className="mx-2 hover:text-gray-300">Home</Link>
            <Link to="/events" className="mx-2 hover:text-gray-300">Events</Link>
            <Link to="calendar" className="mx-2 hover:text-gray-300">Calendar</Link>
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