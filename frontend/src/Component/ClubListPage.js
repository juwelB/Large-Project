import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ClubCard from './ClubCard';
import ClubModal from './ClubModal';
import ClubForm from './ClubForm';
import EventForm from './EventForm';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ClubListPage = () => {
  const { user, logout } = useContext(AuthContext); // Add logout
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Add state for dropdown

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

  const [userClubs, setUserClubs] = useState([]);
  const [adminClubs, setAdminClubs] = useState([]);
  const [discoverClubs, setDiscoverClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchUserClubs();
      fetchDiscoverClubs();
    }
  }, [user]);

  const fetchUserClubs = async () => {
    try {
      const response = await axios.post('/api/v1/clubs/viewMyClubs', { userId: user._id });
      const data = response.data;
      setAdminClubs(data.filter(club => club.adminId === user._id));
      setUserClubs(data.filter(club => club.adminId !== user._id));
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

  const handleJoinClub = async (clubId, userId) => {
    try {
      await axios.post('/api/v1/clubs/joinClub', {
        userId: userId,
        clubId: clubId
      });
      console.log(`Joined club: ${clubId}`);
      fetchUserClubs();
      fetchDiscoverClubs();
    } catch (error) {
      console.error('Error joining club:', error.response ? error.response.data : error.message);
      setError('Error joining club: ' + (error.response ? error.response.data : error.message));
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
      fetchUserClubs();
      fetchDiscoverClubs();
    } catch (error) {
      console.error('Error leaving club:', error.response ? error.response.data : error.message);
      setError('Error leaving club: ' + (error.response ? error.response.data : error.message));
      toast.error('Error leaving club: ' + (error.response ? error.response.data : error.message), { toastId: 'leaveClubError' });
    }
  };

  const handleDeleteClub = async (clubId) => {
    if(window.confirm("Are you sure you want to delete this club?")) {
      try {
        await axios.delete('/api/v1/clubs/deleteclub', { data: { clubId } });
        console.log(`Deleted club: ${clubId}`);
        fetchUserClubs();
        fetchDiscoverClubs();
      } catch (error) {
        console.error('Error deleting club:', error.response ? error.response.data : error.message);
        setError('Error deleting club: ' + (error.response ? error.response.data : error.message));
        toast.error('Error deleting club: ' + (error.response ? error.response.data : error.message), { toastId: 'deleteClubError' });
      }
    }
  };

  const handleCreateClub = async (createdClub) => {
    // Update the state with the newly created club
    setAdminClubs((prevAdminClubs) => [...prevAdminClubs, createdClub]);
    setDiscoverClubs((prevDiscoverClubs) => [...prevDiscoverClubs, createdClub]);
    setIsModalOpen(false); // Close the modal after successful creation
    toast.success('Successfully Created Club', { toastId: 'createClubSuccess' }); // Add this line
  };

  const handleCreateEvent = (clubId) => {
    setSelectedClub(clubId);
    setIsEventModalOpen(true);
  };

  const handleCloseEventForm = () => {
    setIsEventModalOpen(false);
    setSelectedClub(null);
  };

  return (
    <div className="min-h-screen bg-lightGray">
      <header className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">UCF Portal</div>
          <nav className="flex items-center relative">
            <Link to="/dashboard" className="mx-2 hover:text-gold">Home</Link>
            <Link to="/events" className="mx-2 hover:text-gold">Events</Link>
            <Link to="/calendar" className="mx-2 hover:text-gold">Calendar</Link>
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
        <section className="container mx-auto py-12 px-4">
          <h2 className="text-3xl font-bold mb-6 text-center text-black">Your Clubs</h2>
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-black">Admin Clubs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {adminClubs.length > 0 ? (
                adminClubs.map((club, index) => (
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
                    refetchClubs={fetchUserClubs}
                  />
                ))
              ) : (
                <p className="text-center text-gray-600 col-span-full">Not an Admin in Any Clubs.</p>
              )}
            </div>
            <h3 className="text-2xl font-bold mb-4 mt-8 text-black">Member Clubs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {userClubs.length > 0 ? (
                userClubs.map((club, index) => (
                  <ClubCard
                    key={index}
                    name={club.name}
                    logo={club.clubInfo.logo}
                    description={club.clubInfo.description}
                    className="transform transition-all duration-300 hover:scale-105 hover:border-4 hover:border-darkGold hover:shadow-xl"
                    onClick={() => setSelectedClub(club)}
                    adminId={club.adminId}
                    clubId={club._id}
                    refetchClubs={fetchUserClubs}
                  />
                ))
              ) : (
                <p className="text-center text-gray-600 col-span-full">Not a Member in Any Clubs.</p>
              )}
            </div>
          </div>
        </section>
        <hr className="my-8" />
        <section className="container mx-auto py-12 px-4 text-center">
          <button
            className="bg-gold text-black px-4 py-2 rounded hover:bg-gold-dark transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            Create Your Own Club
          </button>
        </section>
        <hr className="my-8" />
        <section className="container mx-auto py-12 px-4">
          <h2 className="text-3xl font-bold mb-6 text-center text-black">Discover Clubs</h2>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {discoverClubs.map((club, index) => (
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
                  refetchClubs={fetchUserClubs}
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
      <ClubForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateClub}
      />
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

export default ClubListPage;