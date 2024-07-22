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
  const { user } = useContext(AuthContext);
  const [userClubs, setUserClubs] = useState([]);
  const [adminClubs, setAdminClubs] = useState([]);
  const [discoverClubs, setDiscoverClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Add this line
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
      // Refetch user clubs and discover clubs to update the UI
      fetchUserClubs();
      fetchDiscoverClubs();
      toast.success('Successfully Joined Club');
    } catch (error) {
      console.error('Error joining club:', error.response ? error.response.data : error.message);
      setError('Error joining club: ' + (error.response ? error.response.data : error.message));
      toast.error('Error joining club: ' + (error.response ? error.response.data : error.message));
    }
  };

  const handleLeaveClub = async (clubId, userId) => {
    try {
      await axios.post('/api/v1/clubs/leaveClub', {
        userObjId: userId,
        clubObjId: clubId
      });
      console.log(`Left club: ${clubId}`);
      // Refetch user clubs and discover clubs to update the UI
      fetchUserClubs();
      fetchDiscoverClubs();
      toast.dismiss();  // Dismiss existing toasts
      toast.success('Successfully Left Club');
    } catch (error) {
      console.error('Error leaving club:', error.response ? error.response.data : error.message);
      setError('Error leaving club: ' + (error.response ? error.response.data : error.message));
      toast.dismiss();  // Dismiss existing toasts
      toast.error('Error leaving club: ' + (error.response ? error.response.data : error.message));
    }
  };

  const handleDeleteClub = async (clubId) => {
    try {
      await axios.delete('/api/v1/clubs/deleteclub', { data: { clubId } });
      console.log(`Deleted club: ${clubId}`);
      // Refetch user clubs and discover clubs to update the UI
      fetchUserClubs();
      fetchDiscoverClubs();
      toast.dismiss();  // Dismiss existing toasts
      toast.success('Successfully Deleted Club');
    } catch (error) {
      console.error('Error deleting club:', error.response ? error.response.data : error.message);
      setError('Error deleting club: ' + (error.response ? error.response.data : error.message));
      toast.dismiss();  // Dismiss existing toasts
      toast.error('Error deleting club: ' + (error.response ? error.response.data : error.message));
    }
  };

  const handleCreateClub = async (createdClub) => {
    // Update the state with the newly created club
    setAdminClubs((prevAdminClubs) => [...prevAdminClubs, createdClub]);
    setDiscoverClubs((prevDiscoverClubs) => [...prevDiscoverClubs, createdClub]);
    setIsModalOpen(false); // Close the modal after successful creation
    toast.success('Successfully Created Club'); // Add this line
  };

  const handleCreateEvent = async (eventData) => {
    try {
      await axios.post('/api/v1/events/createEvent', eventData);
      fetchUserClubs();
      fetchDiscoverClubs();
      toast.dismiss();  // Dismiss existing toasts
      toast.success('Successfully Created Event');
    } catch (error) {
      console.error('Error creating event:', error.response ? error.response.data : error.message);
      toast.dismiss();  // Dismiss existing toasts
      toast.error('Error creating event: ' + (error.response ? error.response.data : error.message));
    }
  };

  const handleCloseEventForm = () => {
    setIsEventModalOpen(false);
    setSelectedClub(null);
  };

  return (
    <div className="min-h-screen bg-lightGray">
      <ToastContainer />
      <header className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">UCF Portal</div>
          <nav>
            <Link to="/dashboard" className="mx-2 hover:text-gold">Home</Link>
            <Link to="/events" className="mx-2 hover:text-gold">Events</Link>
            <Link to="/calendar" className="mx-2 hover:text-gold">Calendar</Link>
            <span className="mx-2">Hey, {user ? user.name : 'Guest'}</span>
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
                    className="transform transition-all duration-300 hover:scale-105 hover:border-4 hover:border-gold hover:shadow-xl"
                    onClick={() => setSelectedClub(club)}
                    onCreateEvent={() => handleCreateEvent(club._id)}
                    adminId={club.adminId}
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
                    className="transform transition-all duration-300 hover:scale-105 hover:border-4 hover:border-gold hover:shadow-xl"
                    onClick={() => setSelectedClub(club)}
                    adminId={club.adminId}
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
                  className="transform transition-all duration-300 hover:scale-105 hover:border-4 hover:border-gold hover:shadow-xl"
                  onClick={() => setSelectedClub(club)}
                  onCreateEvent={() => handleCreateEvent(club._id)} // Add this line
                  adminId={club.adminId}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      {selectedClub && !isEventModalOpen && ( // Ensure ClubModal is not shown when EventForm is open
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
          onCreate={handleCreateEvent} // Add this line
        />
      )}
    </div>
  );
};

export default ClubListPage;