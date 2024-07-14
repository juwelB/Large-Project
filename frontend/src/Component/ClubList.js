import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ClubList = () => {
  const { user } = useContext(AuthContext);
  const [clubs, setClubs] = useState([]);
  const [sortOption, setSortOption] = useState('All Clubs');
  const [newClub, setNewClub] = useState({ name: '', industry: '', description: '' });

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await axios.get(`/api/v1/clubs/user/${user._id}`);
        setClubs(response.data);
      } catch (error) {
        console.error('Error fetching clubs:', error);
      }
    };

    if (user && user._id) {
      fetchClubs();
    }
  }, [user]);

  const handleJoinLeaveClub = async (clubName) => {
    // Logic to join/leave the club
    console.log(`Toggling membership for club: ${clubName}`);
    try {
      const response = await axios.post('/api/v1/clubs/join-leave', { clubName, userId: user._id });
      setClubs(response.data); // Update clubs state with the new data
    } catch (error) {
      console.error('Error toggling club membership:', error);
    }
  };

  const handleCreateClub = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/v1/clubs/create', {
        ...newClub,
        adminId: user._id,
      });
      setClubs([...clubs, response.data]);
      setNewClub({ name: '', industry: '', description: '' });
    } catch (error) {
      console.error('Error creating club:', error);
    }
  };

  const filteredClubs = sortOption === 'All Clubs' ? clubs : clubs.filter(club => club.role === sortOption);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">UCF Portal</div>
          <nav>
            <Link to="/calendar" className="mx-2 hover:text-gray-300">Calendar</Link>
            <Link to="/dashboard" className="mx-2 hover:text-gray-300">Home</Link>
            <Link to="/events" className="mx-2 hover:text-gray-300">Events</Link>
            <span className="mx-2">Hey, {user ? user.firstName : 'Guest'}</span>
          </nav>
        </div>
      </header>
      <main className="container mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Your Clubs</h2>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="All Clubs">All Clubs</option>
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div className="max-w-4xl mx-auto">
          {filteredClubs.length > 0 ? (
            filteredClubs.map((club, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 mb-4 flex justify-between items-center">
                <div className="flex items-center">
                  <img src={club.logo} alt={`${club.name} logo`} className="w-12 h-12 mr-4" />
                  <div>
                    <h3 className="text-xl font-semibold">{club.name}</h3>
                    <p className="text-gray-600">Role: {club.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleJoinLeaveClub(club.name)}
                  className="bg-gold hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                  style={{ backgroundColor: '#FFD700' }}
                >
                  {club.role ? 'Leave Club' : 'Join Club'}
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No clubs found</p>
          )}
        </div>
        <div className="max-w-4xl mx-auto mt-6">
          <h3 className="text-2xl font-bold mb-4">Create a New Club</h3>
          <form onSubmit={handleCreateClub} className="bg-white rounded-lg shadow-md p-4">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Club Name</label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={newClub.name}
                onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <input
                type="text"
                id="industry"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={newClub.industry}
                onChange={(e) => setNewClub({ ...newClub, industry: e.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={newClub.description}
                onChange={(e) => setNewClub({ ...newClub, description: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gold hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
              style={{ backgroundColor: '#FFD700' }}
            >
              Create Club
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ClubList;
